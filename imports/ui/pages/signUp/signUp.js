import "./signUp.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";


Template.signUp.onCreated(function () {
  this.changeInput = new ReactiveVar();
});

Template.signUp.helpers({
  getChangeInput() {
    return Template.instance().changeInput.get();
  },
});

Template.signUp.events({
  "input .form-control "(event, template) {
    let finCode = $("#FIN").val().toUpperCase(); // Fin code uppercase configration
    let firstName =
      $("#signUp_firstName").val().charAt(0).toUpperCase() +
      $("#signUp_firstName").val().slice(1);
    let lastName =
      $("#signUp_lastName").val().charAt(0).toUpperCase() +
      $("#signUp_lastName").val().slice(1);
    let signUpEmail = $("#signUpEmail").val();
    let signUpPassword = $("#signUpPassword").val();

    let inputCollection = {
      firstName,
      lastName,
      signUpEmail,
      signUpPassword,
      finCode,
    };

    template.changeInput.set(inputCollection);
  },

  "submit #signUpForm"(event, template) {
    // Sumbit reload
    event.preventDefault();

    // Sign up feth User details
    let firstName = $("#signUp_firstName").val();
    let lastName = $("#signUp_lastName").val();
    let finCode = $("#FIN").val();
    let signUpEmail = $("#signUpEmail").val();
    let signUpPassword = $("#signUpPassword").val();
    let amount = 1000000;

    //  Input  empty check
    if (
      firstName === "" ||
      lastName === "" ||
      finCode === "" ||
      signUpEmail === "" ||
      signUpPassword === ""
    ) {
      let alertMessage = document.getElementsByClassName("alertText")[0];
      alertMessage.style.display = "block";
      return;
    }

    let data = {
      firstName,
      lastName,
      finCode,
      signUpEmail,
      signUpPassword,
      amount
    }
    // Creaate User
    console.log(data.amount);
    Meteor.call('addUsers' , data ,   function(err, success) {
      if (err) { 
        console.log('Error:' + err);
      }if (success) {
        console.log('Success:'+ success);
        FlowRouter.go("/login")
      }
    });

    //Input Value Empty
    event.target.reset()
  },
});
