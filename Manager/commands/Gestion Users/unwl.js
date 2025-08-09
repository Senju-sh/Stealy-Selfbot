const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports =
{
    name: "unwl",
    description: "Retire un utilisateur de la whitelist.",
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
        if (!member.roles.cache.has(client.config.whitelist_role)) return message.channel.send(`${member} n'est pas whitelist`);

        return member.roles.remove(client.config.whitelist_role)
            .then( () => message.channel.send(`${member} a été unwhitelist`))
            .catch(() => message.channel.send(`${member} n'a pas pu être unwhitelist`));
    },
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const member = interaction.options.getMember('member');
        if (!member) return interaction.reply({ content: `Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\``, flags: 64 });
        if (!member.roles.cache.has(client.config.whitelist_role)) return interaction.reply({ content: `${member} n'est pas whitelist`, flags: 64 });

        return member.roles.remove(client.config.whitelist_role)
            .then( () => interaction.reply(`${member} a été unwhitelist`))
            .catch(() => interaction.reply(`${member} n'a pas pu être unwhitelist`));
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            //.setContexts([0, 1, 2])
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName('member')
                .setDescription("Le membre à unwhitelist")
                .setRequired(true)
            )
    }
}