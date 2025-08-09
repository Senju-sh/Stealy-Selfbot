const Collection = require('../util/Collection');
const UserConnection = require('./UserConnection');
const Constants = require('../util/Constants');
const UserFlags = require('../util/UserFlags');
/**
 * Represents a user's profile on Discord.
 */
class UserProfile {
  constructor(user, data) {
    /**
     * The owner of the profile
     * @type {User}
     */
    this.user = user;

    /**
     * The client that created the instance of the UserProfile
     * @name UserProfile#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: user.client });

    /**
     * The guilds that the client user and the user share
     * @type {Collection<Snowflake, Guild>}
     */
    this.mutualGuilds = new Collection();

    /**
     * The user's connections
     * @type {Collection<Snowflake, UserConnection>}
     */
    this.connections = new Collection();

    this.setup(data);
  }

  setup(data) {
    /**
     * If the user has Discord Premium
     * @type {boolean}
     */
    this.premium = data.premium;
    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.userid = data.user.id;
    /**
     * The username of the user
     * @type {string}
     */
    this.username = data.user.username;

    /**
     * The old tag of the user
     * @type {string}
     */
    this.legacyUsername = data.legacy_username;

    /**
     * A discriminator based on username for the user
     * @type {string}
     */
    this.discriminator = data.user.discriminator;

    /**
     * The ID of the user's avatar
     * @type {string}
     */
    this.avatar = data.user.avatar;

    /**
       * The user avatar decoration's hash
       * @type {?string}
       */

    this.avatarDecoration = data.user.avatar_decoration_data?.asset;

    /**
       * The ID of the avatar decoration's SKU
       * @type {?Snowflake}
       */

    this.avatarDecorationSKUId = data.user.avatar_decoration_data?.sku_id;
    /**
     * The ID of the user's banner
     * @type {?string}
     */
    this.banner = data.user.banner;

    /**
     * The user's display name
     * @type {?string}
     */
    this.global_name = data.user.global_name;

    /**
     * The user's bio
     * @type {?string}
     */
    this.bio = data.user.bio;

    /**
     * Pronouns of the user
     * @type {string}
     */
    this.pronouns = data.user_profile.pronouns;

    /**
       * The user's theme colors (Profile theme) [Primary, Accent]
       * @type {?Array<number>}
       */
    this.themeColors = data.user_profile.theme_colors;
    /**
     * The user's flags
     * @type {?integer}
     */
    this.flags = new UserFlags(data.user.public_flags)
    /**
     * The date since which the user has had Discord Premium
     * @type {?Date}
     */
    this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;
    /**
     * The date since which the user has been boosting a guild
     * @type {?Date}
     */
    this.premiumServerSince = data.premium_guild_since ? new Date(data.premium_guild_since) : null;

    if ('guild_member_profile' in data && 'guild_member' in data) {
      const guild = this.client.guilds.get(data.guild_member_profile.guild_id);
      const member = guild?._addMember(data.guild_member);
      member._ProfilePatch(data.guild_member_profile);
    }

    for (const guild of data.mutual_guilds) {
      if (this.client.guilds.has(guild.id)) {
        this.mutualGuilds.set(guild.id, this.client.guilds.get(guild.id));
      }
    }
    for (const connection of data.connected_accounts) {
      this.connections.set(connection.id, new UserConnection(this.user, connection));
    }
  }
  get bannerURL() {
    if (!this.banner) return null;
    return Constants.Endpoints.User(this.userid).Banner(this.client.options.http.cdn, this.banner);
  }
  /**
   * A link to the user's avatar
   * @type {?string}
   * @readonly
   */
  get avatarURL() {
    if (!this.avatar) return null;
    return Constants.Endpoints.User(this.userid).Avatar(this.client.options.http.cdn, this.avatar);
  }

  /**
   * A link to the user's avatar decoration
   * @type {string}
   * @readonly
   */

  get avatarDecorationURL() {
    if (!this.avatarDecoration) return null;
    return Constants.Endpoints.User(this).AvatarDecoration(this.client.options.http.cdn, this.avatarDecoration);
  }

  get hexThemeColor() {
    return this.themeColors?.map(c => `#${c.toString(16).padStart(6, '0')}`) || null;
  }
}

module.exports = UserProfile;
