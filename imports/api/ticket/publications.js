import { Ticket } from "./collections";
import {Flight} from '../flight/collections'
import {Planes} from '../plane/collections'

Meteor.publishComposite("tickets", function (query={}) {
  console.log(query);
  return {
    find() {
      return Ticket.find(query);
    },
    children: [
      {
        find(ticket) {
          return Flight.find(
            { _id: ticket.flightId },
          );
        }
      },
    ],
  };
});
