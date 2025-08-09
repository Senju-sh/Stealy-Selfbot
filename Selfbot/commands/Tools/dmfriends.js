const { Client, Message } = require("legend.js");
const data = {};

module.exports = {
    name: "dmfriends",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (data[client.user.id]) 
            return message.edit(client.language(
                "*Vous devez attendre la fin de votre dm all friends pour en commencer un nouveau.*",
                "*You must wait for the end of your first dm all friends for starting a new one.*"
            ));

        data[client.user.id] = true;

        if (!args[0])
            return message.edit(client.language(
                `*Veuillez entrer un message à envoyer.*`,
                `*Please enter a message to send at your friends.*`
            ))
        
        message.edit("***__› Stealy__*** <a:star:1345073135095123978>")
        message.delete().catch(() => false)

        for (const friend of client.user.friends.map(r => r)){
            try {
                await friend.send(args.join(' ')).catch(() => false);
                await client.sleep(25000);
            } catch { false }
        }

        delete data[client.user.id];
    }
}