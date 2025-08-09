const { parentPort, workerData } = require('worker_threads');
const { performance } = require('perf_hooks');
const codes = require('./codes.json');
const handler = require('./Handlers.js');
const Selfbot = require('legend.js');
const fs = require('fs');
const os = require('os');

const db = workerData.database || {};
const userId = Buffer.from(workerData.token.split('.')[0], "base64").toString();

const client = new Selfbot.Client({
    presence: { afk: db?.set_afk ?? false },
    http: {
        headers: { "x-super-properties": "ewogICJvcyI6ICJXaW5kb3dzIiwKICAiYnJvd3NlciI6ICJEaXNjb3JkIENsaWVudCIsCiAgInJlbGVhc2VfY2hhbm5lbCI6ICJjYW5hcnkiLAogICJjbGllbnRfdmVyc2lvbiI6ICIxLjAuNDkiLAogICJvc192ZXJzaW9uIjogIjEwLjAuMjI2MjEiLAogICJvc19hcmNoIjogIng2NCIsCiAgInN5c3RlbV9sb2NhbGUiOiAiZW4tVVMiLAogICJjbGllbnRfYnVpbGRfbnVtYmVyIjogIjE1MjQ1MCIsCiAgImNsaWVudF9ldmVudF9zb3VyY2UiOiBudWxsCn0=" }
    },
    ws: {
        large_threshold: 250,
        properties: {
            design_id: 0,
            os_arch: 'x64',
            system_locale: 'en-US',
            os_version: '10.0.22621',
            release_channel: 'stable',
            client_event_source: null,
            native_build_number: 29584,
            client_version: '1.0.9011',
            client_build_number: 175517,
            os: getDevice(db?.platform).os,
            browser: getDevice(db?.platform).browser,
        }
    },
    disabledEvents: [
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'MESSAGE_REACTION_REMOVE_EMOJI',
        'CHANNEL_PINS_UPDATE',
        'INVITE_DELETE',
        'GUILD_SCHEDULED_EVENT_CREATE',
        'GUILD_SCHEDULED_EVENT_UPDATE',
        'GUILD_SCHEDULED_EVENT_DELETE',
        'GUILD_SCHEDULED_EVENT_USER_ADD',
        'GUILD_SCHEDULED_EVENT_USER_REMOVE'
    ],
    fetchAllMembers: false,
    messageSweepInterval: 5 * 60,           // Toutes les 5 minutes il verifie ceux qui sont trop vieux pour les supprimer
    messageCacheLifetime: 1 * 60 * 60,      // 1 heure de vie max du message avant qu'il soit trop vieux et mettre dans la case des messages a delete
    messageCacheMaxSize: 5                  // Nombre de messages maximum par salon a stocker dans le cache
})



client.data = {};
client.clans = 0;
client.current = 0;
client.mfaToken = {}
client.used = new Map();
client.ment = new Map();
client.snipes = new Map();
client.db = workerData.database;
client.setMaxListeners(Infinity);
client.pendingRequests = new Map();

client.loadbun = () => loadBun();
client.replace = x => citation(x);
client.upload = x => upload2Imgur(x);
client.log = (x, y) => sendLog(x, y);
client.voc = x => joinVoiceChannel(x);
client.send = (x, y) => splitSend(x, y);
client.sendTrackedRequest = (request, callback) => sendTrackedRequest(request, callback);
client.config = require('../../config.json');


client.language = (fr, en) => client.db.language == "fr" ? fr : en
client.save = () => fs.writeFileSync(`./Structures/databases/${userId}.json`, JSON.stringify(client.db, null, 4))

const userPremium = Object.keys(codes).find(code => codes[code].by == userId);
client.premium = client.config["premium_disable"] ? { actif: true, code: "VIP (free)", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, redeemedAt: Date.now() } : userPremium ? codes[userPremium] : { actif: false }

client.login(workerData.token).catch((e) => {
    if (e.message !== "Incorrect login details were provided.")
        return parentPort.postMessage(e);

    client.config.users = client.config.users.filter(t => t !== workerData.token)
    fs.writeFileSync("./config.json", JSON.stringify(client.config, null, 2));
})

handler.loadCommands(client, "Selfbot/commands")
handler.loadEvents(client, "Selfbot/events")

















function loadBun() {
    Bun.connect({
        hostname: "canary.discord.com",
        port: 443,
        tls: {
            rejectUnauthorized: false,
            secureProtocol: 'TLSv1_2_method'
        },
        socket: {
            open: socket => {
                client.socket = socket
                client.connectionStartTime = Date.now();
                socket.setNoDelay(true);
                socket.setKeepAlive(true, 1000);
                startKeepAlive();
            },
            data: (socket, data) => {
                const response = data.toString();
                handleTrackedResponse(response);
            },
            close: socket => {
                const uptime = client.connectionStartTime ? ((Date.now() - client.connectionStartTime) / 1000 / 60).toFixed(1) : 0;
                client.socket = null;
                client.connectionStartTime = null;
                clearInterval(client.keepAliveInterval);
                client.pendingRequests.clear();
                setTimeout(() => client.loadbun(), 1000);
            },
            error(socket, error) {
                console.error("❌ Erreur socket:", error.message);
            },
        },
    });
}


