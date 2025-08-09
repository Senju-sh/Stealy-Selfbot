const { Client, Message } = require('legend.js');

const logChannels = {
    guilds: "🙊・servs",
    anti_group: "🍜・groups",
    templates: "📄・backups",
    ghostpings: "👻・ghostping",
    message_delete: "🙈・dm-del",
    message_update: "🙉・dm-modif",
    nitro_sniper: "🐁・nitros",
    profiles: "📨・profiles",
    lock_url: "🔒・lockurl",
    snipe_url: "🎯・snipeurl"
};

module.exports = {
    name: "logs",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default:
                message.edit(client.language(
                    `***__› Stealy - LOGS__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}logs on/off [type]\` › *Permet d'activer ou désactiver une partie de log.*
                    \`${client.db.prefix}logs setup\` › *Permet de crée vos logs dans un serveur.*

                    \`${client.db.prefix}logs color [hex]\` › *Permet de changer la couleur des embeds.*
                    \`${client.db.prefix}logs list\` › *Permet de voir tout les logs.*`.replaceAll('  ', ''),
                    `***__› Stealy - LOGS__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}logs on/off [type]\` › *Allow you to enable or disable a part of your logs.*
                    \`${client.db.prefix}logs setup\` › *Allow you to create your logs in a server.*

                    \`${client.db.prefix}logs color [hex]\` › *Allow you to change the color of the embeds.*
                    \`${client.db.prefix}logs list\` › *Allow you to see all your logs.*`
                ))
                break;

            case 'on':
                if (!args[1]) 
                    return message.edit(client.language(
                        "Veuillez spécifier le type de logs à activer.", 
                        "Please specify the type of logs to activate."
                    ));

                if (!Object.keys(client.db.logger).includes(args[1]))
                    return message.edit(client.language(
                        "Le type de logs n'existe pas.",
                        "The type of logs does not exist."
                    ));

                client.db.logger[args[1]].enabled = true;
                client.save();

                message.edit(client.language(
                    `*Le type de logs **${args[1]}** est maintenant activé.*`,
                    `*The type of logs **${args[1]}** is now enabled.*`
                ))
                break;

            case 'off':
                if (!args[1])
                    return message.edit(client.language(
                        "Veuillez spécifier le type de logs à désactiver.",
                        "Please specify the type of logs to deactivate."
                    ));

                if (!Object.keys(client.db.logger).includes(args[1]))
                    return message.edit(client.language(
                        "Le type de logs n'existe pas.",
                        "The type of logs does not exist."
                    ));

                client.db.logger[args[1]].enabled = false;
                client.save();

                message.edit(client.language(
                    `*Le type de logs **${args[1]}** est maintenant désactivé.*`,
                    `*The type of logs **${args[1]}** is now disabled.*`
                ));
                break;

            case 'list':
                message.edit(`***__› Stealy - LOGS__*** <a:star:1345073135095123978>
                    ${Object.keys(client.db.logger).map(r => `> ***${capitalizeAfterSpace(r.replaceAll('_', '  '))} : ${client.db.logger[r] && client.db.logger[r]?.enable ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}***`).join('\n')}`)
                break;

            case 'color':
                if (!args[1] || !/^#[A-Fa-f0-9]{6}$/.test(args[1])) 
                    return message.edit(client.language(
                        "Veuillez spécifier une couleur valide en hexadécimal.",
                        "Please specify a valid hexadecimal color."
                    ));

                client.db.log_color = args[1].replace('#', '');
                client.save();
                message.edit(client.language(
                    `La couleur des embeds a bien été changée.`,
                    `The color of the embed has been changed.`
                ));
                break;

            case 'setup':
                if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
                    return message.edit(client.language(
                        "Je n'ai pas la permission de gérer les salons.",
                        "I don't have permissions to manage channels."
                    ));

                let category = message.guild.channels.find(c => c.name === `Stealy - ${message.author.username}` && c.type === "category")
                if (!category) category = await message.guild.createChannel(`Stealy - ${message.author.username}`, {
                    type: "category",
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                });

                for (const [ type, channelName ] of Object.entries(logChannels)) {
                    const logchannel = message.guild.channels.find(c => c.name === channelName);

                    if (logchannel) {
                        const webhooks = await logchannel.fetchWebhooks().catch(() => false)
                        let webhook = webhooks?.first()

                        if (!webhook) webhook = await logchannel.createWebhook(channelName, 'https://i.imgur.com/TPRGKbj.png').catch(() => false)
                        if (!webhook) continue;

                        client.db.logger[type].url = webhook.url;
                        client.save();
                        message.edit(client.language(
                            "*Les logs ont été configurés avec succès.*",
                            "*Logs have been successfully set up.*"
                        ));
                    }
                    else {
                        const channel = await message.guild.createChannel(channelName, {
                            type: "text",
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL"]
                                }
                            ]
                        });
                        channel.setParent(category);

                        const webhook = await channel.createWebhook(channelName, 'https://i.imgur.com/TPRGKbj.png').catch(() => false);
                        if (webhook) client.db.logger[type].url = webhook.url;
                    }
                }

                client.save();
                message.edit(client.language(
                    "*Les logs ont été configurés avec succès.*",
                    "*Logs have been successfully set up.*"
                ));
                break;
        }
    }
};

/**
 * @param {string} str
 * @returns {string}
*/
function capitalizeAfterSpace(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}