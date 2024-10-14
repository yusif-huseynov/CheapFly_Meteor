import { Passenger } from "../../../api/passenger/collections";
import { Flight } from "../../../api/flight/collections";
import { Ticket } from "../../../api/ticket/collections";
import "./personalAccounts.html";
import jsPDF from "jspdf";
import { OrderPassenger } from "../../../api/orderPassenger/collections";
import { Order } from "../../../api/order/collections";
import { getTicketDesign } from "../../../startup/both/constants/ticket.js";

Template.personalAccounts.onCreated(function () {
  this.autorun(() => {
    this.subscribe("orderPassenger");
  });
});

Template.personalAccounts.helpers({
  getOrderPassengers: function () {
    return OrderPassenger.find().fetch();
  },

  getPassenger: function (passengerId) {
    return Passenger.findOne(passengerId);
  },

  getDate: function (date) {
    return moment(date).format("DD MMM YYYY");
  },

  getFlights: function (orderId) {
    const order = Order.findOne({ _id: orderId });
    const ticket = Ticket.findOne({ _id: order.ticketId });
    return Flight.findOne({ _id: ticket.flightId });
  },

  getTicket: function (orderId) {
    const order = Order.findOne({ _id: orderId });
    return Ticket.findOne({ _id: order.ticketId });
  },

  getTotalPrice(price, baggagePrice, count) {
    console.log(price, baggagePrice, count);
    return price + baggagePrice * count;
  },
});

Template.personalAccounts.events({
  "click #export": function (event, template) {
    // get passenger, flight, ticket data and print
    const passenger = Passenger.findOne({ _id: this.passengerId });
    const order = Order.findOne({ _id: this.orderId });
    const ticket = Ticket.findOne({ _id: order.ticketId });
    const flight = Flight.findOne({ _id: ticket.flightId });
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [250, 610], // Custom page size, adjust as needed
    });

    doc.html(getTicketDesign(passenger, flight, ticket, this), {
      callback: function (pdf) {
        pdf.save("flight_ticket.pdf");
      },
    });
  },
});
