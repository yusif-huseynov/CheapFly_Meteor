import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Planes = new Mongo.Collection("planes");

const Schema = {};

Schema.Plane = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200,
  },
  airlineId: {
    type: String,
    label: "Airline",
  },
  pilot: {
    type: String,
    label: "Pilot",
  },
  model: {
    type: String,
    label: "Model",
  },
  type: {
    type: String,
    label: "Type",
  },

  gate: {
    type: String,
    label: "Gate",
  },

  ecoCapacity: {
    type: Number,
    label: "Economic Capacity",
  },
  businessCapacity: {
    type: Number,
    label: "Business Capacity",
  },

  baggageCapacity: {
    type: Number,
    label: "Baggage Capacity",
  },

  status: {
    type: String,
    label: "Status",
    max: 200,
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function () {
      return new Date();
    },
  },
});

Planes.attachSchema(Schema.Plane);
