const { Client, Message } = require("legend.js");
const worker_threads = require('worker_threads');

module.exports = {
    name: "addtoken",
    owner: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (!args[0]) 
            return message.edit(client.language(
                `*${cross} 〃 Veuillez entrer un token.*`,
                `*${cross} 〃 Please enter a token.*`
            ))

        const res = await fetch('https://discord.com/api/v10/users/@me', { headers: { authorization: args[0] } })
            .then(a => a.json())
            .catch(() => null);

        if (!res || !res.id) 
            return message.edit(client.language(
                `*${cross} Le jeton est invalide.*`,
                `*${cross} The jeton is invalid.*`
            ));
        
	    message.edit(client.language(
            `*${yes} 〃 \`${res.username}\` (<@${res.id}>) est maintenant connecté.*`,
            `*${yes} 〃 \`${res.username}\` (<@${res.id}>) is now connected.*`
        ))

        loadWorker(args[0])
    }
}










// functions

/**
 * @param {string} encrypted_token
 * @returns {object}
*/
async function loadDatabase(encrypted_token)
{
    const token = encrypted_token.includes('.') ? encrypted_token : decrypt(encrypted_token);
    const userId = Buffer.from(token.split('.')[0], 'base64').toString();

    if (fs.existsSync(`./Structures/databases/${userId}.json`)) return require(`./Structures/databases/${userId}.json`);
    else {
        await fs.promises.writeFile(`./Structures/databases/${userId}.json`, JSON.stringify(example, null, 4), 'utf-8');
        return require(`./Structures/databases/${userId}.json`)
    }
}


/**
 * @param {string} Encrypt_token
 * @returns {void}
*/
function pushAndSave(Encrypt_token)
{
    if (!config.users.includes(Encrypt_token.includes('.') ? encrypt(Encrypt_token) : Encrypt_token)) 
        config.users.push(Encrypt_token.includes('.') ? encrypt(Encrypt_token) : Encrypt_token);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
}

/**
 * @param {string} token
 * @param {object} database
 * @returns {Promise<void>}
*/
async function loadWorker(token, client)
{
    const userId = Buffer.from(token.split('.')[0], 'base64').toString();

    if (!config.users.includes(encrypt(token))) pushAndSave(token);
    const database = await loadDatabase(token);
    if (database && !database.enable) return;

    const worker = new worker_threads.Worker('./Structures/files/Client.js', { workerData: { token, database } });
    worker.on('message', (message) => console.log(message));
    worker.on('error', console.error);
    worker.on('messageerror', console.error);
    workers[userId] = worker;
}


/**
 * @param {string} encryptedData
 * @returns {string}
*/
function decrypt(encryptedData)
{
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 * @param {string} text
 * @returns {string}
*/
function encrypt(text)
{
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
