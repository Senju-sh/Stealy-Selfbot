const { Client, Message } = require("legend.js");

const emojis = {
    "EARLY_SUPPORTER": "<:early:1344487434926293023>",
    "BUGHUNTER_LEVEL_1": "<:bughunter1:1344488136486682694>",
    "BUGHUNTER_LEVEL_2": "<:bughunter2:1344488179763515487>",
    "DISCORD_EMPLOYEE": "<:staff:1344489297327427697>",
    "PARTNERED_SERVER_OWNER": "<:partenaire:1344489726635413604>",
    "HYPESQUAD_EVENTS": "<:hse:1344489807996387409>",
    "DISCORD_CERTIFIED_MODERATOR": "<:certifmod:1344492805355208795>",
    "ACTIVE_DEVELOPER": "<:active_developper:1344493188794290177>",
    "HOUSE_BALANCE": "<:balance:1344487598474924102>",
    "HOUSE_BRILLIANCE": "<:brillance:1344487726258589727>",
    "HOUSE_BRAVERY": "<:bravery:1344487838292377602>",
    "NITRO": "<:nitro:1344496217773572148>",
    "BOOSTER_1": "<:1m:1344499916965412864>",
    "BOOSTER_2": "<:2m:1344499918689140736>",
    "BOOSTER_3": "<:3m:1344499921939730433>",
    "BOOSTER_6": "<:6m:1344499923785351220>",
    "BOOSTER_9": "<:9m:1344499927140667505>",
    "BOOSTER_12": "<:12m:1344499928701079572>",
    "BOOSTER_15": "<:15m:1344499930684981348>",
    "BOOSTER_18": "<:18m:1344499937639006218>",
    "BOOSTER_24": "<:24m:1344499939345956915>"
};

module.exports = {
    name: "badges",
    /**
   * @param {Client} client
   * @param {Message} message
     * @param {string[]} args 
  */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
        const badges = user.flags?.toArray() || [];
        if (user.premiumType) badges.push("NITRO");
        let boostBadge = "";

        for (const guild of client.guilds.values())
        {
            const member = guild.members.get(user.id);
            if (member && member.premiumSince) {
                const month = Math.floor((Date.now() - member.premiumSince.getTime()) / (1000 * 60 * 60 * 24 * 30));
                const matchingBadge = Object.keys(emojis).filter(b => b.startsWith("BOOSTER_"))
                                      .reverse().find(b => month >= parseInt(b.split("_")[1]));
                
                if (matchingBadge && !boostBadge) boostBadge = matchingBadge;
            }

            if (boostBadge) badges.push(boostBadge);
        }
        
        const badgeList = badges.map(b => emojis[b] || null).filter(Boolean).join(" ") ?? client.language("Aucun badge", "No badge");
        message.edit(client.language(
            `***Badges de [${user.username}](https://discord.gg/stealy) ***\n${badgeList}`,
            `***Badges of [${user.username}](https://discord.gg/stealy) ***\n${badgeList}`
        ));
    }
};
