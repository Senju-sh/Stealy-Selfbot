const { Client, Message } = require("legend.js");

module.exports = {
    name: "hype",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        switch (args[0]) {
            default:
                message.edit(client.language(
                    `***__Stealy - Hypesquad__*** <a:star:1345073135095123978>
                    \`${client.db.prefix}hype clear\` › *Supprimer votre badge hypesquad.*
                    \`${client.db.prefix}hype balance\` › *Avoir le badge balance de la hypesquad.*
                    \`${client.db.prefix}hype bravery\` › *Avoir le badge bravery de la hypesquad.*
                    \`${client.db.prefix}hype brillance\` › *Avoir le badge brillance de la hypesquad.*`.replaceAll('  ', ''),
                    
                    `***__Stealy - Hypesquad__*** <a:star:1345073135095123978>
                    \`${client.db.prefix}hype clear\` › *Delete your hypesquad badge.*
                    \`${client.db.prefix}hype balance\` › *Get the hypesquad balance badge.*
                    \`${client.db.prefix}hype bravery\` › *Get the hypesquad bravery badge.*
                    \`${client.db.prefix}hype brillance\` › *Get the hypesquad brilliance badge.*`.replaceAll('  ', '')
                ));
                break;
            
            case "clear":
                client.user.removeHypesquadHouse()
                    .then(() => message.edit(client.language(`*Votre hypesquad a été supprimée.*`, `*Your hypesquad has been deleted.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être supprimée.*`, `*Your hypesquad cannot be deleted.*`)))
                break;
        
            case "bravery":
                client.user.setHypesquadHouse('bravery')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
    
            case "brillance":
                client.user.setHypesquadHouse('brillance')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
            
            case "balance":
                client.user.setHypesquadHouse('balance')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
        }
    }
}