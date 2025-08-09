const Collection = require('../../../../util/Collection');
const { Events } = require('../../../../util/Constants');
const AbstractHandler = require('./AbstractHandler');
// Uncomment in v12
// const Collection = require('../../../../util/Collection');

class GuildMemberListUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    //console.log(data);
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;
    const members = new Collection();
    // Get Member from side Discord Channel (online counting if large server)
    for (const object of data.ops) {
      switch (object.op) {
        case 'SYNC': {
          //console.log(`Sync [${object.range[0]}, ${object.range[1]}], Fetching GuildId: ${data.guild_id}`)
          for (const member_ of object.items) {
            const member = member_.member;
            if (!member) continue;
            members.set(member.user.id, guild._addMember(member, false));
            if (member.presence) {
              //console.log(member.presence)
              guild._setPresence(member.user.id, member.presence)
            }
          }
          break;
        }
        case 'INVALIDATE': {
          client.emit(Events.DEBUG, `Invalidate [${object.range[0]}, ${object.range[1]}], Fetching GuildId: ${data.guild_id}`);
          //console.log(`Invalidate [${object.range[0]}, ${object.range[1]}], Fetching GuildId: ${data.guild_id}`)
          break;
        }
        case 'UPDATE':
        case 'INSERT': {
          const member = object.item.member;
          if (!member) continue;
          members.set(member.user.id, guild._addMember(member, false));
          if (member.presence) {
            //console.log(member.presence)
            guild._setPresence(member.user.id, member.presence)
          }
          break;
        }
        case 'DELETE': {
          break;
        }

      }
    }
    client.emit(Events.GUILD_MEMBER_LIST_UPDATE, members, guild, data);
  }
}

module.exports = GuildMemberListUpdate;
