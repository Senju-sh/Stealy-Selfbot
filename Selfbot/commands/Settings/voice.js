const { Client, Message } = require("legend.js")

module.exports = {
    name: "voice",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        const channelId = client.connexion ? client.connexion.id : null

        switch (args[0]) {
            default: 
                return message.edit(client.language(
                    `***__› Stealy - Voice__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}call <id/mention/stop>\` › *Apeller un utilisateur.*
                    \`${client.db.prefix}find <user>\` › *Permets de trouver un utilisateur en vocal.*

                    \`${client.db.prefix}voice join <id>\` › *Rejoindre un salon vocal.*
                    \`${client.db.prefix}voice leave\` › *Quitter un salon vocal.*

                    \`${client.db.prefix}voice settings\` › *Voir vos paramètres vocaux.*
                    \`${client.db.prefix}voice auto <channel_id>\` › *Défini le nouveau salon vocal qui sera rejoint au démarrage.*

                    \`${client.db.prefix}voice webcam <on/off>\` › *Active ou désactive le module webcamen salon vocal.*
                    \`${client.db.prefix}voice stream <on/off>\` › *Active ou désactive le module stream en salon vocal.*

                    \`${client.db.prefix}voice mute <on/off>\` › *Active ou désactive le micro en salon vocal.*
                    \`${client.db.prefix}voice deaf <on/off>\` › *Active ou désactive le mute casque en salon vocal.*`.replaceAll('  ', ''),
                    
                    `***__› Stealy - Voice__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}call <id/mention/stop>\` › *Call a user.*
                    \`${client.db.prefix}find <user>\` › *Find a user.*

                    \`${client.db.prefix}voice join <id>\` › *Join a voice channel.*
                    \`${client.db.prefix}voice leave\` › *Leave a voice channel.*

                    \`${client.db.prefix}voice settings\` › *See your voice settings.*
                    \`${client.db.prefix}voice auto <channel_id>\` › *Define the new voice channel that will be joined at startup.*

                    \`${client.db.prefix}voice webcam <on/off>\` › *Enable or disable the webcam module in a voice channel.*
                    \`${client.db.prefix}voice stream <on/off>\` › *Enable or disable the stream module in a voice channel.*

                    \`${client.db.prefix}voice mute <on/off>\` › *Enable or disable the microphone in a voice channel.*
                    \`${client.db.prefix}voice deaf <on/off>\` › *Enable or disable the mute headset in a voice channel.*`.replaceAll(' ', '')));

            case "auto":
                const channel = message.mentions.channels.first() || client.channels.get(args[1])
                if (!channel || channel.type !== 'voice') 
                    return message.edit(client.language(
                        `Veuillez entrer un salon vocale valide`, 
                        `Please provide a valid voice channel`
                    ));

                client.db.voice.channelId = channel.id;
                client.save();

                if (client.db.voice.connect) client.voc(channel.id);
                message.edit(client.language(
                    `*Module vocale activé dans ${channel}.*`, 
                    `*Voice module Enabled to ${channel}.*`
                ));
                break;

            case "leave":
                client.db.voice.channelId = null
                client.save();
                
                if (client.db.voice.connect) client.voc();
                message.edit(client.language(
                    "*Le module vocale a été retiré.*",
                    "*The voice module has been removed.*"
                ));
                break;

            case "join":
                const vcchannel = message.mentions.channels.first() || client.channels.get(args[1]);
                if (!vcchannel || !args[1]) 
                    return message.edit(client.language(
                        `*Aucun salon de trouvé pour \`${args[1] || "rien"}\` *`, 
                        `*No channel found for \`${args[1] || "nothing"}\` *`
                    ));

                if (vcchannel.type !== 'voice')
                    return message.edit(client.language(
                        "*Veuillez me donner un salon vocale.*",
                        "*Please give me a voice channel*"
                    ));

                if (client.db.voice.connect) client.voc(vcchannel.id)
                message.edit(client.language(
                    `*${client.user} est actuellement connecté dans ${vcchannel}.*`,
                    `*${client.user} is currently connected to ${vcchannel}.*`
                ));
                break;

            case "webcam":
                if (!["on", "off"].includes(args[1]))
                    return message.edit(client.language(
                        "*Paramètre manquant: `on/off`.*",
                        "*Missing parrameter: `on/off`.*"
                    ));

                if (args[1] === "on") {
                    client.db.voice.video = true
                    client.save()
                    message.edit(client.language(
                        "*Le module webcam a été activé.*",
                        "*The webcam module has been Enabled.*"
                    ));
                }
                else {
                    client.db.voice.video = false;
                    client.save();
                    message.edit(client.language(
                        "*Le module webcam a été désactivé.*",
                        "*The webcam module has been Disabled.*"
                    ));
                }
                if (client.db.voice.connect) client.voc(channelId);
                break;

            case "mute":
                if (!["on", "off"].includes(args[1])) 
                    return message.edit(client.language(
                        "*Paramètre manquant: `on/off`.*",
                        "*Missing parrameter: `on/off`.*"
                    ));

                if (args[1] === "on") {
                    client.db.voice.mute = true;
                    client.save();
                    message.edit(client.language(
                        "*Le module mute micro a été activé.*",
                        "*The mic module has been enabled.*"
                    ))
                }
                else {
                    client.db.voice.mute = false;
                    client.save();
                    message.edit(client.language(
                        "*Le module mute micro a été désactivé.*",
                        "*The mic module has been Disabled.*"
                    ));
                }
                if (client.db.voice.connect) client.voc(channelId);
                break;

            case "deaf":
                if (!["on", "off"].includes(args[1])) 
                    return message.edit(client.language(
                        "*Paramètre manquant: `on/off`.*",
                        "*Missing parrameter: `on/off`.*"
                    ));

                if (args[1] === "on") {
                    client.db.voice.deaf = true;
                    client.db.voice.mute = true;
                    client.save();
                    message.edit(client.language(
                        "*Le module mute casque a été activé.*", 
                        "*The deafen module has been enabled.*"
                    ));
                }
                else {
                    client.db.voice.deaf = false;
                    client.save();
                    message.edit(client.language(
                        "*Le module mute casque a été désactivé.*",
                        "*The deafen module has been Disabled.*"
                    ));
                }
                if (client.db.voice.connect) client.voc(channelId);
                break;

            case "stream":
                
                if (!["on", "off"].includes(args[1])) 
                    return message.edit(client.language(
                        "*Paramètre manquant: `on/off`.*", 
                        "*Missing parrameter: `on/off`.*"
                    ));

                if (args[1] === "on") {
                    client.db.voice.stream = true;
                    client.save();
                    message.edit(client.language(
                        "*Le module streaming a été activé.*",
                        "*The streaming module has been Enabled.*"
                    ));
                }
                else if (args[1] === "off") {
                    client.db.voice.stream = false;
                    client.save();

                    message.edit(client.language(
                        "*Le module streaming a été désactivé.*",
                        "*The streaming module has been Disabled.*"
                    ));
                }
                if (client.db.voice.connect) client.voc(channelId)
                break;

            case "antijoin":
                if (!client.config.owners.includes(message.author.id)) return;
                if (!["on", "off", "list"].includes(args[1])) return message.edit(client.language(`*\`${client.db.prefix}voice antijoin <on/off> <channel_id>\`*`, `*\`${client.db.prefix}voice antijoin <on/off> <channel_id>\`*`));

                if (args[1] === "list") {
                    if (client.db.voice.antijoin.length === 0) return message.edit(client.language("*Aucun salon dans l'antijoin.*", "*No channel in the anti join.*"));
                    message.edit(client.language(`*Salons dans l'antijoin :*\n${client.db.voice.antijoin.map(id => `<#${id}>`).join("\n")}`, `*Channels in the anti join :*\n${client.db.voice.antijoin.map(id => `<#${id}>`).join("\n")}`));
                }
                if (args[1] === "on") {
                    const antijoinchannel = message.mentions.channels.first() || client.channels.get(args[2]) || message.channel;
                    if (!antijoinchannel || !['voice', 'stage'].includes(antijoinchannel.type)) return message.edit(client.language("*Veuillez entrer un ID de salon vocal valide.*", "*Please enter a valide voice channel ID.*"));

                    if (client.db.voice.antijoin.includes(antijoinchannel.id)) {
                        message.edit(client.language(`*Le salon ${antijoinchannel} est deja dans l'antijoin*`, `*The channel ${antijoinchannel} is already in the anti join*`));
                    } else {
                        message.edit(client.language(`*Le salon ${antijoinchannel} est maintenant dans l'antijoin*`, `*The channel ${antijoinchannel} is now in the anti join*`));
                        client.db.voice.antijoin.push(antijoinchannel.id);
                        client.save();
                    }
                }

                if (args[1] === "off") {
                    const antijoinchannel = message.mentions.channels.first() || client.channels.get(args[2]) || message.channel;
                    if (!antijoinchannel) return message.edit(client.language("*Veuillez entrer un ID de salon vocal valide.*", "*Please enter a valide voice channel ID.*"));

                    if (client.db.voice.antijoin.includes(antijoinchannel.id)) {
                        message.edit(client.language(`*Le salon ${antijoinchannel} est maintenant hors de l'antijoin*`, `*The channel ${antijoinchannel} is now out of the anti join*`));
                        client.db.voice.antijoin = client.db.voice.antijoin.filter(id => id !== antijoinchannel.id);
                        client.save();
                    } else {
                        message.edit(client.language(`*Le salon ${antijoinchannel} n'est pas dans l'antijoin*`, `*The channel ${antijoinchannel} is not in the anti join*`));
                    }
                }
                break;

            case 'wl':
                if (!client.config.owners.includes(message.author.id)) return;
                if (args[1] === "list") {
                    message.edit(client.language(`*Voici la liste des utilisateurs whitelist de l'antijoin :*\n${client.db.voice.whitelist.length === 0 ? "Aucun utilisateur" : client.db.voice.whitelist.map((r, i) => `\`${i + 1}\`・<@${r}> (\`${r}\`)`).join('\n')}`, `*Here is the list of whitelisted users of the antijoin :*\n${client.db.voice.whitelist.length === 0 ? "No user" : client.db.voice.whitelist.map((r, i) => `\`${i + 1}\`・<@${r}> (\`${r}\`)`).join('\n')}`));
                } else {
                    let user = message.mentions.users.first() || client.channels.get(args[1]) || await client.fetchUser(args[1] ?? client.user.id).catch(() => false);
                    if (!user) return message.edit(client.language(`*Veuillez entrer un utilisateur valide.*`, `*Please enter a valid user.*`));

                    client.db.voice.whitelist.push(user.id);
                    client.save();
                    message.edit(client.language(`*${user} a été ajouté à la whitelist de l'antijoin.*`, `*${user} has been added to the whitelist of the antijoin.*`))
                }
                break;

            case 'unwl':
                if (!client.config.owners.includes(message.author.id)) return;
                let user2 = message.mentions.users.first() || client.channels.get(args[1]) || await client.fetchUser(args[1] ?? client.user.id).catch(() => false);
                if (!user2) return message.edit(client.language(`*Veuillez entrer un utilisateur valide.*`, `*Please enter a valid user.*`));

                client.db.voice.whitelist = client.db.voice.whitelist.filter(id => id !== user2.id);
                client.save();
                message.edit(client.language(`*${user2} a été retiré de la whitelist de l'antijoin.*`, `*${user2} has been removed from the whitelist of the antijoin.*`))
                break;

            case "settings":
                message.edit(client.language(
                    `<a:star:1345073135095123978> __**Stealy - Voice**__ <a:star:1345073135095123978>
        
                    > **Auto    :** ${client.db.voice.channelId ? `<#${client.db.voice.channelId}>` : client.language(`\`Aucun\``, `\`Nothing\``)}
                    > **Micro   :** ${client.db.voice.mute ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Casque  :** ${client.db.voice.deaf ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Camera  :** ${client.db.voice.webcam ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Stream  :** ${client.db.voice.stream ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}`.replaceAll('  ', ''),
                        
                    `<a:star:1345073135095123978> __**Stealy - Voice**__ <a:star:1345073135095123978>
                        
                    > **Auto    :** ${client.db.voice.channelId ? `<#${client.db.voice.channelId}>` : client.language(`\`Aucun\``, `\`Nothing\``)}
                    > **Mic     :** ${client.db.voice.mute ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Headset :** ${client.db.voice.deaf ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Webcam  :** ${client.db.voice.webcam ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}
                    > **Stream  :** ${client.db.voice.stream ? "<:on:1345720302105002036>" : "<:off:1327710569184366726>"}`.replaceAll('  ', '')
                ));
                break;
        }
    }
}