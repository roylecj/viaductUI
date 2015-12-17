Template.header.onRendered(function() {
    Session.set("PasswordUnset", true);
    Session.set("PasswordErrorFlag", false);
});

Template.header.helpers({
  currentUserName: function() {
    return Meteor.user().profile.name;
  },
  alertFlag: function() {
    return "btn-danger"
  },
  isAlert: function() {
    return true
  },
  signedIn: function() {
    return Session.get("signedIn");
  },
  adminUser: function() {
    var usrId;

    usrId = Meteor.userId();

    var inRole;

    inRole = Roles.userIsInRole(usrId, ['admin']);
    if (inRole) {
      return true;
    } else {
      return false;
    }
  },
  unreadTasks: function() {
    var userId = Meteor.user()._id;

    console.log("userid= " + userId);

    if (Tasks.find({user: userId, seenFlag: false, completeFlag: false}).count() > 0) {
      return true
    } else {
      return false
    }
  },
  taskCount: function() {
    var userId = Meteor.user()._id;

    return Tasks.find({user: userId, seenFlag: false, completeFlag: false}).count()
  },
  correctState: function() {
    if (Session.get("PasswordUnset")) {
      return ""
    }
    else {
      if (Session.get("PasswordErrorFlag")) {
        return "has-error"
      } else {
        return "has-success"
      }

    }
  },
  passwordError: function() {
    return Session.get("PasswordErrorFlag")
  }
});

Template.header.events({
  'click .btnLogout': function(e) {

    Session.set("signedIn", false);
    Meteor.logout();
    Router.go("login");
  }
});
