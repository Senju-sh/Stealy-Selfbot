const { Client, GuildMember } = require('legend.js');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
     * @param {GuildMember} member
     * @param {Client} client
    */
    run: async (member, client) => {
        const bl_data = client.db.blacklist.find(c => c.id == member.id);
        if (!bl_data || !member.guild.me.permissions.has("BAN_MEMBERS")) return;

        member.ban({ reason: bl_data.reason ?? "Stealy - Blacklist" }).catch(() => false);
    }
}