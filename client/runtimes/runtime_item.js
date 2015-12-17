
Template.runtimeItem.onCreated(function() {
    Session.setDefault("editMode", false);
    Session.setDefault("editItem", "");
    Session.setDefault("invalidEditIP", false);
    Session.setDefault("invalidEditPort", false);
    Session.setDefault("runtime_" + this._id, false);
    Session.setDefault("checking_" + this._id, false);
});

Template.runtimeItem.helpers({
    editMode: function() {
      if (Session.get("editMode")) {
        if (Session.get("editItem") === this._id) {
          return true
        } else {
          return false
        }
      }
    },
    editItem: function() {
      return Session.get("editItem");
    },
    editPortStatus: function() {
      if (Session.get("invalidEditPort")) {
        return "has-error"
      } else {
        return "has-success"
      }
    },
    editIPStatus: function() {
      if (Session.get("invalidEditIP")) {
        return "has-error"
      } else {
        return "has-success"
      }
    },
    isDisabled: function() {
      if (Session.get("invalidEditIP") || Session.get("invalidEditPort")) {
        return "disabled"
      } else {
        return ""
      }
    },
    connectionState: function() {
      console.log("runtime= " + Session.get("runtime_" + this._id) + ", check=" + Session.get("checking_" + this._id));

      if (Session.get("runtime_" + this._id) === true) {
        return "btn-success"
      } else {
        if (Session.get("checking_" + this._id) === true) {
          return "btn-danger"
        } else {
          return "btn-warning"
        }
      }
    },
    connectIcon: function() {
      if (Session.get("runtime_" + this._id) === true) {
        return "glyphicon glyphicon-flash"
      } else {
        if (Session.get("checking_" + this._id) === true) {
          return "glyphicon glyphicon-refresh"
        } else {
          return "glyphicon glyphicon-flash"
        }
      }
    },
    checkConnectionState: function() {
      Session.setDefault("checking_" + this._id, false);
      Session.setDefault("runtime_" + this._id, false);

      if (Session.get("checking_" + this._id) === false) {

        console.log("Checking the values");
        console.log("runtime=" + this._id);

        Session.set("checking_" + this._id, true);

        var ipAddress = "";
        var runtimeName = "";
        var userId = "";
        var passwd = "";
        var runtimeId = this._id;

        ipAddress = this.ipAddress;
        runtimeName = this.runtimeName;
        portNumber = this.portNumber;
        userId = this.runtimeUser;
        passwd = this.runtimePasswd;

        var baseURL = 'https://' + ipAddress + ':' + portNumber;

        Session.set("selectedRuntimeURL", baseURL);

        var urlString = baseURL + '/management/viewprocess/details';

        var respValue = "";
//        debugger

        respValue = Meteor.call('callViaduct', urlString, userId, passwd, function(e, result) {

          if (e && e.error === "error-connecting-to-runtime") {
            console.log("error found - setting runtime to false");
            console.log("runtimeId=" + runtimeId);
            Session.set("runtime_" + runtimeId, false);
          } else {
            Session.set("runtime_" + runtimeId, true);
            loadProcessList(result, runtimeId)

            // var runtimeId = this._id;
            var processCursor = ViaductProcesses.find({runtimeId: runtimeId});
            var processes = processCursor.fetch();
            for (var i=0; i < processes.length; i++) {
                  urlString = baseURL + '/management/viewprocess/details/' + processes[i].processName;

                var processId = processes[i]._id;
                var vResp = "";

                vResp = Meteor.call('callViaduct', urlString, userId, passwd, function(e, result) {
                  loadProcessDetails(result, processId)
                });
            }
          }
        });
      }
    }
});

