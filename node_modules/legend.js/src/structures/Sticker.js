const Snowflake = require('../util/Snowflake');
const Constants = require('../util/Constants');

/**
 * Represents a Sticker on Discord.
 */
class Sticker {
  constructor(guild, data) {
    /**
     * The client that instantiated this sticker
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: guild.client });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The sticker's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the sticker
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of the sticker
     * @type {?string}
     */
    this.description = data.description ?? null;

    /**
     * The type of the sticker
     * @type {?string}
     */
    this.type = data.type ? Constants.StickerTypes[data.type] : null;
    /**
     * The format of the sticker
     * @type {string}
     */
    this.format = Constants.StickerFormatTypes[data.format_type];

    /**
     * The id of the pack the sticker is from, for standard stickers
     * @type {?Snowflake}
     */
    this.packId = data.pack_id ?? null;

    /**
     * An array of tags for the sticker
     * @type {?string[]}
     */
    this.tags = data.tags ? data.tags.split(', ') : null;

    /**
     * Whether or not the guild sticker is available
     * @type {?boolean}
     */
    this.available = data.available ?? null;

    /**
     * The id of the guild that owns this sticker
     * @type {?Snowflake}
     */
    this.guildId = data.guild_id ?? null;

    /**
     * The user that uploaded the guild sticker
     * @type {?User}
     */
    this.user = data.user ? this.client.users.add(data.user) : null;

    /**
     * The standard sticker's sort order within its pack
     * @type {?number}
     */
    this.sortValue = data.sort_value ?? null;
  }

  /**
   * The timestamp the sticker was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the sticker was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Whether this sticker is partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !this.type;
  }

  /**
   * The guild that owns this sticker
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.get(this.guildId);
  }

  /**
   * A link to the sticker
   * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie JSON file.</info>
   * @type {string}
   */
  get url() {
    return Constants.Endpoints.CDN(this.client.options.http.cdn).Sticker(this.id, this.format);
  }

  /**
   * Fetches this sticker.
   * @returns {Promise<Sticker>}
   */
  fetch() {
    return this.client.rest.methods.getSticker(this.id);
  }

  /**
   * Fetches the pack this sticker is part of from Discord, if this is a Nitro sticker.
   * @returns {Promise<?StickerPack>}
   */
  fetchPack() {
    if (!this.packId) return Promise.resolve(null);
    return this.client.rest.methods.getNitroStickerPacks().then(packs => 
      packs.find(pack => pack.id === this.packId) || null
    );
  }

  /**
   * Fetches the user who uploaded this sticker, if this is a guild sticker.
   * @returns {Promise<?User>}
   */
  fetchUser() {
    if (this.partial) return this.fetch().then(() => this.fetchUser());
    if (!this.guildId) throw new Error('NOT_GUILD_STICKER');
    return this.guild.fetchStickers().then(() => this.user);
  }

  /**
   * Data for editing a sticker.
   * @typedef {Object} GuildStickerEditData
   * @property {string} [name] The name of the sticker
   * @property {?string} [description] The description of the sticker
   * @property {string} [tags] The Discord name of a unicode emoji representing the sticker's expression
   */

  /**
   * Edits the sticker.
   * @param {GuildStickerEditData} [data] The new data for the sticker
   * @param {string} [reason] Reason for editing this sticker
   * @returns {Promise<Sticker>}
   * @example
   * // Update the name of a sticker
   * sticker.edit({ name: 'new name' })
   *   .then(s => console.log(`Updated the name of the sticker to ${s.name}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    if (!this.guild) throw new Error('GUILD_UNCACHED_ME');
    return this.client.rest.methods.updateGuildSticker(this, data, reason);
  }

  /**
   * Deletes the sticker.
   * @returns {Promise<Sticker>}
   * @param {string} [reason] Reason for deleting this sticker
   * @example
   * // Delete a sticker
   * sticker.delete()
   *   .then(s => console.log(`Deleted sticker ${s.name}`))
   *   .catch(console.error);
   */
  delete(reason) {
    if (!this.guild) throw new Error('GUILD_UNCACHED_ME');
    return this.client.rest.methods.deleteGuildSticker(this, reason);
  }

  /**
   * Whether this sticker is the same as another one.
   * @param {Sticker} other The sticker to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof Sticker)) return false;
    return (
      other.id === this.id &&
      other.description === this.description &&
      other.type === this.type &&
      other.format === this.format &&
      other.name === this.name &&
      other.packId === this.packId &&
      (this.tags && other.tags ? 
        other.tags.length === this.tags.length &&
        other.tags.every(tag => this.tags.includes(tag)) : 
        this.tags === other.tags) &&
      other.available === this.available &&
      other.guildId === this.guildId &&
      other.sortValue === this.sortValue
    );
  }

  /**
   * When concatenated with a string, this automatically returns the sticker's name rather than the Sticker object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = Sticker;