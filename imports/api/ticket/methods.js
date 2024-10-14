import { Ticket } from "./collections";
import { Flight } from "../flight/collections";
import { Planes } from "../plane/collections";

Meteor.methods({
  "seat.count": function (flightId) {
    const tickets = Ticket.find({ flightId }).fetch();
    // count amount of all ticket.counts
    const total = tickets.reduce(
      (pre, next) => {
        if (next.type === "business") {
          pre.business += next.count;
        } else {
          pre.econom += next.count;
        }
        return pre;
      },
      {
        business: 0,
        econom: 0,
      }
    );

    const seats = [
      ...Array.from({ length: total.econom }, (_, i) => `E${i + 1}`),
      ...Array.from({ length: total.business }, (_, i) => `B${i + 1}`),
    ];

    return seats;
  },
});
