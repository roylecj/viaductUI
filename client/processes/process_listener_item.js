Template.processListenerItem.onRendered(function () {
    Session.setDefault("changingRunState", false);
    Session.setDefault("initiateAction", false);
});

Template.processListenerItem.helpers({
  showMoreDetails: function() {
    return Session.get("more_" + this.processId);
  },
  viewModeCard: function() {
    if (Session.get("viewModeList")) {
      return false
    } else {
      return true
    }
  },
  listenerTypeIcon: function() {
    switch (this.listenerType) {
      case "DatabaseModel":
        return "fa fa-database"
        break;
      case "File":
        return "fa file"
        break;
      case "HTTP":
        return "glyphicon glyphicon-globe"
        break;
      default:
        return "";
    }
  },
  listenerTypeName: function() {
    switch (this.listenerType) {
      case "DatabaseModel":
        return "Database Model"
        break;
      case "File":
        return "File"
        break;
      case "HTTP":
        return "HTTP"
        break;
      default:
        return this.listenerType;
    }
  },
  runningStatus: function() {
    if (this.running === "true") {
      return "btn-success"
    } else {
      return "btn-danger"
    }
  },
  runningStatusText: function() {
    if (this.running === "true") {
      return "glyphicon-play"
    } else {
      return "glyphicon-stop"
    }
  },
  connectionState: function() {
    console.log("Checking connection state");
    if (this.connected === "true") {
      console.log("connection is true");
      return "alert-success"
    } else {
      return ""
    }
  }
});


Template.processListenerItem.events({
  'click .runningState': function(e, t) {
    Session.set("initiateAction", true);

    console.log("Changing running state");
    // Now we need to perform the change...

    var runningId = this._id;

    var processDetails = {}

    // First we need the current process

    processDetails= ViaductProcesses.findOne({_id: this.processId});

    var runtime = {}

    // Now we get the runtime, so that we have credentials...
    runtime = ViaductRuntimes.findOne({_id: processDetails.runtimeId});

    var userId = "";
    var passwd = "";

    userId = runtime.runtimeUser;
    passwd = runtime.runtimePasswd;

    if (this.running === "true") {
      // stop it
      urlString = Session.get("selectedRuntimeURL") + '/management/stop/' + this.listenerName;
      console.log("urlString=" + urlString);
      Meteor.call("postViaductActions", urlString, userId, passwd, function(e, result) {
        // doing something.
        if (result === true) {
            console.log("result is true");
//            this.running = "false";
            Meteor.call("updateRunningStatus", runningId, "false");

        } else {
          console.log("result is !!! " + result);
        }
      });
    } else {
      // start it
      urlString = Session.get("selectedRuntimeURL") + '/management/start/' + this.listenerName;
      console.log("urlString=" + urlString);
      Meteor.call("postViaductActions", urlString, userId, passwd, function(e, result) {
        // doing something

        if (result === true) {
          console.log("result is true");
          this.running = "true";
            Meteor.call("updateRunningStatus", runningId, "true");
        } else {
          console.log("!!! RESULT IS " + result);
        }
      });
    }

    Session.set("initiateAction", false);
  }
});
