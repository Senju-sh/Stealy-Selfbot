const { Client, Message } = require('legend.js');

module.exports = {
    name: "ltc",
    /**
     * @param {Client} client
     * @param {Message} message
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default:
                if (!client.db.payment.ltc)
                    return message.edit(client.language(
                        `***___› Stealy - LTC___*** <a:star:1345073135095123978>

                        \`${client.db.prefix}ltc\` › *Envoie votre adresse LTC.*
                        \`${client.db.prefix}ltc set <adresse>\` › *Configure votre adresse LTC.*`.replaceAll('  ', ''),
                        `***___› Stealy - LTC___*** <a:star:1345073135095123978>

                        \`${client.db.prefix}ltc [nombre]\` › *Send your LTC adress.*
                        \`${client.db.prefix}ltc set <adress>\` › *Edit your LTC adress.*`.replaceAll('  ', '')
                    ))


                message.edit(`***___› Stealy - LTC___*** <a:star:1345073135095123978>\n> \`${client.db.payment.ltc}\``);
                break;

            case 'set':
                if (!args[1]){
                    client.db.payment.ltc = null;
                    client.save();

                    return message.edit(client.language(
                        `*Votre adresse LTC a été supprimé.*`,
                        `*Your LTC adress has been deleted.*`
                    ))
                }

                client.db.payment.ltc = args[1];
                client.save();

                message.edit(client.language(
                    `*Votre adresse LTC est maintenant \`${args[1]}\`.*`,
                    `*Your LTC adress is now \`${args[1]}\`.*`
                ));
                break;
        }
    }
};