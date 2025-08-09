const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");
const fs = require('node:fs');

module.exports = 
{
    name: "premium",
    description: "Gère les premiums.",
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
    {},
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction) 
    {
        const json_codes = fs.readFileSync('./Structures/files/codes.json', 'utf8');
        const codes = JSON.parse(json_codes);
        
        switch(interaction.options.getSubcommand())
        {
            case 'create':
                const keyName = interaction.options.getString('nom')?.toLowerCase() ?? Math.floor(10000000 + Math.random() * 90000000);
                const temps = interaction.options.getString('temps');
                const user = interaction.options.getUser('utilisateur');
                let db;

                if (temps !== '0' && isNaN(client.ms(temps))) return interaction.reply({ content: 'Veuillez entrer un temps valide', flags: 64 });
                if (codes[keyName]) return interaction.reply({ content: 'Une clé avec ce nom existe déjà', flags: 64 });

                codes[keyName] = { expiresAt: temps == '0' ? 0 : temps };
                fs.writeFileSync('./Structures/files/codes.json', JSON.stringify(codes, null, 4));
                

                if (fs.existsSync(`./Structures/databases/${user ? user.id : interaction.user.id}.json`))
                    db = require(`../../../Structures/databases/${user ? user.id : interaction.user.id}.json`)


                if (user) user.send(`**\`🔑\`・Vous avez reçu une clé VIP\n\`⏳\`・La clé expire ${temps == '0' ? '`JAMAIS`' : `<t:${Math.round((Date.now() + client.ms(temps)) / 1000)}:R>`} (\`${keyName}\`)\n\`💎\`・Utilisez la commande \`${db?.prefix ?? '*'}vip ${keyName}\`**`)
                    .then(() => interaction.reply({ content: `\`✅\`・La clé VIP \`${keyName}\` (expire ${temps == '0' ? '`JAMAIS`' : `<t:${Math.round((Date.now() + client.ms(temps)) / 1000)}:R>`}) a été envoyé à ${user}`,  flags: 64 }))
                    .catch(e => interaction.reply({ content: `\`❌\`・La clé VIP n'a pas pu être envoyé à ${user}.\n\`🔑\`・La clé expire ${temps == '0' ? '`JAMAIS`' : `<t:${Math.round((Date.now() + client.ms(temps)) / 1000)}:R>`} (\`${keyName}\`)`, flags: 64 }))

                else interaction.reply({ content: `\`✅\`・La clé VIP \`${keyName}\` (expire ${temps == '0' ? '`JAMAIS`' : `<t:${Math.round((Date.now() + client.ms(temps)) / 1000)}:R>`}) a bien été crée`,  flags: 64 });
                break;

            case 'delete':
                const codeName = interaction.options.getString('code');
                if (!Object.keys(codes).includes(codeName)) return interaction.reply({ content: `Le code \`${codeName}\` n'a pas été trouvé`, flags: 64 });

                delete codes[codeName];
                client.save_codes();

                interaction.reply({ content: `Le code \`${codeName}\` a été supprimé`, flags: 64 });
                break;

            case 'list':
                const keys = Object.keys(codes);
                if (keys.length === 0) return interaction.reply({ content: "Aucune clé VIP n'a été trouvée", flags: 64 });

                const embed = {
                    title: 'Liste des clés premium',
                    description: keys.map(key => `\`${key}\` - Expire ${codes[key].expiresAt == 0 ? '`JAMAIS`' : `<t:${Math.round((isNaN(codes[key].expiresAt) ? Date.now() + client.ms(codes[key].expiresAt) : codes[key].expiresAt) / 1000)}:R>`} ${codes[key].used ? `- <@${codes[key].by}>` : ''}`).join('\n'),
                    color: 0x000000,
                }

                interaction.reply({ embeds: [embed], flags: 64 });
                break;

            case 'show':
                const userPremium = interaction.options.getUser('utilisateur');
                if (!userPremium) return interaction.reply({ content: 'Veuillez spécifier un utilisateur valide', flags: 64 });

                const userDataPremium = Object.keys(codes).find(code => codes[code].by == userPremium.id);
                if (!userDataPremium) return interaction.reply({ content: `${userPremium} n'a pas de premium sur sa machine`, flags: 64 });

                const premiumShow = {
                    color: 0x000000,
                    author: { name: `Premium de ${userPremium.displayName}`, icon_url: userPremium.avatarURL() },
                    description: `- Code: \`${codes[userDataPremium].code}\`\n- Expire: ${codes[userDataPremium].expiresAt == 0 ? '`JAMAIS`' : `<t:${Math.round(codes[userDataPremium].expiresAt / 1000)}:R>`}\n- Récupéré: <t:${Math.round(codes[userDataPremium].redeemedAt / 1000)}:R>\n- Récupéré par: <@${codes[userDataPremium].by}> (\`${codes[userDataPremium].by}\`)`,
                    thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
                    image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
                }

                interaction.reply({ embeds: [premiumShow], flags: 64 });
                break;

            case 'check':
                const code2check = interaction.options.getString('code');
                if (!Object.keys(codes).includes(code2check)) return interaction.reply({ content: `Le code \`${code2check}\` est invalide`, flags: 64 });

                const premiumCheck = {
                    color: 0x000000,
                    author: { name: `Code à vérifier`, icon_url: interaction.user.avatarURL() },
                    description: `- Code: \`${codes[code2check].code ?? code2check}\`${codes[code2check].used ? `\n- Expire: ${codes[code2check].expiresAt == 0 ? '`JAMAIS`' : `<t:${Math.round(codes[code2check].expiresAt / 1000)}:R>`}\n- Récupéré: <t:${Math.round(codes[code2check].redeemedAt / 1000)}:R>\n- Récupéré par: <@${codes[code2check].by}> (\`${codes[code2check].by}\`)` : `\n- Expire: <t:${Math.round((Date.now() + client.ms(codes[code2check].expiresAt)) / 1000)}`}:R>`,
                    thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
                    image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
                }

                interaction.reply({ embeds: [premiumCheck], flags: 64 });
                break;

            case 'ajout-temps':
                const tempsAdd = interaction.options.getString('temps');
                const codeAdd = interaction.options.getString('code');
                const type = interaction.options.getString('type');

                if (!Object.keys(codes).includes(codeAdd)) return interaction.reply({ content: `Le code \`${codeAdd}\` est invalide`, flags: 64 });
                if (isNaN(client.ms(tempsAdd))) return interaction.reply({ content: "Veuillez entrer un temps valide (exemple: `1d`, `10d`)", flags: 64 });
                if (codes[codeAdd].expiresAt == 0) return interaction.reply({ content: "Vous ne pouvez pas ajouter un temps à un code LIFETIME", flags: 64 });

                codes[codeAdd].expiresAt = type == 'add' ? codes[codeAdd].expiresAt + client.ms(tempsAdd) : codes[codeAdd].expiresAt - client.ms(tempsAdd);
                if (codes[codeAdd].expiresAt <= Date.now()) delete codes[codeAdd];
                client.save_codes();

                interaction.reply({ content: `Le code \`${codeAdd}\` ${codes[codeAdd] ? `expire <t:${Math.round(codes[codeAdd] / 1000)}:R>` : "a été supprimé car son temps inferieur à aujourd'hui"}`, flags: 64 });
                break;
        }
    },
    get data() 
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            //.setContexts([0, 1, 2])
            .setDescription(this.description)
            .addSubcommand(o =>
                o.setName('create')
                .setDescription("Crée un code premium")
                .addStringOption(o =>
                    o.setName('temps')
                    .setDescription("La durée du code premium")
                    .addChoices([
                        { name: '3 Jours (essaie)', value: '3d' },
                        { name: '7 Jours', value: '7d' },
                        { name: '14 Jours', value: '14d' },
                        { name: '31 Jours', value: '31d' },
                        { name: '2 Mois', value: '62d' },
                        { name: '3 Mois', value: '93d' },
                        { name: '6 Mois', value: '186d' },
                        { name: '1 an', value: '1y' },
                        { name: 'Lifetime', value: '0' },
                    ])
                    .setRequired(true)
                )
                .addStringOption(o => 
                    o.setName('nom')
                    .setDescription('Le nom customisé de la clé VIP')
                    .setMinLength(4)
                    .setMaxLength(10)
                    .setRequired(false)
                )
                .addUserOption(o =>
                    o.setName('utilisateur')
                    .setDescription("L'utilisateur à qui donner le code")
                    .setRequired(false)
                )
            )

            .addSubcommand(o => 
                o.setName('delete')
                .setDescription('Supprime un code premium')
                .addStringOption(o =>
                    o.setName('code')
                    .setDescription("Le code à supprimer")
                    .setRequired(true)
                )
            )

            .addSubcommand(o =>
                o.setName('list')
                .setDescription("Affiche la liste des codes premium")
            )

            .addSubcommand(o => 
                o.setName('show')
                .setDescription("Affiche le premium d'un utilisateur")
                .addUserOption(o =>
                    o.setName('utilisateur')
                    .setDescription("L'utilisateur à qui vérifier le premium")
                    .setRequired(true)
                )
            )

            .addSubcommand(o => 
                o.setName('check')
                .setDescription("Vérifie les informations d'un code")
                .addStringOption(o =>
                    o.setName('code')
                    .setDescription("Le code à afficher les infos")
                    .setRequired(true)
                )
            )

            .addSubcommand(o => 
                o.setName('ajout-temps')
                .setDescription("Ajoute ou retire du temps")
                .addStringOption(o =>
                    o.setName("code")
                    .setDescription("Le code à gérer")
                    .setRequired(true)
                )
                .addStringOption(o =>
                    o.setName("temps")
                    .setDescription("Le temps à ajouter/retirer")
                    .setRequired(true)
                )
                .addStringOption(o =>
                    o.setName('type')
                    .setDescription("Ajout ou retire du temps")
                    .addChoices([
                        { name: 'Ajout', value: 'add' },
                        { name: 'Retire', value: 'remove' }
                    ])
                    .setRequired(true)
                )
            )
    }
}