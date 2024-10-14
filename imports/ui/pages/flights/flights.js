import { Ticket } from "../../../api/ticket/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import "./flights.html";
import { Flight } from "../../../api/flight/collections";
import { capitalizeFirstChar } from "../../../startup/both/globalMethods.js";

Template.flights.onCreated(function () {
  // ReactiveVar to store the current path information
  this.path = new ReactiveVar();
  this.passengers = new ReactiveVar(
    FlowRouter.getQueryParam("passangerCount")
      ? parseInt(FlowRouter.getQueryParam("passangerCount"))
      : 1
  );

  this.autorun(() => {
    // Watch for changes in the URL query parameters
    FlowRouter.watchPathChange();

    // Get query parameters from the URL
    const to = capitalizeFirstChar(FlowRouter.getQueryParam("to"));
    const from = capitalizeFirstChar(FlowRouter.getQueryParam("from"));
    const date = FlowRouter.getQueryParam("date");
    const passengerCount = FlowRouter.getQueryParam("passangerCount") ?? 1;
    const dateInterval = FlowRouter.getQueryParam("dateInterval");
    const type = FlowRouter.getQueryParam("type");

    if (!to || !from) {
      FlowRouter.go("/");
    }

    // Set the path information in the reactive variable
    this.path.set({
      to,
      from,
      date,
      type,
      dateInterval,
      passengerCount
    });

    // Set the passenger count in the Session to use it in the template
    Session.set("passCount", passengerCount);
  });

  this.autorun(() => {
    // Subscribe to the "flightsWithTicket" publication based on the current path information
    this.subscribe("flightsWithTicket", this.path.get());
  });
});

Template.flights.helpers({
  // Helper function to fetch tickets based on the flights found in the current subscription
  getTickets: function () {
    // Find flight IDs from the "Flight" collection
    const flightIds = Flight.find({}, { fields: { _id: 1 } }).map(
      (fl) => fl._id
    );

    // Helper function to initialize the graph
    function initializeGraph(dt) {
      const graph = {};
      for (const { to, from } of dt) {
        if (!graph[to]) graph[to] = {};
        if (!graph[from]) graph[from] = {};
        graph[to][from] = 1;
        graph[from][to] = 1;
      }
      return graph;
    }

    // Find tickets that have a "flightId" in the array of flight IDs
    return Ticket.find({ flightId: { $in: flightIds } }).fetch();
  },

  // Helper function to get the current search parameters from the reactive variable
  getTicketSearch() {
    return Template.instance().path.get();
  },

  // Helper function to get the number of passengers from the Session
  getPassengers: function () {
    return Template.instance().passengers.get();
  },

  // Helper function to determine if the Economy ticket type checkbox should be checked
  changeValueEconomy() {
    let check = Template.instance().path.get();
    if (check.ticketTypeBusiness === "on") {
      return "checked";
    }
  },

  // Helper function to determine if the Business ticket type checkbox should be checked
  changeValueBusiness() {
    let check = Template.instance().path.get();
    if (check.ticketTypeEconomy === "on") {
      return "checked";
    }
  },

  getPassengers() {
    return Template.instance().passengers.get();
  },
});

Template.flights.events({
  "click .adultsMinus "(event, template) {
    if (template.passengers.get() <= 1) return;
    let newCount = template.passengers.get() - 1;
    template.passengers.set(newCount);
  },

  "change #deportDate"(event, template) {
    const date = event.target.value;
    // check passportExpiredDate valid with momentjs
    if (moment(date).isBefore(moment(new Date()))) {
      // replace today's date
      event.target.value = moment(new Date()).format("YYYY-MM-DD");
    }
  },

  "click .adultsPlus "(event, template) {
    if (template.passengers.get() >= 9) return;
    let newCount = template.passengers.get() + 1;
    template.passengers.set(newCount);
  },

  "click .passanger"(event, template) {
    //  height: min-content;
    let passangerSlide = document.querySelector(".option");
    passangerSlide.classList.toggle("options_Open");
  },

  "click .fa-right-left"(event, template) {
    let from = $("#from").val();
    let to = $("#to").val();

    let data = {
      from,
      to,
    };
    template.path.set({ ...template.path.get(), to: data.from, from: data.to });
  },
});
