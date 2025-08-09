const { Client, Message } = require("legend.js");

module.exports = {
    name: "nitro",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        message.edit(`*https://discord.gift/${nitrocode(16, "0aA")} *`)
    }
}

/**
 * @param {number} length
 * @param {string} letter
 * @returns {string}
*/
function nitrocode(length, letter) {

    var multiplier = '';
    if (letter.indexOf('0') > -1) multiplier += '0123456789';
    if (letter.indexOf('A') > -1) multiplier += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (letter.indexOf('a') > -1) multiplier += 'abcdefghijklmnopqrstuvwxyz';
    var results = '';


    for (var i = length; i > 0; --i) {
        results += multiplier[Math.floor(Math.random() * multiplier.length)];
    }

    return results;

}