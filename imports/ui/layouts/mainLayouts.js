import './mainLayouts.html'

Template.mainLayout.onCreated(function () {
    if (Meteor.isClient) {
      Meteor.startup(function () {
        var lang = localStorage.getItem("lng") || "en";
        TAPi18n.setLanguage(lang)
          .done(function () {})
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });
        localStorage.setItem("lng", lang);
      });
    }
  });