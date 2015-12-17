// NEED TO DO THIS TO STOP THE ERROR
// WITH EXPIRED CERTIFICATES...

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

Meteor.methods({
    callViaduct: function (url, userId, passwd) {
      this.unblock();

//      var userId = "admin";
//      var passwd = "admin";

      try {
        var result = HTTP.call("GET", url,
        {
          auth: userId + ':' + passwd,
          followRedirects: true
        })
        console.log(result.content);

        return result.content;
      } catch (e) {
        // This is an error, so we cannot connect

        console.log("ERROR-" + e);
        throw new Meteor.Error("error-connecting-to-runtime", "Unable to connect to runtime");
      };

    },
    postViaductActions: function(url, userId, passwd) {
      this.unblock();
//      var userId = "admin";
//      var passwd = "admin";

      try {
        var result = HTTP.call("POST", url,
        {
          auth: userId + ':' + passwd,
          followRedirects: true
        })

        console.log("result=" + result);
        console.log("statusCode=" + result.statusCode)
        if (result.statusCode === 200) {
          return true
        } else {
          return false
        }

        return result.content;
      } catch (e) {
        // This is an error, so we cannot connect

        console.log("ERROR-" + e);
        throw new Meteor.Error("error-connecting-to-runtime", "Unable to connect to runtime");
      };
    },
    deleteViaductActions: function(url, userId, passwd) {
      this.unblock();
//      var userId = "admin";
//      var passwd = "admin";

      console.log(url);
      try {
        var result = HTTP.call("DELETE", url,
        {
          auth: userId + ':' + passwd,
          followRedirects: true
        })

        console.log("result=" + result);
        console.log("statusCode=" + result.statusCode)
        if (result.statusCode === 200) {
          return true
        } else {
          return false
        }

        return result.content;
      } catch (e) {
        // This is an error, so we cannot connect

        console.log("ERROR-" + e);
        throw new Meteor.Error("error-connecting-to-runtime", "Unable to perform delete");
      };
    },
    loadProcesses:function(result, runtimeId){
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(result,"text/xml");

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
          createdBy: Meteor.userId(),
          enabledFlag: enabledFlag,
          instances: instances,
          invoked: invoked,
          version: versionNum,
          runtimeId: runtimeId
        });
      }
    }
});
