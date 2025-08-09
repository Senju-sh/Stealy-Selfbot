const { Client, Message } = require("legend.js")

module.exports = {
    name: "clean",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message) => {

        message.edit(client.language(
            `***___› Stealy - Clean___*** <a:star:1345073135095123978>

            \`${client.db.prefix}clear <all/number/channel>\` › *Supprimer des messages dans les salons voulus.*  
            \`${client.db.prefix}closedms\` › *Ferme les DM's.*

            \`${client.db.prefix}leave server <server_id/all>\` › *Quitte un / all serveur.*  
            \`${client.db.prefix}leave groups <channel/all>\` › *Fermer un / all groupes.*

            \`${client.db.prefix}leave <group/server> <wl/unwl/clear> <channel>\` › *Permet d'ajouter/supprimer un salon/server a la wl.*  
            \`${client.db.prefix}leave <server/group> list\` › *Permet de voir les groupes/serveurs dans la wl.*`.replaceAll('  ', ''),

            `***___› Stealy - Clean___*** <a:star:1345073135095123978>

            \`${client.db.prefix}clear <number/channel>\` › *Delete a number of messages requested.*  
            \`${client.db.prefix}closedms\` › *Close DM's.*

            \`${client.db.prefix}leave server <server_id/all>\` › *Leave an / all server.*  
            \`${client.db.prefix}leave groups <channel/all>\` › *Close an / all groups.*

            \`${client.db.prefix}leave <server/group> <wl/unwl/clear> <channel>\` › *Allows you to add/remove a channel/server to the wl.*  
            \`${client.db.prefix}leave <server/group> list\` › *Allows you to see the groups/servers in the wl.*`.replaceAll('  ', '')
        ));
    }
};