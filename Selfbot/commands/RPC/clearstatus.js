const { Client, Message } = require('legend.js');

module.exports = {
    name: "clearstatus",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.edit(client.language(
            "*Le status a été supprimé.*", 
            "*The state has been deleted.*"
        ));

        client.db.spotify.status = false;
        client.db.setgame.status = false;
        client.db.custom.status = false;
        client.db.multi.status = false;
        client.db.clan.multi = false;
        client.db.rpc.status = false;
        
        client.save();
        client.multiRPC();
    }
}