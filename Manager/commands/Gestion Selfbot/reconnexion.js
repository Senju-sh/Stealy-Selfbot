const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports =
{
    name: "reconnexion",
    description: "Redémarre la machine d'un utilisateur connecté.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    staffOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args 
    */
    async execute(client, message, args)
    {
        const member = message.mentions.members.first() ||
                       message.guild.members.cache.get(args[0]) ||
                       message.guild.members.cache.find(m => m.user.username.toLowerCase()?.includes(args[0]?.toLowerCase())) ||
                       message.guild.members.cache.find(m => m.user.globalName?.toLowerCase()?.includes(args[0]?.toLowerCase())) ||
                       message.guild.members.cache.find(m => m.nickname?.toLowerCase()?.includes(args[0]?.toLowerCase()));

        if (!member) return message.channel.send(`Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\``);
        if (!client.connected[member.id]?.token) return message.channel.send(`\`${member.displayName}\` (${member}) n'est pas connecté à la machine`);
        
        client.connected[member.id].terminate();
        delete client.connected[member.id];
        client.load_token(token);
        return message.channel.send(`\`${member.displayName}\` (${member}) a été reconnecté`);
    },
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const member = interaction.options.getMember('member');
        if (!member) return interaction.reply({ content: `Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\``, flags: 64 });
        if (!client.connected[member.id]?.token) return interaction.reply({ content: `\`${member.displayName}\` (${member}) n'est pas connecté à la machine`, flags: 64 });

        client.connected[member.id].terminate();
        delete client.connected[member.id];
        client.load_token(token);

        return interaction.reply(`\`${member.displayName}\` (${member}) a été reconnecté`);
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            //.setContexts([0, 1, 2])
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName('member')
                .setDescription("Le membre à reconnecter")
                .setRequired(true)
            )
    }
}