const { Client, GuildMember } = require('legend.js');

module.exports = {
    name: "guildMemberUpdate",
    developer: true,
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     **/
    run: async (oldMember, newMember, client) => {
        const date = Math.round(Date.now() / 1000);

        if (oldMember.nickname !== newMember.nickname && oldMember.nickname) {
            fetch(`http://localhost:1337/setPrevnames/${oldMember.id}`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ oldName: oldMember.nickname, newName: newMember.nickname, date })
            }).catch(() => false)
        }
    }
};