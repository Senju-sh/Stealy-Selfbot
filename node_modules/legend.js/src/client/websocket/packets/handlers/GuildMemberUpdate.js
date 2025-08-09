// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildMemberUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.user.username) {
      const user = client.users.get(data.user.id);
      if (!user) {
        client.dataManager.newUser(data.user);
      } else if (!user.equals(data.user)) {
        client.actions.UserUpdate.handle(data.user);
      }
    }
    
    
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user.id);
      if (member) guild._updateMember(member, data);
    }
  }
}

module.exports = GuildMemberUpdateHandler;
