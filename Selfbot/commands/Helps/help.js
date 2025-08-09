const { Client, Message } = require('legend.js');

module.exports = {
    name: "help",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message) => {

        message.edit(client.language(
            `***___› Stealy ___*** <a:star:1345073135095123978>
            ${client.replace(client.db.description) ?? "-# *La guerre ne détermine pas ce qui est bon ou ce qui est mauvais.*"}

            \`${client.db.prefix}stealy\` › *Affiche vos infos système.*
            \`${client.db.prefix}clean\` › *Affiche le menu de nettoyage.*
            \`${client.db.prefix}settings\` › *Commandes de paramètres.*

            \`${client.db.prefix}status\` › *Commandes de status.*
            \`${client.db.prefix}multi\` › *Commandes multi.*
            \`${client.db.prefix}utils\` › *Commandes d'utilitaire.*

            \`${client.db.prefix}vanity\` › *Commandes pour les vanity.*
            \`${client.db.prefix}mod\` › *Commandes de modération.*
            \`${client.db.prefix}fun\` › *Commandes de fun.*

            \`${client.db.prefix}backup\` › *Commande de backup.*
            \`${client.db.prefix}voice\` › *Commandes vocal.*
            \`${client.db.prefix}group\` › *Commandes groupes.*`.replaceAll('  ', ''),
            
            `***___› Stealy ___*** <a:star:1345073135095123978>
            ${client.replace(client.db.description) ?? "-# *War does not determine who is good or what is bad*"}

            \`${client.db.prefix}stealy\` › *Displays your system information.*
            \`${client.db.prefix}clean\` › *Displays the cleaning menu.*
            \`${client.db.prefix}settings\` › *Settings commands.*

            \`${client.db.prefix}status\` › *Status commands.*
            \`${client.db.prefix}multi\` › *Multi commands.*
            \`${client.db.prefix}utils\` › *Utility commands.*

            \`${client.db.prefix}vanity\` › *Vanity commands.*
            \`${client.db.prefix}mod\` › *Moderation commands.*
            \`${client.db.prefix}fun\` › *Fun commands.*

            \`${client.db.prefix}backup\` › *Backup command.*
            \`${client.db.prefix}voice\` › *Voice commands.* 
            \`${client.db.prefix}group\` › *Group commands.*`.replaceAll('  ', '')
        ))
    }
}