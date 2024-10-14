import { Ticket } from "../ticket/collections";
import { Flight } from "./collections";
import { Order } from "../order/collections";
import { OrderPassenger } from "../orderPassenger/collections";

// Publish flights with given query, default query is an empty object
Meteor.publish("flights", function (query = {}) {
  query = { ...query, status: "ACTIVE" };
  return Flight.find(query);
});

// Publish composite data for flights with tickets using the provided query
Meteor.publishComposite("flightsWithTicket", function (query) {
  const dateToCompare = new Date(query.date?.split(".").reverse().join("-"));
  const intervalDate = query.dateInterval
    ? new Date(query.dateInterval?.split(".").reverse().join("-"))
    : null;
  let queries = {
    from: query?.from,
    to: query?.to,
    status: "ACTIVE"
  };

  console.log(query.passengerCount);

  if (dateToCompare) {
    if (intervalDate) {
      queries.date = { $gte: dateToCompare, $lt: intervalDate };
    } else {
      queries.date = { $gte: dateToCompare };
    }
  }

  return {
    // Find flights that match the built queries
    find: function () {
      return Flight.find(queries);
    },
    children: [
      // Publish related tickets for each flight found
      {
        find: function (flight) {
          return Ticket.find({
            flightId: flight._id,
            type: query?.type,
            $expr: {
              $lt: [
                { $subtract: ["$count", "$soldCount"] },
                query.passengerCount,
              ],
            },
          });
        },
      },
    ],
  };
});

// Publish composite data for flights with tickets using the provided query
Meteor.publishComposite("flightSeats", function (query) {
  return {
    find: function () {
      return Flight.find({ _id: query._id });
    },
    children: [
      {
        find: function (flight) {
          return Ticket.find(
            {
              flightId: flight._id,
              type: query.type,
            },
            { fields: { _id: 1, count: 1 } }
          );
        },
        children: [
          {
            find: function (ticket) {
              return Order.find(
                { ticketId: ticket._id },
                { fields: { _id: 1 } }
              );
            },
            children: [
              {
                find: function (order) {
                  return OrderPassenger.find(
                    { orderId: order._id },
                    { fields: { seat: 1 } }
                  );
                },
              },
            ],
          },
        ],
      },
    ],
  };
});
