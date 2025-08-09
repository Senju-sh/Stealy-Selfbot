const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');

class ChannelRecipentRemoveHandler extends AbstractHandler {
    handle(packet) {
        const client = this.packetManager.client;
        const data = packet.d;
        const channel = client.channels.get(data.channel_id);
        if (!channel) return;
        const user = client.dataManager.newUser(data.user);
        channel.recipients.delete(user.id);
        client.emit(Constants.Events.CHANNEL_RECIPIENT_REMOVE, channel, user);
    }
}

/**
   * Emitted whenever a recipient is added from a group DM.
   * @event Client#channelRecipientAdd
   * @param {Channel} channel Group DM channel
   * @param {User} user User
   */

module.exports = ChannelRecipentRemoveHandler;
