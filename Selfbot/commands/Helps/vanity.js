const { Client, Message } = require('legend.js');

module.exports = {
    name: "vanity",
    owner: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message) => {        
        message.edit(client.language(
            `***___› Stealy - Vanity___*** <a:star:1345073135095123978>

            \`${client.db.prefix}url list\` › *Affiche la liste des urls à sniper.*
            \`${client.db.prefix}url clear\` › *Permet de supprimer la totaliter de la list des urls sniper.*

            \`${client.db.prefix}url <server_id>\` › *Permet de sniper une url.*
            \`${client.db.prefix}url stop <server_id>\` › *Permet d'arrêter de snipe une url.*

            \`${client.db.prefix}lockurl list\` › *Affiche la liste des urls lock.*
            \`${client.db.prefix}lockurl clear\` › *Permet de supprimer la totalité de la liste des lockurl.*

            \`${client.db.prefix}lockurl <server_id>\` › *Permet de vérouiller une url.*
            \`${client.db.prefix}lockurl stop <server_id>\` › *Permet de déverouiller une url.*`.replaceAll('  ', ''),

            `***___› Stealy - Vanity___*** <a:star:1345073135095123978>

            \`${client.db.prefix}url list\` › *Displays the list of sniper URLS.*
            \`${client.db.prefix}url clear\` › *Clears the entire sniper URLs list.*

            \`${client.db.prefix}url <server_id>\` › *Starts sniping a URL.*
            \`${client.db.prefix}url stop <server_id>\` › *Stops sniping a URL.*

            \`${client.db.prefix}lockurl list\` › *Displays the list of lock urls.*
            \`${client.db.prefix}lockurl clear\` › *Deletes the entire lockurl list.*

            \`${client.db.prefix}lockurl <server_id>\` › *Locks a url.*
            \`${client.db.prefix}lockurl stop <server_id>\` › *Unlock a url.*`
        ))
    }
}