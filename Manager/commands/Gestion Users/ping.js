const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports =
{
    name: "ping",
    description: "Afficher le ping du bot.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args 
    */
    async execute(client, message, args)
    {
        const msg = await message.channel.send(`***API*** \`000ms\` | ***WS*** \`${client.ws.ping}ms\``)
        return msg.edit(`***API*** \`${msg.createdTimestamp - message.createdTimestamp}ms\` | ***WS*** \`${client.ws.ping}ms\``)
    },
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const date = Date.now();
        await interaction.reply({ content: `***API*** \`000ms\` | ***WS*** \`${client.ws.ping}ms\``, flags: 64 });
        return interaction.editReply({ content: `***API*** \`${Date.now() - date}ms\` | ***WS*** \`${client.ws.ping}ms\`` })
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            //.setContexts([0, 1, 2])
            .setDescription(this.description)
    }
}