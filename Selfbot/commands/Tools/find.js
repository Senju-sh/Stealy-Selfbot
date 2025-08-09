const { Client, Message } = require("legend.js");

module.exports = {
    name: "find",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        const memberToFind = message.mentions.users.first() || client.users.get(args[0]);
        if (!args[0] || !memberToFind) 
            return message.edit(client.language(
                "*Membre introuvable.*",
                "*Member not found.*"
            ));

        const foundVoiceChannels = new Array();
        for (const guild of client.guilds.values()) 
        {
            const voiceChannel = guild.members.get(memberToFind.id)?.voiceChannel;
            if (voiceChannel) foundVoiceChannels.push(client.language(`*${memberToFind} est actuellement connecté dans le vocal ${voiceChannel}.*`, `*${memberToFind} is actually connected in the voice channel ${voiceChannel}.*`));
        }

        if (foundVoiceChannels.length) message.edit(foundVoiceChannels.join("\n")); 
        else message.edit(client.language(
            "*Cet utilisateur n'est pas en vocal.*", 
            "*This user isn't in voice chat.*"
        ));
    }
}