const Action = require('./Action');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get((data instanceof Array ? data[0] : data).channel_id);
    const user = client.users.get((data instanceof Array ? data[0] : data).author?.id);
    if (channel) {
      if (!channel.isText()) return {};
      const member = channel.guild ? channel.guild.member(user) : null;
      const message = channel._cacheMessage(new Message(channel, data, client));
      channel.lastMessageID = data.id;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessage = message;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessage = message;
      }
      return {
        message,
      };
    }

    return {
      message: null,
    };
  }
}

module.exports = MessageCreateAction;
