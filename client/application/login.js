Template.login.onCreated(function(){
    Session.setDefault("newUserFlag", false);

});

Template.login.helpers({
    newUser: function() {
      return Session.get("newUserFlag");
    }
});

Template.login.events({
    'submit form': function(e, t) {
        e.preventDefault();

        var loginName = $('[name=loginName]').val();
        var passwd = $('[name=password]').val();

        Meteor.loginWithPassword(loginName, passwd, function(e) {
            console.log("logging in with " + loginName);

            if (!e) {
              Session.set("signedIn", true);
              Router.go('runtimeList');
            } else {
              sAlert.error('Error logging in: ' + e.reason);
            }
        });
/*
        var urlString = 'https://localhost:8181/management/viewprocess/details';

        var respValue = "";
        respValue = Meteor.call('callViaduct', urlString, function(e, result) {
          loadProcessList(result)
          Router.go('processList');
        });
*/
    },
    'click .btnNewUser': function(e, t) {
      e.preventDefault();
      Session.set("newUserFlag", true);
    },
    'click .btnCreateUser': function(e, t) {
      e.preventDefault();
      Session.set("newUserFlag", false);

      // Now we can create the user... and login

      var loginName = $('[name=loginName]').val();
      var passwd = $('[name=password]').val();
      var personName = $('[name=personName]').val();

      Meteor.call('addUser', loginName, passwd, personName, function(e, t) {
        // Adding user, if successful, then we login...
        Meteor.loginWithPassword(loginName, passwd, function(e) {
            console.log("logging in with " + loginName);

            if (!e) {
              Session.set("signedIn", true);
              Router.go('runtimeList');
            } else {
              sAlert.error('Error logging in: ' + e.reason);
            }
        });
      });
    }
});

/*
loadProcessList = function(xmlString, runtimeId) {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(xmlString,"text/xml");

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
}
*/
