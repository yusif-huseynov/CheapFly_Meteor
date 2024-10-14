import "./homeMain.html";
import { countries } from "../../../startup/both/countries";

Template.homeMain.onCreated(function () {
  this.passengers = new ReactiveVar(1);
  this.change = new ReactiveVar();
});

Template.homeMain.helpers({
  getPassengers() {
    return Template.instance().passengers.get();
  },
  getChagne() {
    return Template.instance().change.get();
  },

  countryList: function () {
    return countries;
  },
});

Template.homeMain.events({
  "click .adultsMinus "(event, template) {
    if (template.passengers.get() <= 1) return;
    let newCount = template.passengers.get() - 1;
    template.passengers.set(newCount);
  },

  "click .adultsPlus "(event, template) {
    if (template.passengers.get() >= 9) return;
    let newCount = template.passengers.get() + 1;
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

  "click .fa-right-left"(event, template) {
    let from = $("#from").val();
    let to = $("#to").val();

    let data = {
      from,
      to,
    };
    template.change.set(data);
  },
});
