import { Ticket } from "../ticket/collections";
import { ROLES } from "../../startup/both/constants/roles";
import { Order } from "./collections";
import { Flight } from "../flight/collections";
import { Passenger } from "../passenger/collections";
import { OrderPassenger } from "../orderPassenger/collections";
import { Planes } from "../plane/collections";
import { addDDPRule } from "../addDDPRule";

const methods = {
  "ticket.buy": function (data) {
    console.log(data);

    const ticket = Ticket.findOne(data.ticketId);

    // check the count of ticket
    if (ticket.count < ticket.soldCount + data.count) {
      throw new Meteor.Error("lessCount");
    }

    // sum all baggage of order collection according flight collection
    const flight = Flight.findOne(ticket.flightId);
    const plane = Planes.findOne(flight.planeId);
    const baggageWeight = Order.find({ flightId: flight._id })
      .fetch()
      .reduce((sum, x) => {
        return sum + x.baggage;
      }, 0);

    // check baggage weight
    if (baggageWeight + data.baggageWeight > plane.baggageCapacity) {
      throw new Meteor.Error("lessBaggageWeight");
    }

    // check the amount of user
    if (Meteor.user().profile.amount < data.price) {
      throw new Meteor.Error("lessAmount");
    }

    // create order
    const orderId = Order.insert(
      {
        price: data.price,
        ticketId: data.ticketId,
        userId: Meteor.userId(),
        baggageWeight: data.baggageWeight,
      },
      (err) => {
        if (err) {
          throw new Meteor.Error("serverError");
        }
      }
    );

    // create passengers
    for (let i = 0; i < data.passengers.length; i++) {
      let passengerId = 0;
      // check passenger exists in database
      const passenger = Passenger.findOne(
        {
          passportNumber: data.passengers[i].passportNumber,
        },
        (err) => {
          if (err) {
            console.log(err);
            throw new Meteor.Error("serverError");
          }
        }
      );
      if (passenger) {
        passengerId = passenger._id;
      } else {
        passengerId = Passenger.insert(data.passengers[i], (err) => {
          if (err) {
            console.log(err);
            throw new Meteor.Error("serverError");
          }
        });
      }
      OrderPassenger.insert(
        {
          passengerId,
          orderId,
          seat: data.passengers[i].seat,
          baggage: data.passengers[i].baggage,
        },
        (err) => {
          if (err) {
            console.log(err);
            throw new Meteor.Error("serverError");
          }
        }
      );
    }

    // increase sold count of ticket
    Ticket.update(
      { _id: data.ticketId },
      {
        $inc: {
          soldCount: data.count,
        },
      },
      (err) => {
        if (err) {
          console.log(err);

          throw new Meteor.Error("serverError");
        }
      }
    );

    // decrease balance of user
    Meteor.users.update(
      {
        _id: Meteor.userId(),
      },
      {
        $inc: {
          "profile.amount": -parseInt(ticket.price),
        },
      },
      (err) => {
        if (err) {
          throw new Meteor.Error("serverError");
        }
      }
    );

    // increase balance of admin
    Meteor.users.update(
      {
        _id: Meteor.users.findOne({ "profile.role": ROLES.admin })?._id,
      },
      {
        $inc: {
          "profile.amount": parseInt(ticket.price),
        },
      },
      (err) => {
        if (err) {
          throw new Meteor.Error("serverError");
        }
      }
    );

    return orderId;
  },
};

Meteor.methods(methods);

if (Meteor.isServer) {
  addDDPRule(methods, 3, 5000);
}
