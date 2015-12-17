Meteor.publish('viaductRuntimes', function() {
    return ViaductRuntimes.find();
});

Meteor.publish('viaductProcesses', function() {
    return ViaductProcesses.find();
});

Meteor.publish('userPreferences', function() {
    return UserPrefs.find();
});

Meteor.publish('viaductListeners', function() {
    return ViaductListeners.find();
});

Meteor.publish('viaductConnectors', function() {
    return ViaductConnectors.find();
});
