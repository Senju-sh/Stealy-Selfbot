const Discord = require("legend.js")

module.exports = {
    name: "spotify",
    premium: true,
    run: async (client, message, args) => {

        switch (args[0]) {
            default: return message.edit(client.language(`***___› Stealy - Spotify___*** <a:star:1345073135095123978>

\`${client.db.prefix}spotify <on/off>\` › *Permet d'activer ou desactiver la presence spotify.*
\`${client.db.prefix}spotify reset\` › *Permet de reset la présence spotify.*

\`${client.db.prefix}spotify largeimage [image_id]\` › *Permet de changer la grande image.*
\`${client.db.prefix}spotify smallimage [image_id]\` › *Permet de changer la petite image.*
                
\`${client.db.prefix}spotify state [text]\` › *Permet de changer le nom du son.*
\`${client.db.prefix}spotify details [text]\` › *Permet de changer les details du son.*
                
\`${client.db.prefix}spotify timestamp [number]\` › *Permet de changer le temps d'écoute.*
\`${client.db.prefix}spotify album [text]\` › *Permet de changer l'album.*
\`${client.db.prefix}spotify id <link>\` › *Permet de changer le lien du bouton.*`,
`***___› Stealy - Spotify___*** <a:star:1345073135095123978>

\`${client.db.prefix}spotify <on/off>\` › *Allow you to activate or deactivate the spotify presence.*
\`${client.db.prefix}spotify reset\` › *Allow you to reset the spotify presence.*

\`${client.db.prefix}spotify largeimage [image_id]\` › *Allow you to change the large image.*
\`${client.db.prefix}spotify smallimage [image_id]\` › *Allow you to change the small image.*

\`${client.db.prefix}spotify state [text]\` › *Allow you to change the name of the song.*
\`${client.db.prefix}spotify details [text]\` › *Allow you to change the details of the song.*

\`${client.db.prefix}spotify timestamp [number]\` › *Allow you to change the time of listening.*
\`${client.db.prefix}spotify album [text]\` › *Allow you to change the album.*
\`${client.db.prefix}spotify id <link>\` › *Allow you to change the button link*`))

            case "largeimage":
                if (!args[1]) {
                    message.edit(client.language("*La grande image du Spotify a été supprimée.*", "*The large image of the Spotify has been deleted*"));;
                    delete client.db.spotify.assets.large_image;

                    client.save();
                    client.multiRPC();
                }
                else {
                    const getExtendURL = await Discord.RichPresence.getExternal(client, client.db.rpc.application_id ?? "1352297034669101117", args[1].replace("http://", "https://"));

                    if (Array.isArray(getExtendURL) && getExtendURL.length > 0 && getExtendURL[0].external_asset_path) {
                        if (!client.db.spotify.assets) client.db.spotify.assets = {};
                        client.db.spotify.assets['large_image'] = 'mp:' + getExtendURL[0].external_asset_path;

                        client.save();
                        client.multiRPC();
                        message.edit(client.language("*La grande image du Spotify a été modifiée.*", "*The large image of the Spotify has been edited.*"));
                    }
                    else message.edit(client.language("*Erreur lors de l'obtention de l'URL étendue.*", "*Error obtaining the extended URL.*"));
                }
                break

            case "smallimage":
                if (!args[1]) {
                    message.edit(client.language("*La petite image du Spotify a été supprimée.*", "*The small image of the Spotify has been deleted*"));;
                    delete client.db.spotify.assets.small_image;

                    client.save();
                    client.multiRPC();
                }
                else {
                    const getExtendURL = await Discord.RichPresence.getExternal(client, client.db.rpc.application_id ?? "1352297034669101117", args[1].replace("http://", "https://"));

                    if (Array.isArray(getExtendURL) && getExtendURL.length > 0 && getExtendURL[0].external_asset_path) {
                        if (!client.db.spotify.assets) client.db.spotify.assets = {};
                        client.db.spotify.assets['small_image'] = 'mp:' + getExtendURL[0].external_asset_path;

                        client.save();
                        client.multiRPC();
                        message.edit(client.language("*La petite image du Spotify a été modifiée.*", "*The small image of the Spotify has been edited.*"));
                    }
                    else message.edit(client.language("*Erreur lors de l'obtention de l'URL étendue.*", "*Error obtaining the extended URL.*"));
                }
                break

            case "state":
                if (!args[1]) {
                    message.edit(client.language("*Les détails ont été supprimés.*", "*The states has been deleted.*"))
                    delete client.db.spotify.state;

                    client.save()
                    client.multiRPC();
                }
                else {
                    client.db.spotify.state = args.slice(1).join(' ');
                    client.save();

                    client.multiRPC();
                    message.edit(client.language("*Les détails a été mise à jour.*", "*Your states has been updated.*"))
                }
                break

            case 'id':
                if (args[1] && !args[1].startsWith('https://open.spotify.com/track/'))
                    return message.edit(client.language(`Veuillez envoyer un lien spotify comme ceci: \`https://open.spotify.com/track/4mLzkKIOllZqAEU3JHc10g\``, `Please give a spotify link like this: \`https://open.spotify.com/track/4mLzkKIOllZqAEU3JHc10g\``));

                if (!args[1]) client.db.spotify.sync_id = '1J03Vp93ybKIxfzYI4YJtL';
                else client.db.spotify.sync_id = args[1].includes('?si') ?
                    args[1].split('track/')[1].split('?si')[0] :
                    args[1].split('track/')[1];

                client.save();
                client.multiRPC();
                message.edit(client.language(`*Votre ID de musique spotify a été ${args[1] ? "modifiée" : "supprimée"}.*`, `*Your spotify song ID has been ${args[1] ? "edited" : "deleted"}.*`));
                break;

            case "timestamp":
                if (!args[1]) {
                    message.edit(client.language('*Le temps de votre RPC a été supprimé.*', '*The timestamp of your RPC has been deleted.*'));
                    delete client.db.spotify.timestamps;

                    client.save();
                    client.multiRPC();
                }
                else {
                    if (!args[1].includes('/') ||
                        args[1].split('/').length !== 3 ||
                        isNaN(args[1].split('/')[0]) ||
                        isNaN(args[1].split('/')[1]) ||
                        isNaN(args[1].split('/')[2]) ||
                        args[1].split('/')[0].length < 2 ||
                        args[1].split('/')[1].length !== 2 ||
                        args[1].split('/')[2].length !== 2)
                        return message.edit(client.language('*Veuillez respecter ce format: \`hh/mm/ss\` (\`00/13/37\`).*', '*Please respect this format: \`hh/mm/ss\` (\`00/13/37\`).*'));

                    client.db.spotify.timestamps = { start: Date.now() - (1000 * 60 * 60 * args[1].split('/')[0] + 1000 * 60 * args[1].split('/')[1] + 1000 * args[1].split('/')[2]), end: Date.now() }

                    client.save();
                    client.multiRPC();
                    message.edit(client.language("*Le temps a été modifié.*", "*The timestamp has been edited.*"))
                }
                break

            case "album":
                if (!args[1]) {
                    message.edit(client.language("*L'album a été supprimés.*", "*The album has been deleted.*"))
                    delete client.db.spotify.metadata.album_id;

                    client.save();
                    client.multiRPC();
                }
                else {
                    message.edit(client.language("*L'album a été mise à jour.*", "*The album has been updated.*"));
                    client.db.spotify.metadata.album_id = args.slice(1).join(' ');

                    client.save();
                    client.multiRPC();
                }
                break

            case "details":
                if (!args[1]) {
                    message.edit(client.language("*Les détails ont été supprimés.*", "*The details has been deleted.*"));
                    delete client.db.spotify.details;

                    client.save();
                    client.multiRPC();
                }
                else {
                    message.edit(client.language("*Les details ont été mise à jour.*", "*The details has been updated.*"))
                    client.db.spotify.details = args.slice(1).join(' ');

                    client.save();
                    client.multiRPC();
                }
                break

            case "on":
                if (client.db.spotify.status) return message.edit(client.language("*Le rpc est déjà activé.*", "*The rpc is already activated.*"));
                client.db.spotify.status = true;

                client.save();
                client.multiRPC();
                message.edit(client.language("*Le rpc a été activé.*", "*The rpx has been activated.*"));
                break

            case "off":
                if (!client.db.spotify.status) return message.edit(client.language("*Le rpc est déjà désactivé.*", "*The rpc is already disabled.*"));
                client.db.spotify.status = false

                client.save();
                client.multiRPC();
                message.edit(client.language("*Le rpc a été désactivé.*", "*The rpx has been disabled.*"));
                break
        }
    }
}