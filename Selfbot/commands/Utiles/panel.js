const { Client, Message } = require("legend.js");

module.exports = {
    name: "panel",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message) => {
        message.edit("*Création..*");

        const channel = await client.user.createGroupDM([]);
        await channel.setIcon('https://i.imgur.com/TPRGKbj.png');
        await channel.setName('Stealy - Panel');

        const m = await channel.send(getPanel(client)).catch(() => false)
        await m.react("<a:star:1345073135095123978>").catch(() => m.react("⭐"))
        fetch(`https://discord.com/api/channels/${channel.id}/messages/${m.id}/ack`, { method: 'POST', body: JSON.stringify({ manual: true, mention_count: 1 }), headers: { authorization: client.token, 'Content-Type': 'application/json' } } ).catch(() => false);

        message.edit(client.language(
            `La panel a bien été crée: <#${channel.id}>`,
            `The pannel has been created: <#${channel.id}>`
        ));
    }
}

/**
 * @param {string} type
 * @returns {string}
*/
function getPanel(client)
{
    switch(client.db.language)
    {
        case 'fr':
            return `› *Bienvenue sur le panel **__Stealy__** <:star:1262311834019696682>*\n\n**Préfix :** \`${client.db.prefix}\`\n\n› *Ce panel se génère automatiquement à votre connexion et est exclusivement dédié à l’utilisation de Stealy.*\n\n› *L’exécution de commandes dans des salons publics est déconseillée. Même avec notre système de suppression automatique, d’autres utilisateurs pourraient vous signaler.*  \n\n› *En cas de problème ou de question, plusieurs solutions s’offrent à vous :*  \n- [**Contacter le support**](<https://discord.com/channels/${client.config.guild_id}/1262934215964627101>)\n- [**Demander de l’aide à la communauté**](<https://discord.com/channels/${client.config.guild_id}/1376282037693972571>)\n\n› *Vous pouvez également partager votre retour dans <#1262934215964627099> ou toute suggestion dans <#1396117912988815421>.* `;

        case 'en':
            return `› *Welcome to the panel **__Stealy__** <:star:1262311834019696682>*\n\n**Prefix :** \`${client.db.prefix}\`\n\n› *This panel is automatically generated at your connection and is specifically dedicated to the use of Stealy.*\n\n› *The execution of commands in public channels is discouraged. Even with our automatic deletion system, other users may report you.*\n\n› *In case of a problem or question, several solutions are available to you:*\n- [**Contact support**](<https://discord.com/channels/${client.config.guild_id}/1262934215964627101>)\n- [**Ask for help from the community**](<https://discord.com/channels/${client.config.guild_id}/1376282037693972571>)\n\n› *You can also share your feedback in <#1262934215964627099> or any suggestion in <#1396117912988815421>.*`;

    }
}