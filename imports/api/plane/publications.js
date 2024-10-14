import { Planes } from "./collections";

Meteor.publish("planes", function (query = {}) {
  if (!this.userId) {
    throw new Meteor.Error("You are logged out");
  }

    const user = Meteor.users.findOne(this.userId);
    if (!user?.profile?.isAdmin) {
      throw new Meteor.Error("You are not admin");
    }
    if (user?.profile?.role === "adminstrator") {
      query = { ...query, _id: user.profile.planeId };
    }
  return Planes.find(query);
});
