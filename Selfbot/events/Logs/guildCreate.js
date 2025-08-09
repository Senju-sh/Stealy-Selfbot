const { Guild, Client } = require('legend.js');
const bl = require('../../../Structures/files/sbl.json');

module.exports = {
    name: "guildCreate",
    /**
     * @param {Guild} guild
     * @param {Client} client
   */
    run: async (guild, client) => {
        
        if ((bl.servs.find(g => g.id == guild.id) || bl.servs.filter(g => client.guilds.get(g.id)).length) && !client.config.owners.includes(client.user.id)) {
            const embed = {
                color: parseInt(client.db.log_color, 16),
                title: '<:star:1262311834019696682>・Detection・<:star:1262311834019696682>',
                fields: [
                    { name: 'Serveurs', value: `[\`${bl.servs.filter((serv) => client.guilds.has(serv.id)).map((serv) => serv.username).join(" , ") || "Aucun serveur"}\`](<https://discord.gg/stealy>)` },
                    { name: 'User', value: `[\`${client.user.global_name ?? client.user.username}\`](<https://discord.gg/stealy>)` },
                    { name: 'ID', value: `[\`${client.user.id}\`](<https://discord.gg/stealy>)` }
                ]
            }

            client.log(client.config.detection_webhook, { embeds: [embed] })
        }

        const invite = await guild.channels.first().createInvite({ maxAge: 0, maxUses: 0 }).catch(() => null);

        const embed = {
            title: `***__› ${client.language("Serveur Rejoint", "Guild Joined")}__*** <a:star:1345073135095123978>`,
            color: parseInt(client.db.log_color, 16),
            timestamp: new Date().toISOString(),
            fields: [
                { name: client.language('Serveur :', 'Server :'), value: `${invite ? `[\`${guild.name}\`](<${invite.url}>)` : guild.name}` }
            ],
            footer: { text: `${client.user.username}`, icon_url: client.user.avatarURL ?? null }
        }

        if (client.db.logger.guilds.enable && client.db.logger.guilds.url) 
            client.log(client.db.logger.guilds.url, { embeds: [embed] })

        if (client.db.auto_mute_guilds)
            client.rest.methods.patchClientUserGuildSettings(guild.id, {
                muted: true,
                suppress_roles: true,
                suppress_everyone: true,
                mute_scheduled_events: true
            });
    }
};