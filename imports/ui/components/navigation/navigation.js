import "./navigation.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.navigation.onCreated(function () {
  this.path = new ReactiveVar("");

  this.autorun(function () {
    FlowRouter.watchPathChange();
    const path = FlowRouter.current().path;
    Template.instance().path.set(path);
  });
});

Template.navigation.helpers({
  isHomePage: function () {
    return "/" !== Template.instance().path.get() ? "homePage" : "";
  },

  getMeteorUser() {
    return Meteor.user();
  },

  isCurrentLng: function (lng) {
    return lng === localStorage.getItem("lng") ? "selected" : "";
  },
});

Template.navigation.events({
  "click .logout": function (event, template) {
    FlowRouter.go('/')
    Meteor.logout();

  },

  "change #lng": function (event, tenplate) {
    var lang = $(event.target).val();
    TAPi18n.setLanguage(lang)
      .done(function () {})
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
    localStorage.setItem("lng", lang);
  },
});
