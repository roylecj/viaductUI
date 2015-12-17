if (ViaductProcesses.find().count() === 0) {


  console.log("no data - loading a record");

  var userId = Accounts.createUser({
      username: 'croyle',
      password: '08board',
      profile: { name:  'Chris Royle'}
  });

  ViaductProcesses.insert({
    processName: 'HL7Test',
    activeFlag: true,
    deployDate: new Date(),
    createDate: new Date(),
    createdBy: 'croyle',
    enabledFlag: true,
    instances: 0
  });

  ViaductRuntimes.insert({
    ipAddress: '127.0.0.1',
    runtimeName: 'local runtime',
    portNumber: '8181',
    user: userId
  });
}
