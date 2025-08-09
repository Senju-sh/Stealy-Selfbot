const { Client, Message } = require("legend.js");

module.exports = {
    name: "bring",
    permission: "MOVE_MEMBERS",
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
                "*Vous devez être dans un salon vocal*",
                "You must be connected to any voice channel.*"
            ));

        if (!member.voiceChannel) 
            return message.edit(client.language(
                `*${member} n'est connecté dans aucun salon vocal`,
                `${member} is not connected to any voice channel.*`
            ))

        member.setVoiceChannel(message.member.voiceChannel)
            .then(() => message.edit(client.language(`*${member} a été déplacé.*`, `*${member} has been moved.*`)))
            .catch(() => message.edit(client.language(`*Je n'ai pas pu déplacé ${member}*`, `*I can't move ${member}.*`)))
    }
};