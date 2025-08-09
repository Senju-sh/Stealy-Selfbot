const { Client, Message } = require('legend.js');

module.exports = {
    name: "mod",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message) => {
        message.edit(client.language(
            `***___› Stealy - Moderation___*** <a:star:1345073135095123978>
            -# *Only usable on servers.*

            \`${client.db.prefix}lock\` › *Verrouiller le salon.*
            \`${client.db.prefix}unlock\` › *Déverrouiller le salon.*
            \`${client.db.prefix}renew\` › *Créer un nouveau salon.*

            \`${client.db.prefix}clearperms\` › *Désactiver toutes les permissions dangereuses sur le serveur.*
            \`${client.db.prefix}clearperms bot\` › *Désactiver toutes les permissions dangereuses sur les bots.*

            \`${client.db.prefix}mute <id/mention> <raison>\` › *Mute un membre.*
            \`${client.db.prefix}unmute <id/mention> <raison>\` › *Démuter un membre.*

            \`${client.db.prefix}ban <id/mention> <raison>\` › *Bannir un membre.*
            \`${client.db.prefix}unban <id/mention> <raison>\` › *Débannir un membre.*
            \`${client.db.prefix}kick <id/mention> <raison>\` › *Expulser un membre.*`.replaceAll('  ', ''),

            `***___› Stealy - Moderation___*** <a:star:1345073135095123978>
            -# *Only usable on servers.*

            \`${client.db.prefix}lock <channel>\` › *Lock one channel.*
            \`${client.db.prefix}unlock <channel>\` › *Unlock one channel.*
            \`${client.db.prefix}renew <channel>\` › *Create a new channel.*

            \`${client.db.prefix}clearperms\` › *Disable all dangerous permissions on the server.*
            \`${client.db.prefix}clearperms bot\` › *Disable all dangerous permissions on the bots.*

            \`${client.db.prefix}mute <id/mention> <reason>\` › *Mute a member.*
            \`${client.db.prefix}unmute <id/mention> <reason>\` › *Unmute a member.*

            \`${client.db.prefix}ban <id/mention> <reason>\` › *Ban a member.*
            \`${client.db.prefix}unban <id/mention> <reason>\` › *Unban a member.*
            \`${client.db.prefix}kick <id/mention> <reason>\` › *Kick a member.*`.replaceAll('  ', '')
        ));
    }
}
