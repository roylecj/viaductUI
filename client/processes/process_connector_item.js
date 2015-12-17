Template.processConnectorItem.helpers({
  connectorTypeIcon: function() {
    switch (this.connectorType) {
      case "DatabaseModel":
        return "fa fa-database"
        break;
      case "File":
        return "fa file"
      default:
        return "";
    }
  },
  connectorTypeName: function() {
    switch (this.connectorType) {
      case "DatabaseModel":
        return "Database Model"
        break;
      case "File":
        return "File"
        break;
      case "HTTP":
        return "HTTP"
        break;
      default:
        return this.connectorType;
    }
  }
});
