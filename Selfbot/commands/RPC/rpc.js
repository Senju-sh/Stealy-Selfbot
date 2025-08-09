const { Client, Message, RichPresence } = require('legend.js');
const { randomUUID } = require('crypto');

const types = [  "PLAYING", "WATCHING", "STREAMING", "LISTENING", "COMPETING" ];
const platforms = ["ps5", "ps4", "xbox", "desktop", "samsung", "ios"]

module.exports = {
    name: "rpc",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {

        switch (args[0]) {
            default:
                return message.edit(client.language(
                    `***__› Stealy - RPC__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}rpc <on/off>\` › *Permet d'activer ou desactiver la Rpc.*
                    \`${client.db.prefix}rpc reset\` › *Permet de reset la Rpc.*
                    \`${client.db.prefix}rpc settings\` › *Permet de voir les paramètres de la Rpc.*

                    \`${client.db.prefix}rpc platform <desktop/ps4/ps5/xbox/samsung/ios>\` › *Permet de changer la plateform du RPC.*
                    \`${client.db.prefix}rpc name <text>\` › *Permet de changer le nom du RPC.*
                    \`${client.db.prefix}rpc details <text>\` › *Permet de changer les détails du RPC.*
                    \`${client.db.prefix}rpc state <text>\` › *Permet de changer l'état de la RPC.*
                    \`${client.db.prefix}rpc type <playing/watching/streaming/listening/competing>\` › *Permet de changer le type de RPC.*
                    \`${client.db.prefix}rpc largeimage <image link> <text>\` › *Permet de changer la grande image de la RPC.*
                    \`${client.db.prefix}rpc smallimage <image link> <text>\` › *Permet de changer la petite image de la RPC.*
                    \`${client.db.prefix}rpc time <on/off>\` › *Permet d'activer ou désactiver le temps du RPC.*
                    \`${client.db.prefix}rpc button <link> <text>\` › *Permet d'ajouter un bouton sur la RPC.*
                    \`${client.db.prefix}rpc button2 <link> <text>\` › *Permet d'ajouter un 2ème bouton sur la RPC.*
                    \`${client.db.prefix}rpc party <17/17>\` › *Vous permets de mettre un nombre de joueurs dans la RPC.*`.replaceAll('  ', ''),
                    `***__› Stealy - RPC__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}rpc <on/off>\` › *To activate or deactivate the Rpc.*
                    \`${client.db.prefix}rpc reset\` › *To reset the Rpc.*
                    \`${client.db.prefix}rpc settings\` › *To see the settings of the Rpc.*

                    \`${client.db.prefix}rpc platform <desktop/ps4/ps5/xbox/samsung/ios>\` › *To Change the RPC platform.*
                    \`${client.db.prefix}rpc name <text>\` › *To change the name of the RPC.*
                    \`${client.db.prefix}rpc details <text>\` › *To change the details of the RPC.*
                    \`${client.db.prefix}rpc state <text>\` › *To change the state of the RPC.*
                    \`${client.db.prefix}rpc type <playing/watching/streaming/listening/competing>\` › *To change the type of the RPC.*
                    \`${client.db.prefix}rpc largeimage <image link> <text>\` › *To change the large image of the RPC.*
                    \`${client.db.prefix}rpc smallimage <image link> <text>\` › *To change the small image of the RPC.*
                    \`${client.db.prefix}rpc time <on/off>\` › *To activate or deactivate the time of the RPC.*
                    \`${client.db.prefix}rpc button <link> <text>\` › *To add a button on the RPC.*
                    \`${client.db.prefix}rpc button2 <link> <text>\` › *To add a 2nd button on the RPC.*
                    \`${client.db.prefix}rpc party <17/17>\` › *You can put a number of players in the RPC.*`.replaceAll('  ', '')
                ));

            case "reset":
                client.db.rpc = {
                    "status": true,
                    "name": "⚡",
                    "type": 5,
                    "details": "Stealy",
                    "platform": "desktop",
                    "application_id": "1339555215782707282",
                    "assets": {
                        "large_image": "mp:external/77_4czkhFeGsUq1JY0nnFNtuZO5CH6qfPaKHpb0sYhY/https/i.imgur.com/0LxRndR.png?width=473&height=473"
                    },
                    "buttons": [ "⚡・Stealy" ],
                    "metadata": {
                        "button_urls": [ "https://discord.gg/F7S9CwSK7p" ]
                    }
                },
                client.save();
                client.multiRPC();

                message.edit(client.language(
                    `*Votre rpc a été reset.*`,
                    `*Your rpc has been reset.*`))
                break;

            case 'on':
                if (client.db.rpc.status) 
                    return message.edit(client.language(
                        "*Le RPC est déjà activé.*",
                        "*The RPC is already activated.*"
                    ));
                message.edit(client.language(
                    "***Le RPC a été activé***",
                    "***The RPC has been activated***"
                ));
                client.db.rpc.status = true;
                client.save();
                client.multiRPC();
                break;

            case 'off':
                if (!client.db.rpc.status)
                    return message.edit(client.language(
                        "***Le RPC est déjà désactivé***",
                        "***The RPC is already deactivated***"
                    ));
                message.edit(client.language(
                    "***Le RPC a été désactivé***",
                    "***The RPC has been deactivated***"
                ));
                client.db.rpc.status = false;
                client.save();
                client.multiRPC();
                break;

            case 'name':
                message.edit(client.language(
                    `***Le nom du RPC a été ${args[1] ? 'modifié' : 'supprimé'}***`,
                    `***The RPC name has been ${args[1] ? 'changed' : 'removed'}***`
                ));
                client.db.rpc.name = args.slice(1).join(' ') || 'ㅤ';
                client.save();
                client.multiRPC();
                break;

            case 'details':
                message.edit(client.language(
                    `***Les détails du RPC ont été ${args[1] ? 'modifiés' : 'supprimés'}***`,
                    `***The RPC details have been ${args[1] ? 'changed' : 'removed'}***`
                ));
                args[1] ? client.db.rpc.details = args.slice(1).join(' ') : delete client.db.rpc.details;
                client.save();
                client.multiRPC();
                break;

            case 'state':
                message.edit(client.language(
                    `***L'état du RPC a été ${args[1] ? 'modifié' : 'supprimé'}***`,
                    `***The RPC state has been ${args[1] ? 'changed' : 'removed'}***`
                ));
                args[1] ? client.db.rpc.state = args.slice(1).join(' ') : delete client.db.rpc.state;
                client.save();
                client.multiRPC();
                break;

            case 'type':
                if (!types.includes(args[1]?.toUpperCase()))
                    return message.edit(client.language(
                        `***Veuillez entrer un des types suivants: ${types.map(r => `\`${r}\``).join(', ')}***`,
                        `***Please enter one of the following types: ${types.map(r => `\`${r}\``).join(', ')}***`
                    ));

                message.edit(client.language(
                    "***Le type du RPC a été modifié***",
                    "***The RPC type has been changed***"
                ));
                client.db.rpc.type = args[1].toUpperCase();
                client.save();
                client.multiRPC();
                break;

            case 'platform':
                if (!platforms.includes(args[1]?.toLowerCase()))
                    return message.edit(client.language(
                        `***Veuillez entrer une des plateformes suivantes: ${platforms.map(r => `\`${r}\``).join(', ')}***`,
                        `***Please enter one of the following platforms: ${platforms.map(r => `\`${r}\``).join(', ')}***`
                    ));
                message.edit(client.language(
                    "***La plateforme du RPC a été modifiée***",
                    "***The RPC platform has been changed***"
                ));
                client.db.rpc.platform = args[1];
                client.save();
                client.multiRPC();
                break;

            case 'smallimage':
                if (!args[1]) {
                    message.edit(client.language(
                        "***La petite image du RPC a été supprimée***",
                        "***The small image of the RPC has been removed***"
                    ));
                    if (client.db.rpc.assets?.['small_image']) delete client.db.rpc.assets['small_image'];
                    if (client.db.rpc.assets?.['small_text']) delete client.db.rpc.assets['small_text'];
                    if (Object.keys(client.db.rpc.assets || {}).length == 0) delete client.db.rpc.assets;
                    client.save();
                    client.multiRPC();
                    break;
                }
                const getExtendURL = await RichPresence.getExternal(client, "1352297034669101117", args[1].replace("http://", "https://"));
                if (Array.isArray(getExtendURL) && getExtendURL.length > 0 && getExtendURL[0].external_asset_path) {
                    if (!client.db.rpc.assets) client.db.rpc.assets = {};
                    client.db.rpc.assets['small_image'] = 'mp:' + getExtendURL[0].external_asset_path;
                    if (args[2]) client.db.rpc.assets['small_text'] = args.slice(2).join(' ');
                    else delete client.db.rpc.assets['small_text'];
                    client.save();
                    client.multiRPC();
                    message.edit(client.language(
                        "***La petite image du RPC a été modifiée***",
                        "***The small image of the RPC has been changed***"
                    ));
                } else {
                    message.edit(client.language(
                        "***Erreur lors de l'obtention de l'URL***",
                        "***Error while getting the URL***"
                    ));
                }
                break;

            case 'largeimage':
                if (!args[1]) {
                    message.edit(client.language(
                        "***La grande image du RPC a été supprimée***",
                        "***The large image of the RPC has been removed***"
                    ));
                    if (client.db.rpc.assets?.['large_image']) delete client.db.rpc.assets['large_image'];
                    if (client.db.rpc.assets?.['large_text']) delete client.db.rpc.assets['large_text'];
                    if (Object.keys(client.db.rpc.assets || {}).length == 0) delete client.db.rpc.assets;
                    client.save();
                    client.multiRPC();
                    break;
                }
                const getExtendURL2 = await RichPresence.getExternal(client, "1352297034669101117", args[1].replace("http://", "https://"));
                if (Array.isArray(getExtendURL2) && getExtendURL2.length > 0 && getExtendURL2[0].external_asset_path) {
                    if (!client.db.rpc.assets) client.db.rpc.assets = {};
                    client.db.rpc.assets['large_image'] = 'mp:' + getExtendURL2[0].external_asset_path;
                    if (args[2]) client.db.rpc.assets['large_text'] = args.slice(2).join(' ');
                    else delete client.db.rpc.assets['large_text'];
                    client.save();
                    client.multiRPC();
                    message.edit(client.language(
                        "***La grande image du RPC a été modifiée***",
                        "***The large image of the RPC has been changed***"
                    ));
                } else {
                    message.edit(client.language(
                        "***Erreur lors de l'obtention de l'URL***",
                        "***Error while getting the URL***"
                    ));
                }
                break;

            case 'button':
                if (!args[1] || !args[2]) {
                    message.edit(client.language(
                        "***Le premier bouton du RPC a été supprimé***",
                        "***The first button of the RPC has been removed***"
                    ));
                    if (client.db.rpc.metadata?.['button_urls']) client.db.rpc.metadata.button_urls[0] = null;
                    if (client.db.rpc.metadata && !client.db.rpc.metadata.button_urls.filter(a => typeof a == 'string').length) delete client.db.rpc.metadata;
                    if (client.db.rpc.buttons && client.db.rpc.buttons.length == 1) client.db.rpc.buttons.splice(0, 1);
                    if (client.db.rpc.buttons && client.db.rpc.buttons.length == 2) client.db.rpc.buttons[0] = null;
                    if (client.db.rpc.buttons && !client.db.rpc.buttons.filter(a => typeof a == 'string').length) delete client.db.rpc.buttons;
                    client.save();
                    client.multiRPC();
                } else {
                    message.edit(client.language(
                        "***Le premier bouton du RPC a été modifié***",
                        "***The first button of the RPC has been changed***"
                    ));
                    if (!client.db.rpc.buttons) client.db.rpc.buttons = [args.slice(2).join(' ')];
                    else client.db.rpc.buttons[0] = args.slice(2).join(' ');
                    if (!client.db.rpc.metadata) client.db.rpc.metadata = {};
                    if (!client.db.rpc.metadata['button_urls']) client.db.rpc.metadata['button_urls'] = [args[1]];
                    else client.db.rpc.metadata['button_urls'][0] = args[1];
                    client.save();
                    client.multiRPC();
                }
                break;

            case 'button2':
                if (!args[1] || !args[2]) {
                    message.edit(client.language(
                        "***Le second bouton du RPC a été supprimé***",
                        "***The second button of the RPC has been removed***"
                    ));
                    if (client.db.rpc.metadata?.['button_urls']) client.db.rpc.metadata.button_urls.splice(1, 1);
                    if (client.db.rpc.metadata && !client.db.rpc.metadata.button_urls.filter(a => typeof a == 'string').length) delete client.db.rpc.metadata;
                    if (client.db.rpc.buttons) client.db.rpc.buttons.splice(1, 1);
                    if (client.db.rpc.buttons && !client.db.rpc.buttons.filter(a => typeof a == 'string').length) delete client.db.rpc.buttons;
                    client.save();
                    client.multiRPC();
                } else {
                    message.edit(client.language(
                        "***Le second bouton du RPC a été modifié***",
                        "***The second button of the RPC has been changed***"
                    ));
                    if (!client.db.rpc.buttons) client.db.rpc.buttons = [null, args.slice(2).join(' ')];
                    else client.db.rpc.buttons[1] = args.slice(2).join(' ');
                    if (!client.db.rpc.metadata) client.db.rpc.metadata = {};
                    if (!client.db.rpc.metadata['button_urls']) client.db.rpc.metadata['button_urls'] = [null, args[1]];
                    else client.db.rpc.metadata['button_urls'][1] = args[1];
                    client.save();
                    client.multiRPC();
                }
                break;

            case 'party':
                if (!args[1]){
                    delete client.db.rpc.party;
                    client.save();
                    client.multiRPC();
                    return message.edit(client.language(
                        "***Le nombre de joueurs du RPC a été supprimé***",
                        "***The number of players in the RPC has been removed***"
                    ));
                }
                else {
                    if (!args[1].includes('/') || isNaN(args[1].split('/')[0]) || isNaN(args[1].split('/')[1]) || args[1].split('/').length != 2)
                        return message.edit(client.language(
                            "***Veuillez entrer un nombre de joueurs valide (ex: 17/17)***",
                            "***Please enter a valid number of players (ex: 17/17)***"
                        ));
                    const [current, max] = args[1].split('/').map(Number);
                    if (current < 0 || max <= 0 || current > max)
                        return message.edit(client.language(
                            "***Veuillez entrer un nombre de joueurs valide (ex: 17/17)***",
                            "***Please enter a valid number of players (ex: 17/17)***"
                        ));
                    
                    client.db.rpc.party = { current, max, id: randomUUID() };
                    client.save();
                    client.multiRPC();
                    
                    message.edit(client.language(
                        `***Le nombre de joueurs du RPC a été modifié à ${current}/${max}***`,
                        `***The number of players in the RPC has been changed to ${current}/${max}***`
                    ));
                }
                break;
        }
    }
};