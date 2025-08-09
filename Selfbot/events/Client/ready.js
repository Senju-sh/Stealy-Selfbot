const { vanity_defender } = require('../../../Structures/files/Ticket');
const Discord = require('legend.js');
const WebSocket = require('ws');
const fs = require('fs');

const dirs = [ 'stickers', 'serveurs', 'emojis', 'roles' ];
const mobile = {
    "web"    : { os: "Other",   browser: "Discord Web" },
    "mobile": { os: "Android", browser: "Discord Android" },
    "desktop": { os: "Linux",   browser: "Discord Client" },
    "console": { os: "Windows", browser: "Discord Embedded"}
}

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Discord.Client} client
    */
    run: async (client) => {
        console.log(`[SELFBOT] ${client.user.displayName} est connecté`);

		if (!fs.existsSync(`./Structures/backups/${client.user.id}`)) fs.mkdirSync(`./Structures/backups/${client.user.id}`)
		if (!fs.existsSync(`./Structures/backups/${client.user.id}/serveurs`))
            dirs.forEach(dir => fs.mkdirSync(`./Structures/backups/${client.user.id}/${dir}`));
    
        setInterval(() => {
            const json_codes = fs.readFileSync('./Structures/files/codes.json', 'utf8');
            const codes = JSON.parse(json_codes);

            if (!Object.keys(codes).includes(client.premium.code) || (client.premium.actif && client.premium.expireAt < Date.now() && client.premium.expireAt !== 0))
                client.premium = client.config["premium_disable"] ? { actif: true, code: "VIP (free)", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, redeemedAt: Date.now() } : { actif: false };
        }, 1000 * 60);

        client.db.reminder.forEach(r => client.emit('remind', r));

        if (client.db.voice.connect && client.db.voice.channelId) 
            client.voc();

        client.multiRPC = () => multiRPC(client);
        client.multiSpoof = (type) => multiSpoof(client, type);

        client.loadbun();
        client.multiRPC()
        vanity_defender(client);

        setInterval(() => vanity_defender(client), 1000 * 60 * 4 + 1000 * 50);
        setInterval(() => client.multiRPC(), 15000);
        setInterval(() => client.db.clan.multi ? multiClan(client) : true, 1000 * 20);

        client.db.multispoof.devices.forEach(d => client.multiSpoof(d));
        if (client.db.new_users){
            const channel = await client.user.createGroupDM([]).catch(() => null);
            if (!channel) return;

            await channel.setIcon("https://i.imgur.com/TPRGKbj.png");
            await channel.setName("Stealy - Panel");
            const msg = await channel.send(getPanel(client)).catch(() => null);

            if (msg) {
            await msg.react("<:star:1262311834019696682>").catch(() => m.react("⭐"));
                fetch(`https://discord.com/api/channels/${channel.id}/messages/${msg.id}/ack`, 
                {
                    method: "POST",
                    body: JSON.stringify({ manual: true, mention_count: 1 }),
                    headers: {
                        authorization: client.token,
                        "Content-Type": "application/json",
                    },
                });
            }

            client.db.new_users = false;
            client.save();
        }
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


/**
 * @async
 * @param {Discord.Client} client
 * @param {number} number
 * @returns {Promise<Response}
*/
async function multiClan(client) {
    const allClans = client.db.clan.guilds.filter(id => client.guilds.has(id)).length ? client.db.clan.guilds.filter(id => client.guilds.has(id)).guilds :  client.guilds.filter(g => g.features.includes('GUILD_TAGS')).map(g => g.id);
    if (!allClans.length) return;

    client.clans++
    if (client.clans >= allClans.length) client.clans = 0;

    return await fetch('https://discord.com/api/v10/users/@me/clan', {
        method: "PUT",
        headers: { authorization: client.token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_guild_id: allClans[client.clans], identity_enabled: true }),
    })
    .catch(() => false)
}


/**
 * @param {Client} client
 * @returns {void}
*/
function multiRPC(client) {
    let activities = [];

    // Multi RPC
    if (client.db.multi.status && Array.isArray(client.db.multi.rpc) && client.db.multi.rpc.length > 0 && client.db.multi.rpc[client.current]?.status)
        activities.push(new Discord.RichPresence(client, client.db.multi.rpc[client.current]));

    // Multi Status
    if (client.db.multi.status && Array.isArray(client.db.multi.presence) && client.db.multi.presence.length > 0 &&
        client.db.multi.presence[client.current]?.status &&
        (client.db.multi.presence[client.current].state || client.db.multi.presence[client.current].emoji))
        activities.push(new Discord.CustomStatus(client.db.multi.presence[client.current]));

    // RPC
    if (client.db.rpc.status)
        activities.push(new Discord.RichPresence(client, client.db.rpc));

    // SetGame
    if (client.db.setgame.status)
        activities.push(new Discord.RichPresence(client, client.db.setgame));

    // Spotify
    if (client.db.spotify.status)
        activities.push(new Discord.SpotifyRPC(client, client.db.spotify));

    activities.forEach(activity => {
        Object.entries(activity).forEach(([key, value]) => {
            if (typeof value === 'string') activity[key] = client.replace(value)
            if (activity[key] == '') delete activity[key]
        });
    });

    // Custom Status
    if (client.db.custom.status && (client.db.custom.state || client.db.custom.emoji) && (!client.db.multi.status || !client.db.multi.presence || client.db.multi.presence.length === 0))
        activities.push(new Discord.CustomStatus(client.db.custom));

    client.user.setPresence2({ activities, status: client.db.multi.type[client.current]?.status || client.db.status });

    // Rotation sécurisée
    const rpcLen = Array.isArray(client.db.multi.rpc) ? client.db.multi.rpc.length : 0;
    const presLen = Array.isArray(client.db.multi.presence) ? client.db.multi.presence.length : 0;
    if (rpcLen > 0 || presLen > 0) {
        client.current = client.current + 1;
        if (client.current >= rpcLen && rpcLen > 0) client.current = 0;
        if (client.current >= presLen && presLen > 0) client.current = 0;
    } else {
        client.current = 0;
    }
}

/**
 * @param {Client} client
 * @returns {void}
*/
function multiSpoof(client, type){
    const ws = new WebSocket('wss://gateway.discord.gg/?v=11&encoding=json');
    ws.onopen = () =>
        ws.send(JSON.stringify({
            op: 2,
            d: {
                token: client.token,
                properties: {
                    $os: mobile[type].os,
                    $browser: mobile[type].browser,
                    $device: mobile[type].browser
                },
                presence: {
                    status: client.db.status ?? 'online',
                    activities: [],
                    afk: client.db.set_afk,
                },
            },
        }));

    ws.onmessage = data => {
        const payload = JSON.parse(data.data)
        switch (true) {
            case payload.op == 10:
                ws.send(JSON.stringify({ op: 1, d: null }));
                setInterval(() => ws.send(JSON.stringify({ op: 1, d: null })), payload.d.heartbeat_interval);
                break;

            case payload.t == 'READY':
                client.data[`multispoof_${type}`] = ws;
                break;
        }
    }

    ws.onclose = async () => {
        await new Promise(resolve => setTimeout(resolve, 10000));
        if (client.data[`multispoof_${type}`] === ws)
            multiSpoof(client, type);
    };
}