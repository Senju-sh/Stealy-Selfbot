const { Client, Message } = require('legend.js');
const rpc = require('../../../Structures/files/rpcs.json');

module.exports = {
    name: "setrpc",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        switch(true){
            default:
                message.edit(client.language(`***__› Stealy - RPC__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}rpc <on/off>\` *› Active ou désactive le RPC.*
                    \`${client.db.prefix}setrpc clear\` *› Supprime le RPC.*
                        
                    \`${client.db.prefix}setrpc js\` *› JavaScript RPC.*
                    \`${client.db.prefix}setrpc python\` *› Python RPC.*
                    \`${client.db.prefix}setrpc cpp\` *› C++ RPC.*
                    \`${client.db.prefix}setrpc twitch\` *› Twitch RPC.*
                    \`${client.db.prefix}setrpc tiktok <text>\` *› TikTok RPC.*
                    \`${client.db.prefix}setrpc youtube <text>\` *› YouTube RPC.*
                    \`${client.db.prefix}setrpc netflix <text>\` *› Netflix RPC.*
                    \`${client.db.prefix}setrpc ph <text>\` *› Pornhub RPC.*
                    \`${client.db.prefix}setrpc disney+ <text>\` *› Disney + RPC.*
                    \`${client.db.prefix}setrpc ubereats <text>\` *› Uber Eats RPC.*
                    \`${client.db.prefix}setrpc photoshop <text>\` *› Photoshop RPC.*
                    \`${client.db.prefix}setrpc kali <text>\` *› Kali Linux RPC.*`.replaceAll("  ", ""),
                    `***__› Stealy - RPC__*** <a:star:1345073135095123978>
                    
                    \`${client.db.prefix}rpc <on/off>\` *› Enable of disable le RPC.*
                    \`${client.db.prefix}setrpc clear\` *› Delete RPC.*

                    \`${client.db.prefix}setrpc js\` *› JavaScript RPC.*
                    \`${client.db.prefix}setrpc python\` *› Python RPC.*
                    \`${client.db.prefix}setrpc cpp\` *› C++ RPC.*
                    \`${client.db.prefix}setrpc twitch\` *› Twitch RPC.*
                    \`${client.db.prefix}setrpc tiktok <text>\` *› TikTok RPC.*
                    \`${client.db.prefix}setrpc youtube <text>\` *› YouTube RPC.*
                    \`${client.db.prefix}setrpc netflix <text>\` *› Netflix RPC.*
                    \`${client.db.prefix}setrpc ph <text>\` *› Pornhub RPC.*
                    \`${client.db.prefix}setrpc disney+ <text>\` *› Disney + RPC.*
                    \`${client.db.prefix}setrpc ubereats <text>\` *› Uber Eats RPC.*
                    \`${client.db.prefix}setrpc photoshop <text>\` *› Photoshop RPC.*
                    \`${client.db.prefix}setrpc kali <text>\` *› Kali Linux RPC.*`.replaceAll("  ", "")));
                break;

            case "clear":
                client.db.rpc.status = false;

                client.save();
                client.multiRPC();
                message.edit(client.language(
                    "Le RPC a été supprimé",
                    "The RPC has been deleted"
                ));
                break;

            case Object.keys(rpc).includes(args[0]):
                Object.entries(rpc[args[0]]).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        rpc[args[0]][key] = value.replace('{args}', args.slice(1).join(' ') || 'Stealy');
                    }
                
                    if (typeof value === 'object' && value !== null) {
                        if (key === "timestamps" && "start" in value) {
                            rpc[args[0]][key].start = Date.now();
                        }
                    }
                });
                
                rpc[args[0]].status = client.db.rpc.status;
                client.db.rpc = rpc[args[0]];
                
                client.save();
                client.multiRPC();

                message.edit(client.language(
                    `*Le status du RPC a été modifié et tu ${getType(rpc[args[0]].type)[0]} ${args.slice(1).join(' ') || 'Stealy'} sur ${rpc[args[0]].name}.*`, 
                    `*The state of the RPC has been edited and you ${getType(rpc[args[0]].type)[1]} ${args.slice(1).join(' ') || 'Stealy'} on ${rpc[args[0]].name}.*`
                ));
                break;
        }
    }
}

/**
 * @param {string} type
 * @returns {Array<string>}
*/
function getType(type){
    switch(type){
        case 0: return [ "Joue à", "Playing" ];
        case 1: return [ "Stream", "Streaming" ];
        case 2: return [ "Ecoute", "Listening" ];
        case 3: return [ "Regarde", "Watching" ];
        case 5: return [ "Participe à", "Competing" ];
    }
}