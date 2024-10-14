import "./selectSeatModal.html";
import { OrderPassenger } from "../../../api/orderPassenger/collections";
import { Ticket } from "../../../api/ticket/collections";

Template.selectSeatModal.onCreated(function () {
  this.seats = new ReactiveVar([]);
  this.autorun(() => {
    this.subscribe("flightSeats", {
      _id: Session.get("flight")?.ticket.flightId,
      type: Session.get("flight")?.ticket.type,
    });
  });

  this.autorun(() => {
    const orderPassenger = OrderPassenger.find().fetch();
    this.seats.set(orderPassenger);
  });

  this.selectedSeat = new ReactiveVar([]);
  this.countLimit = new ReactiveVar(Session.get("passCount"));
});

Template.selectSeatModal.onRendered(function () {
  $('[data-toggle="tooltip"]')?.tooltip();
});

Template.selectSeatModal.helpers({
  getSeats: function () {
    const tickets = Ticket.find().fetch();
    // count amount of all ticket.counts
    const total = tickets.reduce((pre, next) => {
      pre += next.count;
      return pre;
    }, 0);

    const seats = Array.from(
      { length: total },
      (_, i) => `${Session.get("flight")?.ticket.type[0]}${i + 1}` // First character of Type + index
    );

    return seats;
  },

  checkSelected: function (seat) {
    const seats = Template.instance()
      .seats.get()
      .map((x) => x.seat);
    if (seats.includes(seat)) {
      return "taken";
    } else if (Template.instance().selectedSeat.get().includes(seat)) {
      return "selected";
    } else {
      ("");
    }
  },

  checkBusiness: function () {
    return Session.get("flight")?.ticket.type === "Business"
      ? "business-seat"
      : "seat-item";
  },
});

Template.selectSeatModal.events({
  "click .seat": function (event, template) {
    const selectedSeats = template.selectedSeat.get();
    if (selectedSeats.includes(this.toString())) {
      selectedSeats.pop(this.toString());
    } else {
      if (template.countLimit.get() > selectedSeats.length) {
        selectedSeats.push(this.toString());
      }
    }
    template.selectedSeat.set(selectedSeats);
  },

  "click #comfirm-seat": function (event, template) {
    Session.set("seats", template.selectedSeat.get());
    $("#selectSeatModal").modal("hide");
  },
});
