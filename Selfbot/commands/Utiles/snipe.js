const { Client, Message } = require("legend.js")

module.exports = {
    name: "snipe",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const sniped_messages = client.snipes.get(message.channel.id)?.reverse();
        
        if (!sniped_messages) 
            return message.edit(client.language(
                "*Aucun message d'enregistré.*",
                "*No message saved.*"
            ));

        const number = Number(parseInt(args[0])) && args[0] >= 1 ? args[0] : 1;
        
        const snipe = sniped_messages[number - 1];
        if (!snipe) 
            return message.edit(client.language(
            `*Aucun message Trouvé.*`, 
            `*No message found.*`
        ));

        message.edit(client.language(
            `> ***Auteur :*** ${snipe.author}
            > ***Message :*** ${snipe.content}
            > ***Image :*** ${snipe.image ? `[\`Lien de l'image\`](${snipe.image})` : "\`Aucune Image\`"}
            > ***Date :*** <t:${parseInt(snipe.date / 1000, 10)}:R>
            > ***Page :*** \`${number}/${client.snipes.get(message.channel.id).length}\``,
            
            `> ***Author :*** ${snipe.author}
            > ***Content :*** ${snipe.content}
            > ***Image :*** ${snipe.image ? `[\`Image link\`](${snipe.image})` : "\`No Image\`"}
            > ***Date :*** <t:${parseInt(snipe.date / 1000, 10)}:R>
            > ***Page :*** \`${number}/${client.snipes.get(message.channel.id).length}\``));
    }
}