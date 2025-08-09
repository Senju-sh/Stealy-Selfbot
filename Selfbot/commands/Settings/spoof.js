const { Client, Message } = require('legend.js');
const infos = {
    "web"    : { os: "Other",   browser: "Discord Web" },
    "mobile": { os: "Android", browser: "Discord Android" },
    "desktop": { os: "Linux",   browser: "Discord Client" },
    "console": { os: "Windows", browser: "Discord Embedded"}
}

module.exports = {
    name: "spoof",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!args[0] || !Object.keys(infos).includes(args[0]))
            return message.edit(client.language(
                `*Veuillez choisir l'une de ses options: ${Object.keys(infos).map(r => `\`${r}\``).join(', ')}.*`,
                `*Please choose one of these options: ${Object.keys(infos).map(r => `\`${r}\``).join(', ')}.*`
            ));

        client.options.ws.properties.os      = infos[args[0]].os
        client.options.ws.properties.browser = infos[args[0]].browser

        message.edit(client.language(
            `*Changement de la plateforme en cours...*`,
            `*Editing the platform...*`
        ));

        const token = client.token
        client.destroy()
        await client.login(token)

        client.db.deevice = args[0]
        client.save()

        message.edit(client.language(
            `*La plateforme est maintenant \`${args[0]}\`.*`,
            `*The plateform is now \`${args[0]}\`.*`
        ));
    }
}