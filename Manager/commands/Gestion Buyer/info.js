const { SlashCommandBuilder, Client, Message, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('node:fs');

const images = [
    "https://i.imgur.com/OAIzyst.png",
    "https://i.imgur.com/AggmAAK.png",
    "https://i.imgur.com/muL1icZ.png",
    "https://i.imgur.com/RVXHU80.png"
];

module.exports =
{
    name: "info",
    description: "Afficher les informations de votre machine.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const db = await client.get_database(interaction.user.id);
        const embed = 
        {
            color: 0x000000,
            author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
            description: `- Etat: \`${db.enable ? '✅' : '❌'}\`\n- Expiration: **LIFETIME**\n- Prefix: \`${db ? db.prefix : '&'}\``,
            thumbnail: { url: 'https://i.imgur.com/TPRGKbj.png' },
            image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(client.connected[interaction.user.id] ? 'shutdown' : 'start')
                .setStyle(client.connected[interaction.user.id] ? ButtonStyle.Danger : ButtonStyle.Success)
                .setLabel(client.connected[interaction.user.id] ? 'Arrêter' : 'Démarrer'),

            new ButtonBuilder()
                .setCustomId('restart')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Redémarrer')
                .setDisabled(client.connected[interaction.user.id] ? false : true),

            // new ButtonBuilder()
            //     .setCustomId('edit-token')
            //     .setLabel('Modifier le token')
            //     .setStyle(ButtonStyle.Secondary)
            //     .setDisabled(client.connected[interaction.user.id] ? false : true)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [row], files: [{ attachment:  images[Math.floor(Math.random()* images.length)], name: 'stealy.png' }] });
        const collector = msg.createMessageComponentCollector({ time: 1000 * 60 });

        collector.on('collect', async i => 
        {
            if (i.user.id !== interaction.user.id)
                return i.reply({ content: 'Vous ne pouvez pas utiliser ce bouton', flags: 64 });

            switch(i.customId)
            {
                case 'start':
                    await i.deferReply({ flags: 64 });
                    
                    try {
                        const userStartToken = client.config.users.find(t => {
                            try {
                                return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id;
                            } catch (error) {
                                console.error('Erreur lors du décryptage du token:', error);
                                return false;
                            }
                        });
                        
                        if (userStartToken){
                            db.enable = true;
                            fs.writeFileSync(`./Structures/databases/${interaction.user.id}.json`, JSON.stringify(db, null, 4));
                        }
                        
                        const userToken = client.config.users.find(t => {
                            try {
                                return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id;
                            } catch (error) {
                                console.error('Erreur lors du décryptage du token:', error);
                                return false;
                            }
                        });
                        
                        if (userToken) {
                            try {
                                await client.load_token(client.decrypt(userToken));
                            } catch (error) {
                                console.error('Erreur lors du chargement du token:', error);
                                return i.editReply({ content: 'Erreur lors du démarrage de la machine' });
                            }
                        }
                        
                        setTimeout(() => { 
                            editMessage(); 
                            i.editReply({ content: 'Votre machine a démarré' });
                        }, 1000 * 2);
                    } catch (error) {
                        console.error('Erreur lors du démarrage:', error);
                        i.editReply({ content: 'Une erreur est survenue lors du démarrage' });
                    }
                    break;

                case 'shutdown':
                    i.deferUpdate();

                    try {
                        const userSToken = client.config.users.find(t => {
                            try {
                                return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id;
                            } catch (error) {
                                console.error('Erreur lors du décryptage du token:', error);
                                return false;
                            }
                        });
                        
                        if (userSToken){
                            db.enable = false;
                            fs.writeFileSync(`./Structures/databases/${interaction.user.id}.json`, JSON.stringify(db, null, 4));
                        }

                        if (client.connected[interaction.user.id]) {
                            client.connected[interaction.user.id].terminate();
                            delete client.connected[interaction.user.id];
                        }

                        editMessage();
                    } catch (error) {
                        console.error('Erreur lors de l\'arrêt:', error);
                    }
                    break;

                case 'restart':
                    await i.deferReply({flags: 64 });

                    try {
                        const tokenToRestart = client.config.users.find(t => {
                            try {
                                return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id;
                            } catch (error) {
                                console.error('Erreur lors du décryptage du token:', error);
                                return false;
                            }
                        });
                        
                        if (tokenToRestart) {
                            if (client.connected[interaction.user.id]) {
                                client.connected[interaction.user.id].terminate();
                                delete client.connected[interaction.user.id];
                            }
                            
                            try {
                                await client.load_token(client.decrypt(tokenToRestart));
                            } catch (error) {
                                console.error('Erreur lors du chargement du token:', error);
                                return i.editReply({ content: 'Erreur lors du redémarrage de la machine' });
                            }
                        }

                        i.editReply({ content: 'Votre machine a redémarré' });
                        
                        setTimeout(() => {
                            editMessage();
                        }, 2000);
                    } catch (error) {
                        console.error('Erreur lors du redémarrage:', error);
                        i.editReply({ content: 'Une erreur est survenue lors du redémarrage' });
                    }
                    break;

                case 'edit-token':
                    try {
                        const modal = new ModalBuilder()
                            .setTitle("Changement de token")
                            .setCustomId('token')
                            .setComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('token')
                                        .setLabel("Veuillez entrer votre token ici")
                                        .setStyle(TextInputStyle.Short)
                                        .setRequired(true)
                                )
                            )

                        await i.showModal(modal);

                        const modalCollector = await i.awaitModalSubmit({ time: 1000 * 60 * 10 }).catch(() => null);
                        if (!modalCollector) return;
                        
                        await modalCollector.deferReply({ flags: 64 })
                        const newToken = modalCollector.fields.getTextInputValue('token');

                        const res = await fetch('https://discord.com/api/users/@me', { 
                            headers: { authorization: newToken.replaceAll('"', '') } 
                        }).then(r => r.json()).catch(() => null);
                        
                        if (!res || !res?.id)
                            return modalCollector.editReply({ content: 'Le token est invalide' });

                        if (res.id !== interaction.user.id)
                            return modalCollector.editReply({ content: "Le token n'est pas votre token" });
                        
                        // Arrêter la connexion existante de manière sécurisée
                        try {
                            const tokenToStop = client.config.users.find(t => {
                                try {
                                    return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id;
                                } catch (error) {
                                    console.error('Erreur lors du décryptage du token:', error);
                                    return false;
                                }
                            });
                            
                            if (tokenToStop && client.connected[interaction.user.id]) {
                                client.connected[interaction.user.id].terminate();
                                delete client.connected[interaction.user.id];
                            }
                        } catch (error) {
                            console.error('Erreur lors de l\'arrêt de la connexion:', error);
                        }
                        
                        // Charger le nouveau token
                        await client.load_token(newToken);
                        
                        modalCollector.editReply({ content: 'Le changement de token a bien été effectué' });
                        
                        // Mettre à jour le message après un délai
                        setTimeout(() => {
                            editMessage();
                        }, 2000);
                        
                    } catch (error) {
                        console.error('Erreur lors du changement de token:', error);
                        if (i.replied || i.deferred) {
                            try {
                                await i.editReply({ content: 'Une erreur est survenue lors du changement de token' });
                            } catch (e) {
                                console.error('Erreur lors de l\'édition de la réponse:', e);
                            }
                        }
                    }
                    break;
            }
        })

        /**
         * @returns {void}
        */
        function editMessage(){
            const embed = 
            {
                color: 0x000000,
                author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
                description: `- Etat: \`${db.enable ? '✅' : '❌'}\`\n- Expiration: **LIFETIME**\n- Prefix: \`${db ? db.prefix : '&'}\``,
                thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
                image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
            };

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(client.connected[interaction.user.id] ? 'shutdown' : 'start')
                    .setStyle(client.connected[interaction.user.id] ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setLabel(client.connected[interaction.user.id] ? 'Arrêter' : 'Démarrer'),

                new ButtonBuilder()
                    .setCustomId('restart')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Redémarrer')
                    .setDisabled(client.connected[interaction.user.id] ? false : true),

                // new ButtonBuilder()
                //     .setCustomId('edit-token')
                //     .setLabel('Modifier le token')
                //     .setStyle(ButtonStyle.Secondary)
                //     .setDisabled(client.connected[interaction.user.id] ? false : true)
            )

            return msg.edit({ embeds: [embed], components: [row] });
        }
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setContexts([0, 1, 2])
            .setDescription(this.description)
    }
}
