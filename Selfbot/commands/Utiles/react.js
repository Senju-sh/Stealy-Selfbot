const { Client, Message } = require("legend.js");

module.exports = {
    name: "react",
    premium: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {

        switch(args[0])
        {
            case 'list':
                message.edit(client.language(
                    `***__› Stealy - React__*** <a:star:1345073135095123978>
                    ${client.db.auto_react.length ? client.db.auto_react.map((r, i) => `\`${i+1}\` - <#${r.channelId}> › ${r.emoji}`).join('\n') : "*Aucune réaction automatique définie.*"}`,
                    `***__› Stealy - React__*** <a:star:1345073135095123978>
                    ${client.db.auto_react.length ? client.db.auto_react.map((r, i) => `\`${i+1}\` - <#${r.channelId}> › ${r.emoji}`).join('\n') : "*No auto reaction defined.*"}`
                ))
                break;

            case 'stop':
                if (isNaN(args[1]))
                    return message.edit(client.language(
                        "*Veuillez spécifier un ID de réaction valide.*",
                        "*Please specify a valid reaction ID.*"
                    ));

                if (client.db.auto_react.length > args[1])
                    return message.edit(client.language(
                        "*Aucune réaction automatique trouvée avec cet ID.*",
                        "*No auto reaction found with this ID.*"
                    ));

                client.db.auto_react.splice(Number(args[1]) - 1, 1);
                client.save();

                message.edit(client.language((
                    `*L'autoreact numéro \`${args[1]}\` a été supprimé.*`,
                    `*The autoreact \`${args[1]}\` has been deleted.*`
                )));
                break;

            default:
                const channel = message.mentions.channels.first() || client.channels.get(args[0])
                const emoji = args[1];

                if (!channel) return message.edit(client.language("*Aucun salon de trouvé.*", "*Channel not found.*"));

                client.db.auto_react.push({ emoji: args[1], channelId: channel.id });
                client.save()

                message.edit(client.language(`*Je réagirai désormais avec ${emoji} aux nouveaux messages dans ${channel}.*`, `I will now react with ${emoji} to new messages in ${channel}.*`));
                break;
        }
    }
};
