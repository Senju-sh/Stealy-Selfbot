const Action = require('./Action');
const Constants = require('../../util/Constants');
const Util = require('../../util/Util');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const newUser = data.id === client.user.id ? client.user : client.users.get(data.id);
    const oldUser = Util.cloneObject(newUser);
    newUser.patch(data);
    if (!oldUser.equals(newUser)) {
      /**
       * Emitted whenever a user's details (e.g. username) are changed.
       * Triggered by the Discord gateway events USER_UPDATE, GUILD_MEMBER_UPDATE, and PRESENCE_UPDATE.
       * @event Client#userUpdate
       * @param {User} oldUser The user before the update
       * @param {User} newUser The user after the update
       */
      client.emit(Constants.Events.USER_UPDATE, oldUser, newUser);
      return {
        old: oldUser,
        updated: newUser,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;
