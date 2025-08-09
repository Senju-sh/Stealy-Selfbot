const { ChatInputCommandInteraction, Client, Events } = require("discord.js");
const demandes = require('../../../Structures/files/demandes.json');
const fs = require('node:fs');

const connected_embed = 
{
    title: "Demande Validée",
    color: 0x00FF00,
    description: `Vous avez été connecté à la machine !\n-# La connexion peut prendre quelques minutes`
}

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    run: async (interaction, client) => {

        if (interaction.isCommand()) 
        {
            const guild = client.guilds.cache.get(client.config.guild_id);
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (command.botOwnerOnly && !client.config.owners.includes(interaction.user.id))
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du bot pour exécuter cette commande.**`,
                    flags: 64
                });
            

            if (command.guildOwnerOnly && guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id))
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`,
                    flags: 64
                });
            

            if (command.staffOnly) 
            {
                if (guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id) && 
                   !guild.members.cache.get(interaction.user.id)?.roles?.cache?.has(client.config.staff_role))
                    return interaction.reply({
                        content: `❌ **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`,
                        flags: 64
                    });
            }

            command.executeSlash(client, interaction);
            console.log("[CMD-S]", interaction.guild ? `${interaction.guild.name} | ${interaction.channel.name}` : `DM`, `| ${interaction.user.displayName} | ${command.name}`);
        }

        else if (interaction.isButton()) {
            switch (true) {
                case interaction.customId.startsWith('accepter_'):
                    if (!demandes[interaction.customId.split('_')[1]]) return interaction.reply({ content: `Le token n'est pas enregistré dans notre base de donnée.`, flags: 64 });

                    interaction.deferUpdate().catch(() => false);

                    interaction.message.delete();
                    client.load_token(client.decrypt(demandes[interaction.customId.split('_')[1]]));

                    interaction.channel.send({ content: `${interaction.user} a accepté <@${interaction.customId.split('_')[1]}>` });
					
					delete demandes[interaction.customId.split('_')[1]];
                    fs.writeFileSync('./Structures/files/demandes.json', JSON.stringify(demandes, null, 4));
					
					client.users.fetch(interaction.customId.split('_')[1]).then(r => r.send({ embeds: [connected_embed] })).catch(() => false);
                    break;

                case interaction.customId.startsWith('refuser_'):
                    interaction.deferUpdate().catch(() => false);
                    interaction.message.delete();

                    interaction.channel.send({ content: `${interaction.user} a refusé <@${interaction.customId.split('_')[1]}>` });

                    delete demandes[interaction.customId.split('_')[1]];
                    fs.writeFileSync('./Structures/files/demandes.json', JSON.stringify(demandes, null, 4));
                    break;

                case interaction.customId.startsWith('detect_'):
                    const [_, userId, ...selfbots] = interaction.customId.split('_');
                    if (!selfbots.length) return interaction.reply({ content: "Aucun selfbot détecté.", ephemeral: true });

                    interaction.deferUpdate().catch(() => false);
                    interaction.channel.send({ content: `*${interaction.user} a refusé <@${userId}> (\`détéctions\`)*` })
                    interaction.message.delete();

                    const user = await client.users.fetch(userId).catch(() => false);
                    const embed = {
                        title: "Stealy - Refusé",
                        thumbnail: { url: `https://i.imgur.com/TPRGKbj.png` },
                        color: 0xFFFFFF,
                        author: {
                            name: "Stealy",
                            iconURL: "https://i.imgur.com/TPRGKbj.png",
                            url: `https://discord.gg/stealy`
                        },
                        description: `${client.emoji.cross} 〃 Votre demande a été **__refusée__** dû à votre présence sur d'autres machines : \n${selfbots.map(r => `\`${r}\``).join(', ')}`,
                        footer: {
                            text: `Stealy - ${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
                        }
                    };

                    user.send({ embeds: [embed] })
                        .then((message) => setTimeout(() => message.delete(), 300000))
                        .catch(() => false)
                    break;
            }
        }
    },
};