Template.runtimeItem.events({
  "click .btnEdit": function(e, t){

      e.preventDefault();
      Session.set("editItem", this._id);
      console.log("Editing");
      Session.set("editMode", true);
  },
  'click .btnRemove': function(e, t) {
      e.preventDefault();

      var runtimeId = this._id;

      Meteor.call('deleteRuntime', runtimeId, function(e, res) {
          sAlert.danger("Runtime Removed");
      });
  },
/*  'click .btnViewRuntime': function(e, t) {
      e.preventDefault();

      var ipAddress = "";
      var runtimeName = "";

      ipAddress = this.ipAddress;
      runtimeName = this.runtimeName;
      portNumber = this.portNumber;

      var urlString = 'https://' + ipAddress + ':' + portNumber + '/management/viewprocess/details';

      var respValue = "";
      respValue = Meteor.call('callViaduct', urlString, function(e, result) {
        loadProcessList(result)
        Router.go('processList');
      });

      var runtimeId = this._id;
      var processCursor = ViaductProcesses.find({runtimeId: runtimeId});
      var processes;
      while ( processCursor.hasNext() ) {
          processes = processCursor.next();
          urlString = 'https://' + ipAddress + ':' + portNumber + '/management/viewprocess/details/' + processes.processName;

          var vResp = "";

          respValue = Meteor.call('callViaduct', urlString, function(e, result) {
            loadProcessDetails(result)
//            Router.go('processList');
          });
      }
  }, */
  'click .btnCancelEdit': function(e, t) {
      e.preventDefault();
      Session.set("editMode", false);

      // If we cancel our edit, we should check that we can still connect
      Session.set("checking_" + this._id, false);
      Session.set("runtime_" + this._id, false);
  },
  'click .btnRuntime': function(e, t) {
      if (Session.get("runtime_" + this._id) === true) {
        e.preventDefault();
        // We need to check that we can still connect...

        ipAddress = this.ipAddress;
        runtimeName = this.runtimeName;
        portNumber = this.portNumber;
        var runtimeId = this._id;
        var userId = this.runtimeUser;
        var passwd = this.runtimePasswd;
        var baseURL = 'https://' + ipAddress + ':' + portNumber
        var urlString = baseURL + '/management/viewprocess/details';

        Session.set("selectedRuntimeURL", baseURL);

        var respValue = "";
//        debugger

        respValue = Meteor.call('callViaduct', urlString, userId, passwd, function(e, result) {
          if (e && e.error === "error-connecting-to-runtime") {
            Session.set("runtime_" + runtimeId, false);
            sAlert.error("Lost connection to the runtime");
          } else {
            Session.set("runtime_" + runtimeId, true);
            Router.go('processList', {_id: runtimeId});
          }
        });

      } else {
        // Set the parameters back to have another look
        Session.set("runtime_" + this._id, false);
        Session.set("checking_" + this._id, false);
      }
  },
  'click .btnSaveEdit': function (e, t) {
      e.preventDefault();
      Session.set("editMode", false);

      var ipAddress = "";
      var runtimeName = "";
      var portNumber = "";

      // ipAddress = this.ipAddress;
      // runtimeName = this.runtimeName;
      // portNumber = this.portNumber;
      var runtimeId = this._id;

      // var runtimeUser = this.runtimeUser;
      // var runtimePasswd = this.runtimePasswd;

      var runtimeUser = "";
      var runtimePasswd = "";

      var runtimeId = this._id;
      var ipAddress = $('[name=newRuntimeIP]').val();
      var portNumber = $('[name=newRuntimePort]').val();
      var runtimeName = $('[name=newRuntimeName]').val();
      var runtimeUser = $('[name=newRuntimeUser]').val();
      var runtimePasswd = $('[name=newRuntimePassword]').val();

      Meteor.call('updateRuntime', runtimeId, ipAddress, runtimeName, portNumber, runtimeUser, runtimePasswd, function(e, res) {
          sAlert.success("Runtime updated");

          // Again, we have saved our edit, let's check that we can still connect.
          Session.set("checking_" + runtimeId, false);
          Session.set("runtime_" + runtimeId, false);
      });
  },
  'keyup .runtimePort': function(e, t) {
    var reg = /^\d+$/;
    if (reg.test(e.target.value)) {
      Session.set("invalidEditPort", false);
    } else {
      Session.set("invalidEditPort", true);
    };
  },
  'keyup .runtimeIP': function(e, t) {
    var reg = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    var reg2 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (reg.test(e.target.value) || reg2.test(e.target.value)) {
      Session.set("invalidEditIP", false);
    } else {
      Session.set("invalidEditIP", true);
    }
  }
});

loadProcessList = function(xmlString, runtimeId) {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(xmlString,"text/xml");

  Meteor.call('removeRuntimeProcesses', runtimeId)

  var procList = "";
  var processItems = xmlDoc.getElementsByTagName ("process");
  for (i = 0; i < processItems.length; i++) {

    var procName = processItems[i].getAttribute("name");
    var activeFlag = processItems[i].getAttribute("active");
    var deployDate = processItems[i].getAttribute("deploydate");
    var enabledFlag = processItems[i].getAttribute("enabled");
    var instances = processItems[i].getAttribute("instances");
    var invoked = processItems[i].getAttribute("invoked");
    var versionNum = processItems[i].getAttribute("version");

    ViaductProcesses.insert({
      processName: procName,
      activeFlag: activeFlag,
      deployDate: deployDate,
      createDate: new Date(),
      createdBy: 'croyle',
      enabledFlag: enabledFlag,
      instances: instances,
      invoked: invoked,
      version: versionNum,
      runtimeId: runtimeId
    });
  }
};

loadProcessDetails = function(xmlString, processId) {
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

    ViaductListeners.insert({
      listenerName: listenerName,
      connected: connectedFlag,
      failed: failed,
      lastMessage: lastMessage,
      running: running,
      success: successNumber,
      throughput: throughput,
      listenerType: listenerType,
      processId: processId
    });
  }
  processItems = xmlDoc.getElementsByTagName ("connector");
  for (i = 0; i < processItems.length; i++) {
    var lastMessageNumber = processItems[i].getAttribute("lastMessage");
    var messageNumber = processItems[i].getAttribute("messages");
    var connectorName = processItems[i].getAttribute("name");
    var connectorProcessId = processItems[i].getAttribute("processid");
    var connectorType = processItems[i].getAttribute("type");

    ViaductConnectors.insert({
      lastMessage: lastMessageNumber,
      messageNumber: messageNumber,
      connectorName: connectorName,
      connectorProcessId: connectorProcessId,
      connectorType: connectorType,
      processId: processId
    });
  }
};
