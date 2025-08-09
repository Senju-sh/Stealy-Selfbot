const AbstractHandler = require('./AbstractHandler');

const ClientUser = require('../../../../structures/ClientUser');

const Constants = require('../../../../util/Constants');

class ReadyHandler extends AbstractHandler {
  async handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) if (!client.guilds.has(guild.id)) client.dataManager.newGuild(guild);
    for (const privateDM of data.private_channels) client.dataManager.newChannel(privateDM);

    for (const relation of data.relationships) {
      const user = client.dataManager.newUser(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      } else if (relation.type === 3) {
        client.user.pending.set(user.id, user);
      } else if (relation.type === 4) {
        client.user.outgoing.set(user.id, user);
      }
    }

    data.presences = data.presences || [];
    for (const presence of data.presences) {
      client.dataManager.newUser(presence.user);
      client._setPresence(presence.user.id, presence);
    }

    if (data.notes) {
      for (const user of Object.keys(data.notes)) {
        let note = data.notes[user];
        client.user.notes.set(user, note);
      }
    }

    if (!client.user.bot && client.options.sync) client.setInterval(client.syncGuilds.bind(client), 30000);

    if (!client.users.has('1')) {
      client.dataManager.newUser({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discord.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        game: null,
        verified: true,
      });
    }

    const t = client.setTimeout(() => {
      client.ws.connection.triggerReady();
    }, 1200 * data.guilds.length);

    const guildCount = data.guilds.length;

    if (client.getMaxListeners() !== 0) client.setMaxListeners(client.getMaxListeners() + guildCount);

    const largeGuilds = data.guilds.filter(g => g.large);

    if (largeGuilds.length) {
      client.ws.send({
        op: Constants.OPCodes.GUILD_SUBSCRIPTIONS_BULK,
        d: {
          subscriptions: largeGuilds.reduce((accumulator, guild) => {
            accumulator[guild.id] = {
              typing: true,
              threads: true,
              activities: true,
              member_updates: true,
              thread_member_lists: [],
              members: [],
              channels: {},
            };
            return accumulator;
          }, {}),
        },
      });
    }

    client.once('ready', async () => {
      const largeGuilds = data.guilds.filter(g => g.large);

      client.emit('debug', `[READY] Received ${data.guilds.length} guilds, ${largeGuilds.length} large guilds`);

      // Receive messages in large guilds
      /*for (const guild of largeGuilds) {
        await client.sleep(100);
        client.ws.send({
          op: Constants.OPCodes.LAZY_REQUEST,
          d: {
            guild_id: guild.id,
            typing: true,
            threads: true,
            activities: true,
            thread_member_lists: [],
            members: [],
            channels: {},
          },
        });
      }*/
      //client.syncGuilds();
      if (client.getMaxListeners() !== 0) client.setMaxListeners(client.getMaxListeners() - guildCount);
      client.clearTimeout(t);
    });

    /*client.user.getFingerprint().then(e => {
      client.emit('debug', `[READY] Got fingerprint ${e}`);
      client.fingerprint = e;
    });*/

    const ws = this.packetManager.ws;

    ws.sessionID = data.session_id;

    ws.resumeURL = data.resume_gateway_url;

    client.emit('debug', `READY ${ws.sessionID}`);
    client.emit('debug', `Resume URL ${ws.resumeURL}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
