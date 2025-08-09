//const Guild = require('./Guild');

class GuildTemplate {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    if (data) this.setup(data);
  }

  setup(data) {

    /**
     * The code of this template
     * @type {string}
     */
    this.code = data.code;

    /**
     * The name of this template
     * @type {number}
     */
    this.name = data.name;

    /**
     * The description of this template
     * @type {?Snowflake}
     */
    this.description = data.description;
  }

  get link() {
    return `https://discord.new/${this.code}`
  }
}

module.exports = GuildTemplate;
