Template.runtimeList.onCreated(function() {
  Session.setDefault("addEnvironmentFlag", false);
  Session.setDefault("invalidPort", false);
});

Template.runtimeList.helpers({
  runtimeListEntry: function() {
    console.log(Meteor.userId());
    console.log(ViaductRuntimes.find({user: Meteor.userId()}).count());
    return ViaductRuntimes.find({user: Meteor.userId()}).fetch();
  },
  addEnvironment: function() {
    return Session.get("addEnvironmentFlag");
  },
  newPortStatus: function() {
    if (Session.get("invalidPort")) {
      return "has-error"
    } else {
      return "has-success"
    }
  },
  newIPStatus: function() {
    if (Session.get("invalidIP")) {
      return "has-error"
    } else {
      return "has-success"
    }
  },
  isDisabled: function() {
    if (Session.get("invalidIP") || Session.get("invalidPort")) {
      return "disabled"
    } else {
      return ""
    }
  }
});

Template.runtimeList.events({
  'click .btnAddEnvironment': function(e, t) {
    e.preventDefault();

    Session.set("addEnvironmentFlag", true);
  },
  'click .btnCancelAdd': function(e, t) {
    e.preventDefault();

    Session.set("addEnvironmentFlag", false);
  },
  'click .btnSaveAdd': function(e, t) {
    e.preventDefault();

    var ip = $('[name=newRuntimeIP]').val();
    var port = $('[name=newRuntimePort]').val();
    var envName = $('[name=newRuntimeName]').val();
    var userName = $('[name=newRuntimeUser]').val();
    var passwd = $('[name=newRuntimePassword]').val();
    Meteor.call('addEnvironment', ip, port, envName, userName, passwd, function(e, result) {
      // Result is the id of the record that we have just saved...
      Session.setDefault("runtime_" + result, false);
      Session.setDefault("checking_" + result, false);
    });
    Session.set("addEnvironmentFlag", false);

  },
  'keyup .newRuntimePort': function(e, t) {
    console.log(e.target.value);
    var reg = /^\d+$/;
    if (reg.test(e.target.value)) {
      Session.set("invalidPort", false);
    } else {
      Session.set("invalidPort", true);
    };
  },
  'keyup .newRuntimeIP': function(e, t) {
    var reg = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    var reg2 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (reg.test(e.target.value) || reg2.test(e.target.value)) {
      Session.set("invalidIP", false);
    } else {
      Session.set("invalidIP", true);
    }
  }
});
