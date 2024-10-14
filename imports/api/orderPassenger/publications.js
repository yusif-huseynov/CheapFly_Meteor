import { OrderPassenger } from "./collections";
import { Passenger } from "../passenger/collections";
import { Order } from "../order/collections";
import { Ticket } from "../ticket/collections";
import { Flight } from "../flight/collections";

Meteor.publish("orderPassengers", function (query = {}, limit, skip = 0) {
  if (!Meteor.userId()) return;
  return OrderPassenger.find();
});

Meteor.publishComposite("orderPassenger", function (query = {}) {
  if (!Meteor.userId()) return;

  return {
    find: function () {
      return Order.find({ ...query, userId: Meteor.userId() });
    },
    children: [
      {
        find: function (order) {
          return OrderPassenger.find({
            orderId: order._id,
          });
        },
        children: [
          {
            find: function (orderPassenger) {
              return Passenger.find({
                _id: orderPassenger.passengerId,
              });
            },
          },
        ],
      },
      {
        find: function (order) {
          // Check if order has the 'ticketId' field before querying Ticket collection
          if (order && order.ticketId) {
            return Ticket.find(
              { _id: order.ticketId }
            );
          }
          return this.ready();
        },
        children: [
          {
            find: function (order) {
              // Check if order has the 'flightId' field before querying Flight collection
              if (order && order.flightId) {
                return Flight.find({ _id: order.flightId });
              }
              return this.ready();
            },
          },
        ],
      },
    ],
  };
});
