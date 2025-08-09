const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
class RelationshipRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 2) {
      if (client.user.blocked.has(data.id)) {
        client.user.blocked.delete(data.id);
      }
    } else if (data.type === 1) {
      if (client.user.friends.has(data.id)) {
        if (client.presences.has(data.id)) {
          client.presences.delete(data.id);
        }
        client.user.friends.delete(data.id);
      }
    } else if (data.type === 3) {
      if (client.user.pending.has(data.id)) {
        client.user.pending.delete(data.id);
      }
    } else if (data.type === 4) {
      if (client.user.outgoing.has(data.id)) {
        client.user.outgoing.delete(data.id);
      }
    }
    client.emit(Constants.Events.RELATIONSHIP_REMOVE, data.id, data.type);
  }
}

module.exports = RelationshipRemoveHandler;
