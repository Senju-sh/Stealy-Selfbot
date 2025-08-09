const plateformes = ["desktop", "ps4", "ps5", "xbox", "samsung"];;
const rpc = require('../../../Structures/files/setgames.json');
const { Client, Message } = require('legend.js');

module.exports = {
    name: "setgame",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */    run: async (client, message, args) => {
        switch (true) {
            default: 
                message.edit(client.language(
                    `***__› Stealy - Games__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}setgame <on/off>\` › *Gerrer le rpc du jeu.*
                    \`${client.db.prefix}setgame platform <desktop/ps4/ps5/xbox/samsung>\` › *Choisir une platform pour le rpc du jeu.*
                    \`${client.db.prefix}setgame clear\` › *Supprime le rpc du jeu.*

                    \`${client.db.prefix}setgame acs\` › *Assasin's Creed Shadows.*
                    \`${client.db.prefix}setgame osu\` › *Osu!.*
                    \`${client.db.prefix}setgame cs2\` › *Counter Strike 2.*
                    \`${client.db.prefix}setgame destiny\` › *Destiny2.*
                    \`${client.db.prefix}setgame minecraft\` › *Minecraft.*
                    \`${client.db.prefix}setgame cod\` › *Warzone.*
                    \`${client.db.prefix}setgame gtav\` › *GTA V.*
                    \`${client.db.prefix}setgame gtavi\` › *GTA VI.*
                    \`${client.db.prefix}setgame ow\` › *OverWatch 2.*
                    \`${client.db.prefix}setgame r6\` › *Rainbow Six Siege.*
                    \`${client.db.prefix}setgame s4\` › *The Sims 4.*
                    \`${client.db.prefix}setgame lol\` › *League of Legends.*
                    \`${client.db.prefix}setgame valorant\` › *Valorant.*
                    \`${client.db.prefix}setgame rl\` › *Rocket League.*
                    \`${client.db.prefix}setgame fallguys\` › *Fall Guys.*
                    \`${client.db.prefix}setgame rdr2\` › *Red Dead Redemption 2.*
                    \`${client.db.prefix}setgame apex\` › *Apex Legends.*
                    \`${client.db.prefix}setgame fortnite\` › *Fortnite.*
                    \`${client.db.prefix}setgame resident\` › *Resident Evil Village.*
                    \`${client.db.prefix}setgame fifa24\` › *FC 24.*
                    \`${client.db.prefix}setgame rbx\` › *Roblox.*`.replaceAll('  ', ''),
                    `***__› Stealy - Games__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}setgame <on/off>\` › *Control the game rpc.*
                    \`${client.db.prefix}setgame platform <desktop/ps4/ps5/xbox>\` › *Choose a platform for the game rpc.*
                    \`${client.db.prefix}setgame clear\` › *Remove the game rpc.*

                    \`${client.db.prefix}setgame acs\` › *Assasin's Creed Shadows.*
                    \`${client.db.prefix}setgame osu\` › *Osu!.*
                    \`${client.db.prefix}setgame cs2\` › *Counter Strike 2.*
                    \`${client.db.prefix}setgame destiny\` › *Destiny2.*
                    \`${client.db.prefix}setgame minecraft\` › *Minecraft.*
                    \`${client.db.prefix}setgame cod\` › *Warzone.*
                    \`${client.db.prefix}setgame gtav\` › *GTA V.*
                    \`${client.db.prefix}setgame gtavi\` › *GTA VI.*
                    \`${client.db.prefix}setgame ow\` › *OverWatch 2.*
                    \`${client.db.prefix}setgame r6\` › *Rainbow Six Siege.*
                    \`${client.db.prefix}setgame s4\` › *The Sims 4.*
                    \`${client.db.prefix}setgame goy\` › *Ghost of Yōtei.*
                    \`${client.db.prefix}setgame lol\` › *League of Legends.*
                    \`${client.db.prefix}setgame valorant\` › *Valorant.*
                    \`${client.db.prefix}setgame rl\` › *Rocket League.*
                    \`${client.db.prefix}setgame fallguys\` › *Fall Guys.*
                    \`${client.db.prefix}setgame rdr2\` › *Red Dead Redemption 2.*
                    \`${client.db.prefix}setgame apex\` › *Apex Legends.*
                    \`${client.db.prefix}setgame fortnite\` › *Fortnite.*
                    \`${client.db.prefix}setgame resident\` › *Resident Evil Village.*
                    \`${client.db.prefix}setgame fifa24\` › *FC 24.*
                    \`${client.db.prefix}setgame rbx\` › *Roblox.*`.replaceAll('  ', '')
                ));
                break;

            case Object.keys(rpc).includes(args[0]):
                Object.entries(rpc[args[0]]).forEach(([key, value]) => {
                    if (typeof value == 'string' && key == 'platform') rpc[args[0]][key] = client.db.setgame.platform ?? "desktop";
                });

                rpc[args[0]].status = client.db.setgame.status;
                client.db.setgame = rpc[args[0]];

                client.save();
                client.multiRPC();
                message.edit(client.language(
                    `*Le status du RPC a été modifié et tu es sur ${rpc[args[0]].name}.*`,
                    `*The state of the RPC has been edited and you are on ${rpc[args[0]].name}.*`
                ));
                break;

            case args[0] == 'platform':
                if (!plateformes.includes(args[1]))
                    return message.edit(client.language(
                        `*Veuillez choisir une de ses platformes: ${plateformes.map(r => `\`${r}\``).join(', ')}.*`,
                        `*Please choose one of these platform: ${plateformes.map(r => `\`${r}\``).join(', ')}.*`
                    ));

                message.edit(client.language(
                    `*La platforme a été modifiée.*`,
                    `*The platform has been edited.*`
                ));
                
                client.db.setgame.platform = args[1];
                client.save();
                client.multiRPC();
                break;

            case args[0] == "on":
                client.db.setgame.status = true;
                client.save();

                message.edit(client.language(
                    "*Le rpc a été activé.*",
                    "*The rpc has been enabled.*"
                ));
                break;

            case args[0] == "off":
                client.db.setgame.status = false;
                client.save();

                message.edit(client.language(
                    "*Le rpc a été désactivé.*", 
                    "*The rpc has been disabled.*"
                ));
                break;
        }
    },
};
