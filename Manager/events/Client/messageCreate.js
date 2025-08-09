const { Client,  Events, Message, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const demandes = require('../../../Structures/files/demandes.json');
const blacklist = require('../../../Structures/files/sbl.json');
const fs = require('node:fs');
const timeout = {};

const timeout_embed = 
{
    title: "Veuillez Patienter",
    color: 0xFFFFFF,
    description: `Vous avez envoyez une demande récement\n-# Veuillez patienter avant d'en renvoyer une nouvelle`
}

const alreaedyDemande_embed = 
{
    title: "Veuillez Patienter",
    color: 0xFFFFFF,
    description: `Votre demande de connexion est déjà en cours de traitement`
}

const invalid_embed = 
{
    title: "Token Invalide",
    color: 0xFFFFFF,
    description: `Le token que vous avez envoyer est invalide.`
}

const demande_embed = 
{
    title: "Demande Envoyée",
    color: 0x00FF00,
    description: "Votre demande a été envoyée.\n-# Veuillez attendre qu'un staff accepte votre demande"
}

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        switch(message.channel.type){
            case ChannelType.DM: 
            {
                if (message.author.id == client.user.id) return;

                const guild = client.guilds.cache.get(client.config.guild_id);
                if (!guild) return console.log("[ERROR] Aucun serveur de trouvé");

                const member = await guild.members.fetch(message.author.id).catch(() => null);
                if (member && !member.roles.cache.has(client.config.whitelist_role)) return;

                if (demandes[message.author.id])
                    return message.channel.send({ embeds: [alreaedyDemande_embed] })
                        .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10))


                // if (timeout[message.author.id])
                //     return message.channel.send({ embeds: [timeout_embed] })
                //         .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10))
                
                // timeout[message.author.id] = true;
                // setTimeout(() => delete timeout[message.author.id], 1000 * 60);

                const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: message.content.replaceAll('"', '') } })
                    .then(r => r.json())
                    .catch(() => null);

                if (!res || !res.id) return message.channel.send({ embeds: [invalid_embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10));

                message.channel.send({ embeds: [demande_embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10));

                const guilds = await fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { authorization: message.content.replaceAll('"', '') } })
                    .then(r => r.json())

                const selfbots = blacklist.servs.filter(o => guilds.some(g => g.id == o.id));
                const staff_embed =
                {
                    title: "Nouvelle Demande",
                    color: 0xFFFFFF,
                    author: { name: res.global_name ?? res.username, icon_url: res.avatar ? `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.${res.avatar.startsWith('a_') ? 'gif' : 'png'}` : null },
                    description: `***Username*** • \`${res.username}\`
                                    ***Pseudo Global*** • \`${res.global_name ?? '❌'}\`
                                    ***ID*** • \`${res.id}\`
                                    ***Clan*** • \`${res.clan ? res.clan.tag : '❌'}\`
                                    ${selfbots.length == 0 ? "" : `***Détéction*** • ${selfbots.map(r => `\`${r.username}\``).join(', ') || 'Aucune'}`}`.replaceAll('  ', '')
                }

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`accepter_${message.author.id}`)
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Accepter"),

                    new ButtonBuilder()
                        .setCustomId(`refuser_${message.author.id}`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Refuser"),
                )

                if (selfbots.length) row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`detect_${message.author.id}_${selfbots.map(r => r.username).join('_')}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Détéction")
                )

                demandes[message.author.id] = client.encrypt(message.content.replaceAll('"', ''));
                fs.writeFileSync('./Structures/files/demandes.json', JSON.stringify(demandes, null, 4));
                return guild.channels.cache.get(client.config.log_channel)?.send({ embeds: [staff_embed], components: [row] });
            }
        }
    },
};