const { Client, Message } = require("legend.js")

module.exports = {
    name: "raid",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message) => {

        message.edit(client.language(
            `***___› Stealy - Raid___*** <a:star:1345073135095123978>

            \`${client.db.prefix}surprise\` › *Banni tous les membres d'un serveur.*  
            \`${client.db.prefix}pupuce\` › *Expulse tous les membres d'un serveur.*

            \`${client.db.prefix}delc\` › *Supprime tous les salons d'un serveur.*
            \`${client.db.prefix}delr\` › *Supprime tous les rôles d'un serveur.*

            \`${client.db.prefix}fuck\` › *Supprime tout le serveur.*
            \`${client.db.prefix}crash\` › *Déplace les rôles d'un serveur et le faisant crash.*
            
            \`${client.db.prefix}token\` › *Récupère une partie du token d'un utilisateur.*
            \`${client.db.prefix}spam <number> <text>\` › *Spam un nombre de messages dans un salon.*`.replaceAll('  ', ''),

            `***___› Stealy - Raid___*** <a:star:1345073135095123978>

            \`${client.db.prefix}surprise\` › *Ban every members of a server.*  
            \`${client.db.prefix}pupuce\` › *Kick every members of a server.*

            \`${client.db.prefix}delc\` › *Delete all channels of a server.*
            \`${client.db.prefix}delr\` › *Delete all roles of a server.*

            \`${client.db.prefix}fuck\` › *Delete a whole server.*
            \`${client.db.prefix}crash\` › *Move every roles of a server to crash it.*
            
            \`${client.db.prefix}token\` › *Get a part of a user token.*
            \`${client.db.prefix}spam <number> <text>\` › *Spam a number of messages in a channel.*`.replaceAll('  ', ''),
        ));
    }
};