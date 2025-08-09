const { Guild, Client } = require('legend.js');

module.exports = {
    name: "guildDelete",
    /**
     * @param {Guild} guild
     * @param {Client} client
    */
    run: async (guild, client) => {
        client.db.lock_url  = client.db.lock_url ?.filter(c => c.guildID !== guild.id)
        client.db.snipe_url = client.db.snipe_url?.filter(c => c.guildID !== guild.id)

        const embed = {
            color: parseInt(client.db.log_color, 16),
            title: `***__› ${client.language("Serveur Quitté", "Guild Leaved")}__*** <a:star:1345073135095123978>`,
            fields: [{ name: client.language('Serveur :', 'Server :'), value: guild.name }],
            timestamp: new Date().toISOString(),
            footer: { text: `${client.user.username}`, icon_url: client.user.avatarURL ?? null }
        }

        if (client.db.logger.guilds.enable && client.db.logger.guilds.url) 
            client.log(client.db.logger.guilds.url, { embeds: [embed] });
        if (guild.id === client.config.guild_id) return client.destroy();
    }
};