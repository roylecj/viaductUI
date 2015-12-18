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
  },
  currentTime: function() {
    if (Session.get("refreshData")) {

      // We need to refresh the view of processes

      if (Session.get("autoRefresh")) {
//        Session.set("refreshData", false);

// If we are in Auto Refresh, then we should look at this particular process
// to see if anything has changed...

          urlString = baseURL + '/management/viewprocess/details/' + this.processName;
          var processId = this._id;
          var vResp = "";

          vResp = Meteor.call('callViaduct', urlString, userId, passwd, function(e, result) {
            loadProcessDetails(result, processId)
          });

        return moment().format("hh:mm:ss")
      }
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

loadIndividualProcess = function(xmlString, processId) {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(xmlString,"text/xml");

//  Meteor.call('removeRuntimeProcesses', runtimeId)

  var procList = "";
  var processItems = xmlDoc.getElementsByTagName ("listener");
  for (i = 0; i < processItems.length; i++) {

    var listenerName = processItems[i].getAttribute("name");
    var connectedFlag = processItems[i].getAttribute("connected");
    var failed = processItems[i].getAttribute("failed");
    var lastMessage = processItems[i].getAttribute("lastMessage");
    var running = processItems[i].getAttribute("running");
    var successNumber = processItems[i].getAttribute("success");
    var throughput = processItems[i].getAttribute("throughput");
    var listenerType = processItems[i].getAttribute("type");

// has the item changed

    var numNoChange = ViaductListeners.find({
      processId: processId,
      listenerName: listenerName,
      connected: connectedFlag,
      failed: failed,
      lastMessage: lastMessage,
      running: running,
      success: successNumber,
      throughput: throughput,
      listenerType: listenerType
    }).count();

    if (numNoChange === 0) {
      // We have to do something, as one of the items has changed...

      // Get the id first.

      var listenerId = "";

      listenerId = ViaductListeners({processId: processId, listenerName: listenerName}).findOne();

      ViaductListeners.update({_id: listenerId}, {$set: {
        processId: processId,
        listenerName: listenerName,
        connected: connectedFlag,
        failed: failed,
        lastMessage: lastMessage,
        running: running,
        success: successNumber,
        throughput: throughput,
        listenerType: listenerType
      }});
    }
  }
  processItems = xmlDoc.getElementsByTagName ("connector");
  for (i = 0; i < processItems.length; i++) {
    var lastMessageNumber = processItems[i].getAttribute("lastMessage");
    var messageNumber = processItems[i].getAttribute("messages");
    var connectorName = processItems[i].getAttribute("name");
    var connectorProcessId = processItems[i].getAttribute("processid");
    var connectorType = processItems[i].getAttribute("type");

    var numNoChangeConnector = ViaductConnectors.find({
      processId: processId,
      lastMessage: lastMessageNumber,
      messageNumber: messageNumber,
      connectorName: connectorName,
      connectorProcessId: connectorProcessId,
      connectorType: connectorType
    }).count();

    if (numNoChangeConnector === 0) {
      // We have to do something, as one of the items has changed...

      // Get the id first.

      var connectorId = "";

      connectorId = ViaductConnectors({processId: processId, connectorName: connectorName}).findOne();

      ViaductConnectors.update({_id: connectorId}, {$set: {
        processId: processId,
        lastMessage: lastMessageNumber,
        messageNumber: messageNumber,
        connectorProcessId: connectorProcessId,
        connectorType: connectorType
      }}).count();
    }
  }
};
