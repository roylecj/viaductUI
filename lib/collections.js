ViaductRuntimes = new Mongo.Collection('viaductRuntimes');
ViaductProcesses = new Mongo.Collection('viaductProcesses');
UserPrefs = new Mongo.Collection('userPreferences');
ViaductListeners = new Mongo.Collection('viaductListeners');
ViaductConnectors = new Mongo.Collection('viaductConnectors');

if (Meteor.isClient) {
  Meteor.startup(function () {
        setInterval(function () {
            Meteor.call("getServerTime", function (error, result) {
                // Session.set("time", result);
                Session.set("refreshData", true);
            });
        }, 5000);
    });
}

ViaductRuntimes.allow({
  update: function(userId, doc) {
    return true;
  },
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

ViaductProcesses.allow({
  update: function(userId, doc) {
    return true;
  },
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

ViaductListeners.allow({
  update: function(userId, doc) {
    return true;
  },
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

ViaductConnectors.allow({
  update: function(userId, doc) {
    return true;
  },
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

UserPrefs.allow({
  update: function(userId, doc) {
    return true;
  },
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

Meteor.methods({
  addUser: function(loginName, passwd, personName) {

    var userId = Accounts.createUser({
        username: loginName,
        password: passwd,
        profile: { name:  personName}
    });
  },
  addEnvironment: function(ip, port, envName, userName, passwd) {
    var id = ViaductRuntimes.insert({
      ipAddress: ip,
      runtimeName: envName,
      portNumber: port,
      runtimeUser: userName,
      runtimePasswd: passwd,
      user: Meteor.userId()
    });

    return id;
  },
  deleteRuntime: function(runtimeId) {
    console.log("Removing " + runtimeId);
    ViaductRuntimes.remove(runtimeId);
  },
  getServerTime: function () {
//      var _time = (new Date).toTimeString();
      var mytime = moment().add(5, 's').format("hh:mm:ss");
      return mytime;
  },
  updateRuntime: function(runtimeId, ip, envName, port, userName, passwd) {
    console.log("ip=" + ip);
    console.log("Env="+ envName);
    console.log("Port=" + port);
    console.log("user=" + userName);
    console.log("pwd=" + passwd);

    ViaductRuntimes.update({_id: runtimeId}, {$set: {
      ipAddress: ip,
      runtimeName: envName,
      portNumber: port,
      user: Meteor.userId(),
      runtimeUser: userName,
      runtimePasswd: passwd
    }});
  },
  removeRuntimeProcesses: function(runtimeId) {
    ViaductProcesses.remove({runtimeId: runtimeId});
  },
  updateRunningStatus: function(listenerId, newRunningState) {
    console.log("listener id = " + listenerId);
    ViaductListeners.update({_id: listenerId}, {$set: {
      running: newRunningState
    }});
  }
});
