const { Client, Message } = require('legend.js');

module.exports = {
    name: "notif",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        switch(args[0]){
            case "on":
                client.user.setAFK(false)
                client.db.set_afk = false;
                client.save();
                message.edit(client.language(
                    `*Vous allez recevoir vos notifications*`,
                    `*You're gonna have your notifications*`
                ));
                break

            case "off":
                client.user.setAFK(true);
                client.db.set_afk = true;
                client.save();
                message.edit(client.language(
                    `*Vous n'allez plus recevoir vos notifications*`, 
                    `*You're not gonna have anymore your notifications*`
                ));
                break
        }
    }
}