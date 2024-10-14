import "./selectTicket.html";
import { Flight } from "../../../api/flight/collections";
import { PassengerInsertValidator } from "../../../api/passenger/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { countries } from "../../../startup/both/countries";

Template.selectTicket.onCreated(function () {
  this.baggageCount = new ReactiveVar(0);

  // get passenger count from session
  this.passengerCount = new ReactiveVar(
    parseInt(Session.get("passCount")) || 1
  );

  // create passengers array
  this.passengers = new ReactiveVar(
    Array(Template.instance().passengerCount.get())
      .fill("")
      .map((x, i) => ({ id: i + 1 }))
  );
});

Template.selectTicket.onRendered(function () {
  // check session if not exist go to home page
  Tracker.autorun(function () {
    if (!Session.get("flight")) {
      FlowRouter.go("/");
    }
  });
});

Template.selectTicket.helpers({
  // get flight
  getFlight: function () {
    const data = Session.get("flight");
    return {
      flight: Flight.findOne({ _id: data.ticket.flightId }),
      ...data.ticket,
    };
  },

  getCountry: function () {
    return countries;
  },

  // get baggage count
  getPrice: function () {
    return (
      parseInt(
        +Session.get("flight")?.ticket.price *
          +Template.instance().passengerCount.get()
      ) +
      parseInt(
        +Session.get("flight")?.ticket.baggagePrice *
          +Template.instance().baggageCount.get()
      )
    );
  },

  // get passengers count
  getPassengers: function () {
    return Template.instance().passengers.get();
  },
});

Template.selectTicket.events({
  // sum baggage count
  "change .baggages": function (event, template) {
    const passengers = template.passengers.get();

    let sum = 0;
    passengers.map((x, i) => {
      let baggageCount = $(`#baggage-${x.id}`).val()
        ? parseInt($(`#baggage-${x.id}`).val())
        : 0;
      sum += baggageCount;
    });
    template.baggageCount.set(sum);
  },

  "click #comfirm": function (event, template) {
    if (!Meteor.user()) {
      FlowRouter.go("/signUp");
      return;
    }

    if (
      !Session.get("seats") ||
      Session.get("seats").length < template.passengerCount.get()
    ) {
      Swal.fire({
        icon: "error",
        title: "Erorr hapenned!",
        text: "Please select seats for all passengers!",
      });
      return;
    }

    const data = {
      ticketId: Session.get("flight")?.ticket?._id,
      price:
        parseInt(Session.get("flight")?.ticket?.price) *
          template.passengerCount.get() +
        parseInt(Session.get("flight")?.ticket?.baggagePrice) *
          template.baggageCount.get(),
      passengers: [],
      count: parseInt(template.passengerCount.get()),
      baggageWeight: parseInt(template.baggageCount.get()),
    };

    const passengers = template.passengers.get();
    let isError = false;

    passengers.forEach((passenger, i) => {
      const passengerData = {
        firstName: $(`#form-${passenger.id} input[name="firstName"]`).val(),
        lastName: $(`#form-${passenger.id} input[name="lastName"]`).val(),
        gender: $(`#form-${passenger.id} input[name="gender"]:checked`).val(),
        birthDate: $(`#form-${passenger.id} input[name="birthdate"]`).val(),
        passportNumber: $(
          `#form-${passenger.id} input[name="passportNumber"]`
        ).val(),
        passportCountry: $(
          `#form-${passenger.id} select[name="passportCountry"]`
        ).val(),
        passportExpiredDate: $(
          `#form-${passenger.id} input[name="passportExpiredDate"]`
        ).val(),
      };

      // Check birthdate, is it valid?
      if (moment(passengerData.birthDate).isAfter(moment())) {
        isError = true;
        Swal.fire({
          icon: "error",
          title: "Erorr hapenned!",
          text: "Birthdate is not valid!",
        });
        return;
      }

      // check passportExpiredDate valid with momentjs
      if (moment(passengerData.passportExpiredDate).isBefore(moment())) {
        isError = true;
        Swal.fire({
          icon: "error",
          title: "Erorr hapenned!",
          text: "Passport expired date is not valid!",
        });
        return;
      }

      // Validate the passenger data
      PassengerInsertValidator.reset();
      const cleanedData = PassengerInsertValidator.clean(passengerData);
      PassengerInsertValidator.validate(cleanedData);
      if (!PassengerInsertValidator.isValid()) {
        isError = true;
        Swal.fire({
          icon: "error",
          title: "Erorr hapenned!",
          text: "Passenger data is not valid!",
        });
        return;
      }

      // Add seat and baggage data after validation
      cleanedData.seat = Session.get("seats")[i];
      cleanedData.baggage = $(`#baggage-${passenger.id}`).val();
      data.passengers.push(cleanedData);
    });

    // Check if there were any validation errors
    if (isError) return;

    // Buy ticket
    Meteor.call("ticket.buy", data, (err, result) => {
      if (err) {
        return;
      } else if (result) {
        Swal.fire("Success!", "Ticket is succesfully bought", "success").then(
          () => {
            FlowRouter.go("/personal-accounts");
          }
        );
      }
    });
  },
});
