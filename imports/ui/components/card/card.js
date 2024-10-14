import "./card.html";
import { Flight } from "../../../api/flight/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import moment from "moment/moment";

Template.card.helpers({
  getFlights: function (flightId) {
    return Flight.findOne(flightId);
  },

  getDate: function (date) {
    return moment(date).format("DD MMM YYYY");
  },

  getDiff: function (date1, time1, date2, time2) {
    const start = moment(date1);
    const end = moment(date2);

    const startTime = moment(time1, "HH:mm");
    const endTime = moment(time2, "HH:mm");

    const startDateTime = moment(start).set({
      hour: startTime.hour(),
      minute: startTime.minute(),
    });

    const endDateTime = moment(end).set({
      hour: endTime.hour(),
      minute: endTime.minute(),
    });

    const duration = moment.duration(endDateTime.diff(startDateTime));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    let result = "";

    if (days !== 0) {
      result += `${days} gün `;
    }

    if (hours !== 0) {
      result += `${hours} saat `;
    }

    if(minutes !== 0){
      result += `${minutes} dəq `;
    }

    return result;
  },

  checkBusiness(status) {
    return status === "Business";
  },
  checkEconomy(status) {
    return status === "Economy";
  },
});

Template.card.events({
  "click #econom": function (event, template) {
    Session.set("flight", this);
    FlowRouter.go("/selectTicket")
  },
});
