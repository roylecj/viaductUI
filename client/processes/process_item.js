Template.processItem.onCreated(function() {
  Session.setDefault("more_" + this._id, false);
});

Template.processItem.onRendered(function() {
    drawChart();
});

Template.processItem.helpers({
  showMoreDetails: function() {
    return Session.get("more_" + this._id);
  },
  viewModeCard: function() {
    if (Session.get("viewModeList")) {
      return false
    } else {
      return true
    }
  },
  listenerList: function() {
    console.log("id=" + this._id);
    return ViaductListeners.find({processId: this._id}).fetch();
  },
  connectorList: function() {
    console.log("connector, id: " + this._id);
    return ViaductConnectors.find({processId: this._id}).fetch();
  },
  activeState: function() {
    if (this.active === "true") {
      return "Active"
    } else {
      return "Inactive"
    }
  }
});

Template.processItem.events({
  'click .btnMore': function(e, t) {
    console.log("setting to true");
    Session.set("more_" + this._id, true);
  },
  'click .btnLess': function(e, t) {
    console.log("setting to false");
    Session.set("more_" + this._id, false);
  },
  'click .flushProcess': function(e, t) {
    console.log("flushing the process");

    var runtime = {}

    // Now we get the runtime, so that we have credentials...
    runtime = ViaductRuntimes.findOne({_id: this.runtimeId});

    var userId = "";
    var passwd = "";

    userId = runtime.runtimeUser;
    passwd = runtime.runtimePasswd;

    urlString = Session.get("selectedRuntimeURL") + '/management/flushprocess/' + this.processName;
    console.log("urlString=" + urlString);
    Meteor.call("postViaductActions", urlString, userId, passwd, function(e, result) {
      // doing something.
      if (result === true) {
          console.log("result is true");
          sAlert.success("Process flushed");
      } else {
        console.log("result is !!! " + result);
        sAlert.error("Unable to flush the process");
      }
    });

  },
  'click .undeployProcess': function(e, t) {
    console.log("undeploying the process");

    var runtime = {}

    // Now we get the runtime, so that we have credentials...
    runtime = ViaductRuntimes.findOne({_id: this.runtimeId});

    var userId = "";
    var passwd = "";

    userId = runtime.runtimeUser;
    passwd = runtime.runtimePasswd;

    urlString = Session.get("selectedRuntimeURL") + '/management/undeploy/' + this.processName;
    console.log("urlString=" + urlString);
    Meteor.call("deleteViaductActions", urlString, userId, passwd, function(e, result) {
      // doing something.
      if (result === true) {
          console.log("result is true");
          sAlert.success("Process undeployed");
      } else {
        console.log("result is !!! " + result);
        sAlert.error("Unable to undeploy the process");
      }
    });
  }
})

function drawChart() {
  var data = [
          {
              value: 20,        // Success Number
              color:"#18bc9c"
          },
          {
              value :1,         // Failure Number
              color : "#e74c3c"
          }
      ]
        var ctx = $("#processChart").get(0).getContext("2d");
        var myPieChart = new Chart(ctx);
        new Chart(ctx).Doughnut(data, {
          segmentStrokeWidth: 2,
          percentageInnerCutout: 70
        });
}
