const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
// Uncomment in v12
// const Collection = require('../../../../util/Collection');

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    //console.log(data);
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;

    // Uncomment in v12
    // const members = new Collection();
    //
    // for (const member of data.members) members.set(member.id, guild._addMember(member, false));

    const members = data.members.map(member => guild._addMember(member, false));

    if (data.presences) {
      for (const presence of data.presences) {
        //console.log(presence);
        guild._setPresence(presence.user.id, presence);
      }
    }

    client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, members, guild, {
      count: data.chunk_count,
      index: data.chunk_index,
      nonce: data.nonce,
    });

    client.ws.lastHeartbeatAck = true;
  }
}

/**
 * Emitted whenever a chunk of guild members is received (all members come from the same guild).
 * @event Client#guildMembersChunk
 * @param {GuildMember[]} members The members in the chunk
 * @param {Guild} guild The guild related to the member chunk
 */

module.exports = GuildMembersChunkHandler;
