const { Client, Message } = require("legend.js");

module.exports = {
    name: "move",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) 
            return message.edit(client.language(
                "*L'utilisateur spécifié est invalide.*", 
                "*The specified user is invalid.*"
            ));

        if (!message.member.voiceChannel) 
            return message.edit(client.language(
                "*Vous devez être dans un salon vocal.*",
                "*You must be connected to any voice channel.*"
            ));

        if (!member.voiceChannel) 
            return message.edit(client.language(
                `*${member} n'est connecté dans aucun salon vocal.*`,
                `*${member} is not connected to any voice channel.*`
            ));

        message.member.setVoiceChannel(member.voiceChannel)
            .then( () => message.edit(client.language(`*Vous avez été déplacé dans ${member.voiceChannel}.*`, `*You have been moved to ${member.voiceChannel}.*`)))
            .catch(() => message.edit(client.language(`*Je n'ai pas pu vous déplacer dans ${member.voiceChannel}.*`, `*I can't move you to ${member.voiceChannel}.*`)))
    }
};