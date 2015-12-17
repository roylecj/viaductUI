Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [
      Meteor.subscribe('viaductProcesses'),
      Meteor.subscribe('viaductRuntimes'),
      Meteor.subscribe('viaductListeners'),
      Meteor.subscribe('viaductConnectors'),
      Meteor.subscribe("userPreferences")
    ]}
});

Router.route('/', {name: 'login'});
Router.route('/processes/:_id', {
  name: 'processList',
  data: function() {
//    return ViaductProcesses.find({runtimeId: this.params._id}).fetch()
    return ViaductRuntimes.findOne({_id: this.params._id});
  }
});
Router.route('/runtimes', {
  name: 'runtimeList',
  data: function() {
    return ViaductRuntimes.find().fetch()
  }
});

Router.route('/runtime/:_id', {
  name: 'runtimeEntry',
  data: function() {
    return ViaductRuntimes.findOne({_id: this.params._id})
  }
});
var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  }
  else {
    this.next();
  }
};

Router.onBeforeAction(requireLogin, {except: ['login']});
