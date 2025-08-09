const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports = 
{
    name: "connexion",
    description: "Connecte un utilisateur à la machine.",
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
        if (!args[0]) return message.channel.send(`Veuillez entrer un token valide`);

        const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: args[0].replaceAll('"', '') } })
        .then(r => r.json())
        .catch(() => null);

        if (!res || !res?.id) return message.channel.send(`Le token est invalide ou n'est pas un token d'utilisateur`);

        if (client.connected[res.id]) return message.channel.send(`\`${res.global_name ?? res.username}\` (<@${res.id}>) est déjà connecté`);
        client.load_token(args[0]);

        return message.channel.send(`\`${res.global_name ?? res.username}\` (<@${res.id}>) a été connecté à la machine`);
    },
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction) 
    {
        await interaction.deferReply({ flags: 64 });
        const token = interaction.options.getString('token');

        const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: token.replaceAll('"', '') } })
            .then(r => r.json())
            .catch(() => null);

        if (!res || !res?.id) return interaction.editReply(`Le token est invalide ou n'est pas un token d'utilisateur`);
        if (client.connected[res.id]) return interaction.editReply(`\`${res.global_name ?? res.username}\` (<@${res.id}>) est déjà connecté`);
        client.load_token(token);

        return interaction.editReply(`\`${res.global_name ?? res.username}\` (<@${res.id}>) a été connecté à la machine`);
    },
    get data() 
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            //.setContexts([0, 1, 2])
            .setDescription(this.description)
            .addStringOption(o =>
                o.setName('token')
                .setDescription("Le token du compte")
                .setRequired(true)
            )
    }
}