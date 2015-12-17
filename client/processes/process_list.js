
Template.processList.onCreated(function() {
    Session.setDefault("viewModeList", true);
    Session.setDefault("filtered", false);
    Session.setDefault("showFilters", false);
    Session.setDefault("autoRefresh", true);
/*
    debugger
    var m;
    m = moment().add(5, 's');

    Session.setDefault("nextPoll", m);
    */
});

Template.processList.helpers({
  viaductProcess: function() {
    return ViaductProcesses.find({runtimeId: this._id}).fetch();
  },
/*  nextPoll: function() {
    return Session.get("nextPoll");
  }, */
  currentTime: function() {
    if (Session.get("refreshData")) {

      // We need to refresh the view of processes

      if (Session.get("autoRefresh")) {

        Session.set("refreshData", false);
      }
    }
  },
  viewModeType: function() {
    if (Session.get("viewModeList")) {
      return ""
    } else {
      return "bootcards-summary"
    }
  },
  viewModeIcon: function() {
    if (Session.get("viewModeList")) {
      return "glyphicon-file"
    } else {
      return "glyphicon-list"
    }
  },
  showFilters: function(){
    return Session.get("showFilters");
  },
  isFilterFlag: function() {
    if (Session.get("filtered")) {
      return "btn-success"
    } else {
      return "btn-info"
    }
  },
  viewModeList: function() {
    return Session.get("viewModeList");
  },
  autoRefresh: function() {
    // Auto refresh is normally on.
    // This allows us to refresh the status of the process to see what is happening
    // and make sure that we can get up to date status of individual counters
    // The frequency is controlled by the settings.

    if (Session.get("autoRefresh")) {
      return "btn-info"
    } else {
      return "btn-danger"
    }
  }
});

Template.processList.events({
  'click .btnViewMode': function(e, t) {
    // Switch the view mode between list and card
    Session.set("viewModeList", ! Session.get("viewModeList"));
  },
  'click .btnFilter': function(e, t) {
    if (Session.get("filtered")) {
      // We can disable the filter now
      Session.set("filtered", false);
      Session.set("showFilters", false);
    } else {
      // We need to show the filter variables..
      Session.set("showFilters", ! Session.get("showFilters"));
    }
  },
  'keyup .filterName': function(e, t) {
    // Now we can filter based upon the name that is entered here...
    /// TODO!!!!
  },
  'click .btnAutoRefresh': function(e, t) {
    Session.set("autoRefresh", ! Session.get("autoRefresh"));
  }
 });
