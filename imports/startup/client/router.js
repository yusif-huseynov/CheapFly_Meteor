import { FlowRouter } from "meteor/ostrio:flow-router-extra";

// =========== COMPONENTS
import "../../ui/components/navigation/navigation";
import "../../ui/components/card/card";
import "../../ui/components/selectSeatModal/selectSeatModal";

// ========= LAYOUTS
import "../../ui/layouts/mainLayouts";

//========== Pages
import "../../ui/pages/homeMain/homeMain";
import "../../ui/pages/flights/flights";
import "../../ui/pages/login/login";
import "../../ui/pages/signUp/signUp";
import "../../ui/pages/selectTicket/selectTicket";
import "../../ui/pages/personalAccounts/personalAccounts";

// Triggers
FlowRouter.triggers.enter(
  [
    () => {
      if (!Meteor.userId()) {
        FlowRouter.go("login");
      }
    },
  ],
  { only: ["personAccount"] }
);

FlowRouter.triggers.enter(
  [
    () => {
      if (Meteor.userId()) {
        FlowRouter.go("/");
      }
    },
  ],
  { only: ["login","signUp"] }
);

FlowRouter.route("/", {
  name: "home",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "homeMain",
    });
  },
});

FlowRouter.route("/flights", {
  name: "flights",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "flights",
    });
  },
});

FlowRouter.route("/login", {
  name: "login",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "login",
    });
  },
});

FlowRouter.route("/signUp", {
  name: "signUp",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "signUp",
    });
  },
});

FlowRouter.route("/selectTicket", {
  name: "selectTicket",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "selectTicket",
    });
  },
});

FlowRouter.route("/personal-accounts", {
  name: "personAccount",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "personalAccounts",
    });
  },
});
