// import { Result } from "postcss";

Meteor.methods({
  addUsers(data) {
    let result = Accounts.createUser({
      email: data.signUpEmail,
      password: data.signUpPassword,
      profile: {
        fName: data.firstName,
        lName: data.lastName,
        FIN: data.finCode,
        amount: data.amount,
      },
    });
    return result;
  },
});
