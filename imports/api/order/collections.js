import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Order = new Mongo.Collection("order");

const Schema = {};

Schema.Order = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    autoValue: function () {
      return Meteor.userId();
    },
  },
  gate: {
    type: String,
    label: "Gate",
    optional: true,
  },
  ticketId: {
    type: String,
  },
  baggageWeight: {
    type: Number,
    optional: true,
  },
  price: {
    type: Number,
    label: "Price",
  },
  createdDate: {
    type: Date,
    label: "Created Date",
    autoValue: function () {
      return new Date();
    },
  },
});

export const OrderInsertValidator = Schema.Order.namedContext("orderForm");

Order.attachSchema(Schema.Order);
