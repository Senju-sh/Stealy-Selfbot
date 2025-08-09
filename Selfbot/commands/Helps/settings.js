const { Client, Message } = require('legend.js');

module.exports = {
    name: "settings",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message) => {
        message.edit(client.language(
            `***___› Stealy - Settings___*** <a:star:1345073135095123978>

            \`${client.db.prefix}restart\` › *Redémarre stealy*
            \`${client.db.prefix}notif <on/off>\` › *Gérer les notifications*

            \`${client.db.prefix}setprefix <prefix>\` › *Défini un nouveau préfix*
            \`${client.db.prefix}twitchurl <text>\` › *Défini le pseudo twitch*

            \`${client.db.prefix}nitrosniper <on/off>\` › *Activer / désactiver le sniper nitro*
            \`${client.db.prefix}clan\` › *Affiche le menu des clans*
            
            \`${client.db.prefix}vip <code>\` › *Claim une clé VIP*
            \`${client.db.prefix}logs\` › *Affiche le panel des logs*

            \`${client.db.prefix}muteall\` › *Mute tous vos serveurs*
            \`${client.db.prefix}unmuteall\` › *Unmute tous vos serveurs*

            \`${client.db.prefix}spoof <mobile/desktop/console/web/android>\` › *Spoof la plateforme de Stealy*
            \`${client.db.prefix}setlang <fr/en>\` › *Changer la langue du bot*`.replaceAll('  ', ''),

            `***___› Stealy - Settings___*** <a:star:1345073135095123978>

            \`${client.db.prefix}restart\` › *Restart Stealy*
            \`${client.db.prefix}notif <on/off>\` › *Manage notifications*

            \`${client.db.prefix}setprefix <prefix>\` › *Define a new prefix*
            \`${client.db.prefix}twitchurl <text>\` › *Define the twitch username*

            \`${client.db.prefix}nitrosniper <on/off>\` › *Activate / deactivate nitro sniper*
            \`${client.db.prefix}setlang <fr/en>\` › *Change the language of the bot*

            \`${client.db.prefix}vip <code>\` › *Claim a VIP key*
            \`${client.db.prefix}logs\` › *Display the logs panel*

            \`${client.db.prefix}muteall\` › *Mute all your serveurs*
            \`${client.db.prefix}unmuteall\` › *Unmute all your serveurs*

            \`${client.db.prefix}clan\` › *Display the clan menu*
            \`${client.db.prefix}spoof <mobile/desktop/console/web/android>\` › *Spoof the platform of Stealy*`.replaceAll('  ', '')
        ))
    }
}