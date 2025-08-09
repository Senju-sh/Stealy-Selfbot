const { Client, Message } = require('legend.js');

module.exports = {
    name: "setdesc",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!args[0]){
            client.db.description = null;
            client.save();
            return message.edit(client.language(
                `*La description a été supprimée.*`,
                `*The description has been deleted.*`
            ));
        }
        else {
            client.db.description = args.join(' ');
            client.save();
            return message.edit(client.language(
                `*La description a été modifiée.*`,
                `*The description has been edited.*`
            ));
        }
    }
}