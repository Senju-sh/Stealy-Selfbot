const { GuildMember, Client } = require("legend.js");

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
    */
    run: async (oldMember, newMember, client) => {

        if (client.db.voice.antijoin.includes(newMember.voiceChannelID) && !client.db.voice.whitelist.includes(newMember.id) && newMember.id !== client.user.id)
            newMember.setVoiceChannel(null).catch(() => false);

        if (newMember && newMember.id === client.user.id);
        if (!oldMember || oldMember.id !== client.user.id) return;
        
        if (oldMember.voiceChannelID && !newMember.voiceChannelID && client.db.voice.connect) 
            client.voc();
    }
}