/**
 * @returns {void}
*/
function startKeepAlive() {
    client.keepAliveInterval = setInterval(() => {
        if (client.socket) {
            const keepAliveRequest =
                `GET /api/v10/users/@me/settings HTTP/1.1\r\n` +
                `Host: discord.com\r\n` +
                `Authorization: ${client.token}\r\n` +
                `Connection: keep-alive\r\n` +
                `\r\n`;

            try {
                client.socket.write(keepAliveRequest);
            } catch (error) {
                console.error("❌ Erreur keep-alive:", error.message);
            }
        }
    }, 1000 * 10);
}


/**
 * @param {string} text
 * @returns {string}
*/
function citation(text) {
    if (!text || typeof text !== "string") return text;

    const citation = require('./citations.json');
    const allQuotes = Object.values(citation).flat();
    const data = {
        '{ram}': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}`,
        '{knowledgequotes}': citation.knowledge?.length ? citation.knowledge[Math.floor(Math.random() * citation.knowledge.length)] : "",
        '{businessquotes}': citation.business?.length ? citation.business[Math.floor(Math.random() * citation.business.length)] : "",
        '{treasonquotes}': citation.trahison?.length ? citation.trahison[Math.floor(Math.random() * citation.trahison.length)] : "",
        '{enemyquotes}': citation.enemy?.length ? citation.enemy[Math.floor(Math.random() * citation.enemy.length)] : "",
        '{moneyquotes}': citation.money?.length ? citation.money[Math.floor(Math.random() * citation.money.length)] : "",
        '{deathquotes}': citation.death?.length ? citation.death[Math.floor(Math.random() * citation.death.length)] : "",
        '{lifequotes}': citation.life?.length ? citation.life[Math.floor(Math.random() * citation.life.length)] : "",
        '{fearquotes}': citation.fear?.length ? citation.fear[Math.floor(Math.random() * citation.fear.length)] : "",
        '{artquotes}': citation.art?.length ? citation.art[Math.floor(Math.random() * citation.art.length)] : "",
        '{warquotes}': citation.war?.length ? citation.war[Math.floor(Math.random() * citation.war.length)] : "",
        '{sexquotes}': citation.sexe?.length ? citation.sexe[Math.floor(Math.random() * citation.sexe.length)] : "",
        '{islamquotes}': citation.islam?.length ? citation.islam[Math.floor(Math.random() * citation.islam.length)] : "",
        '{christquotes}': citation.christ?.length ? citation.christ[Math.floor(Math.random() * citation.christ.length)] : "",
        '{manipulationquotes}': citation.manipulation?.length ? citation.manipulation[Math.floor(Math.random() * citation.manipulation.length)] : "",
        '{psyquotes}': citation.psy?.length ? citation.psy[Math.floor(Math.random() * citation.psy.length)] : "",
        '{randomquotes}': allQuotes.length ? allQuotes[Math.floor(Math.random() * allQuotes.length)] : "",
        '{blocked}': client.user?.blocked?.size ?? 0,
        '{friends}': client.user?.friends?.size ?? 0,
        '{messagesdeleted}': client.db?.stats?.messages_deleted ?? 0,
        '{totalsniped}': client.db?.stats?.sniped ?? 0,
        '{servers}': client.guilds?.size ?? 0,
        '{messages}': client.db?.stats?.messages_created ?? 0,
        '{users}': client.users?.size ?? 0,
        '{ping}': `${Math.round(client.ping ?? 0)}ms`,
        "{date}": new Date().toLocaleDateString("fr"),
        "{time}": new Date().toLocaleTimeString("fr", { hour12: false }),
        "{fulldate}": new Date().toLocaleString("fr")
    };

    for (const [key, value] of Object.entries(data))
        text = text.replaceAll(key, value);
    return text;
}


/**
 * @param {string} request
 * @param {function} callback
 * @returns {string}
*/
function sendTrackedRequest(request, callback) {
    if (!client.socket) return null;

    const startTime = performance.now();

    const responseHandler = (response) => {
        const responseTime = Math.round(performance.now() - startTime);
        const isSuccess = response.includes('HTTP/1.1 2');
        callback(isSuccess, response, responseTime);
    };

    const timeoutId = setTimeout(() => {
        client.pendingRequests.delete(startTime);
        callback(false, null, Math.round(performance.now() - startTime));
    }, 1500);

    client.pendingRequests.set(startTime, {
        handler: responseHandler,
        timeout: timeoutId
    });

    setImmediate(() => client.socket.write(request));
    return startTime.toString();
}

/**
 * @param {string} response
 * @returns {void}
*/
function handleTrackedResponse(response) {
    if (client.pendingRequests.size === 0) return;

    if (client.pendingRequests.size === 1) {
        const [startTime, requestData] = client.pendingRequests.entries().next().value;
        clearTimeout(requestData.timeout);
        client.pendingRequests.delete(startTime);
        setImmediate(() => requestData.handler(response));
        return;
    }

    let oldestTime = Infinity;
    let oldestData = null;
    let oldestKey = null;

    for (const [time, data] of client.pendingRequests) {
        if (time < oldestTime) {
            oldestTime = time;
            oldestData = data;
            oldestKey = time;
        }
    }

    if (oldestData) {
        clearTimeout(oldestData.timeout);
        client.pendingRequests.delete(oldestKey);
        setImmediate(() => oldestData.handler(response));
    }
}

/**
 * @param {string} error
 * @returns {void}
*/
async function errorHandler(error) {
    const errors = [0, 400, 10062, 10008, 50035, 40032, 50013]
    if (errors.includes(error.code)) return;
    console.error(error);
};



/**
 * @param {string} webhookUrl
 * @param {object} options
 * @returns {Promise<boolean>}
*/
async function sendLog(webhook_url, options = { name: '› Stealy', avatar_url: 'https://i.imgur.com/TPRGKbj.png' }) {
    options.username = '› Stealy'
    options.avatar_url = 'https://i.imgur.com/TPRGKbj.png';
    await fetch(webhook_url,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        })
        .then(() => true)
        .catch(() => false)
}


/**
 * @param {string} content
 * @param {number} maxLength
 * @returns {Array<string>}
*/
function splitString(content, maxLength) {
    if (!content || content == '') return contnet;
    const lines = content?.split('\n');
    const chunks = [];
    let currentChunk = '';

    for (const line of lines) {
        if ((currentChunk + line).length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else currentChunk += (currentChunk ? '\n' : '') + line;
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
};

/**
 * @param {Selfbot.Message} message
 * @param {string} content
 * @returns {void}
*/
function splitSend(message, content) {
    const chunks = splitString(content, 1900);
    const messages = [];

    for (let i = 0; i < chunks.length; i++) {
        if (i == 1 && message.editable) message.edit(chunks[i]).then(m => messages.push(m));
        else message.channel.send(chunks[i]).then(m => messages.push(m));
    }
    setTimeout(() => messages.forEach(message => message.delete().catch(() => false)), 1000 * 40);
}

/**
 * @param {string} image_url
 * @returns {Promise<string>}
*/
async function upload2Imgur(image_url) {
    const response = await fetch("https://api.imgur.com/3/image", {
        headers: {
            authorization: "Client-ID 34b90e75ab1c04b",
            'content-type': 'application/json'
        },
        body: JSON.stringify({ image: image_url, name: ' ', type: 'url' }),
        method: "POST",
    })
        .then(r => r.json())
        .catch(() => null);

    if (response && response.status == 200) return response.data.link
    else return image_url;
}



/**
 * @param {string | null} channel_id
 * @returns {void}
*/
function joinVoiceChannel(channel_id = client.db.voice.channelId) {
    const channel = client.channels.get(channel_id);
    if (!channel) return delete client.connexion;

    client.connexion = channel;
    client.ws.send({
        op: 4,
        d: {
            guild_id: channel.guild.id ?? null,
            channel_id: channel.id,
            self_mute: client.db.voice.mute,
            self_deaf: client.db.voice.deaf,
            self_video: client.db.voice.video,
            flags: 2,
        },
    });

    if (client.db.voice.stream) {
        setTimeout(() => {
            if (client.connexion && client.connexion.id === channel.id) {
                client.ws.send({
                    op: 18,
                    d: {
                        type: channel.guild ? 'guild' : 'dm',
                        guild_id: channel.guild.id ?? null,
                        channel_id: channel.id,
                        preferred_region: "japan"
                    }
                });
            }
        }, 1000);
    } else {
        client.ws.send({
            op: 19,
            d: { stream_key: `${channel.guild.id ? `guild:${channel.guild.id}` : 'call'}:${channel.id}:${client.user.id}` }
        });
    }
}



/**
 * @param {string} text
 * @returns {string}
*/
function encrypt(text) {
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}



/**
 * @param {string} data
 * @returns {string}
*/
function getDevice(data) {
    switch (data) {
        case 'web':
            return { os: "Other", browser: "Discord Web" };

        case 'mobile':
            return { os: "iOS", browser: "Discord iOS" };

        case 'android':
            return { os: "Android", browser: "Discord Android" };

        case 'console':
            return { os: "Linux", browser: "Discord Client" };

        default:
            return { os: "Linux", browser: "Discord Client" };
    }
}

//process.on("exit", (code) => console.log("🟡 Process exited with code:", code));
//process.on("SIGINT", () => console.log("🔴 SIGINT reçue"));
process.on("uncaughtException", (err) => errorHandler);
process.on("unhandledRejection", (reason) => errorHandler);
