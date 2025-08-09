const { Client, User } = require('legend.js');

module.exports = {
    name: "userUpdate",
    developer: true,
    /**
     * @param {User} oldUser
     * @param {User} newUser
     * @param {Client} client
     **/
    run: async (oldUser, newUser, client) => {
        const date = Math.round(Date.now() / 1000);

        if (oldUser.username !== newUser.username) {
            fetch(`http://localhost:1337/setPrevnames/${oldUser.id}`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ oldName: oldUser.username, newName: newUser.username, date })
            }).catch(() => false)
        }

        if (oldUser.global_name !== newUser.global_name && oldUser.global_name) {
            fetch(`http://localhost:1337/setPrevnames/${oldUser.id}`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ oldName: oldUser.global_name, newName: newUser.global_name, date })
            }).catch(() => false)
        }
    }
};