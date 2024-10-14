import "./login.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";



Template.login.helpers({});

Template.login.events({
  "submit  #loginForm"(event, template) {
    event.preventDefault();

    let email = $("#loginEmail").val();
    let password = $("#loginPassword").val();

    // console.log(email, password);
    Meteor.loginWithPassword(email, password, function (err) {
      if (err) {
        console.log("Şifre ve ya Password Yanlış !");
        $("#incorrectPass").css("display", "block");
      } else {
        console.log("isledi");
        FlowRouter.go('/')
      }
    });
  },
});
