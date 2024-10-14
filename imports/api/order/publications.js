import { Order } from "./collections";
import { Ticket } from "../ticket/collections";

Meteor.publishComposite("orderWithTicket", function (query = {}) {
  if (!this.userId) return;

  const user = Meteor.user();
  if (!user?.profile?.isAdmin) {
    query = { ...query, userId: Meteor.UserId() };
  }
  return {
    find: Order.find(query),
    children: [
      {
        find: function (ticketId) {
          return Ticket.findOne(ticketId, { field: { number: 1 } });
        },
      },
    ],
  };
});
