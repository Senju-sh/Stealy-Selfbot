//const UserAgentManager = require('../client/rest/UserAgentManager');
const JSONBig = require('json-bigint');
exports.Package = require('../../package.json');
/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {string} [apiRequestMethod='sequential'] One of `sequential` or `burst`. The sequential handler executes
 * all requests in the order they are triggered, whereas the burst handler runs multiple in parallel, and doesn't
 * provide the guarantee of any particular order. Burst mode is more likely to hit a 429 ratelimit error by its nature,
 * and is therefore slightly riskier to use.
 * @property {number} [shardId=0] ID of the shard to run
 * @property {number} [shardCount=0] Total number of shards
 * @property {number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely)
 * @property {number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {boolean} [fetchAllMembers=false] Whether to cache all guild members and users upon startup, as well as
 * upon joining a guild (should be avoided whenever possible)
 * @property {boolean} [disableEveryone=false] Default value for {@link MessageOptions#disableEveryone}
 * @property {boolean} [sync=false] Whether to periodically sync guilds (for user accounts)
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {number} [restTimeOffset=500] Extra time in millseconds to wait before continuing to make REST
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {string} [proxy=""] proxy for API requests
 * @property {string} [captchaService=""] catpcha service
 * @property {string} [captchaKey=""] catpcha key
 * @property {string} [captchaRetryLimit=3] catpcha retry limit
 * @property {number} [retryLimit=Infinity] How many times to retry on 5XX errors
 * (Infinity for indefinite amount of retries)
 * @property {WSEventType[]} [disabledEvents] An array of disabled websocket events. Events in this array will not be
 * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
 * 100% certain you don't need, as many are important, but not obviously so. The safest one to disable with the
 * most impact is typically `TYPING_START`.
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 */
exports.DefaultOptions = {
  jsonTransformer: object => JSONBig.stringify(object),
  captchaSolver: captcha => Promise.reject(new Error('CAPTCHA_SOLVER_NOT_IMPLEMENTED', captcha)),
  apiRequestMethod: 'sequential',
  shardId: 0,
  shardCount: 0,
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  messageSweepInterval: 0,
  fetchAllMembers: false,
  disableEveryone: false,
  sync: false,
  restWsBridgeTimeout: 5000,
  retryLimit: Infinity,
  disabledEvents: [],
  restTimeOffset: 500,
  proxy: "",
  captchaService: "",
  captchaKey: null,
  captchaRetryLimit: 3,
  captchaWithProxy: false,

  /**
   * WebSocket options (these are left as snake_case to match the API)
   * @typedef {Object} WebsocketOptions
   * @property {number} [large_threshold=250] Number of members in a guild to be considered large
   * @property {boolean} [compress=true] Whether to compress data sent on the connection
   * (defaults to `false` for browsers)
   */
  ws: {
    capabilities: 0, // https://discord-userdoccers.vercel.app/topics/gateway#gateway-capabilities
    //large_threshold: 250,
    compress: true,
    properties: {
      os: 'Windows',
      browser: 'Discord Client',
      release_channel: 'stable',
      client_version: '1.0.9154',
      os_version: '10.0.19045',
      os_arch: 'x64',
      app_arch: 'x64',
      system_locale: 'en-US',
      browser_user_agent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9154 Chrome/124.0.6367.243 Electron/30.1.0 Safari/537.36`,
      browser_version: '30.1.0',
      client_build_number: 310927,
      native_build_number: 49586,
      client_event_source: null,
    },
    presence: {
      activities: [],
      status: "dnd",
      since: 0,
      afk: true
    },
    version: 9,
  },

  /**
   * HTTP options
   * @typedef {Object} HTTPOptions
   * @property {number} [version=9] API version to use
   * @property {string} [api='https://discord.com/api'] Base url of the API
   * @property {string} [cdn='https://cdn.discordapp.com'] Base url of the CDN
   * @property {string} [invite='https://discord.gg'] Base url of invites
   */
  http: {
    version: 9,
    host: 'https://discord.com',
    cdn: 'https://cdn.discordapp.com',
  },
};

exports.WSCodes = {
  1000: 'Connection gracefully closed',
  4004: 'Tried to identify with an invalid token',
  4010: 'Sharding data provided was invalid',
  4011: 'Shard would be on too many guilds if connected',
  4013: 'Invalid Intents provided',
  4014: 'Intents not allowed',
};

exports.StickerTypes = createEnum([null, 'STANDARD', 'GUILD']);
exports.StickerFormatTypes = createEnum([null, 'PNG', 'APNG', 'LOTTIE', 'GIF']);

exports.Errors = {
  NO_TOKEN: 'Request to use token, but token was unavailable to the client.',
  NO_BOT_ACCOUNT: 'Only bot accounts are able to make use of this feature.',
  NO_USER_ACCOUNT: 'Only user accounts are able to make use of this feature.',
  BAD_WS_MESSAGE: 'A bad message was received from the websocket; either bad compression, or not JSON.',
  TOOK_TOO_LONG: 'Something took too long to do.',
  NOT_A_PERMISSION: 'Invalid permission string or number.',
  INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
  BAD_LOGIN: 'Incorrect login details were provided.',
  INVALID_SHARD: 'Invalid shard settings were provided.',
  SHARDING_REQUIRED: 'This session would have handled too many guilds - Sharding is required.',
  INVALID_TOKEN: 'An invalid token was provided.',
  GATEWAY_VERSION: 'Invalid version of gateway.',
};

const Endpoints = exports.Endpoints = {
  User: userID => {
    if (userID.id) userID = userID.id;
    const base = `/users/${userID}`;
    return {
      toString: () => base,
      channels: `${base}/channels`,
      profile: `${base}/profile`,
      relationships: `${base}/relationships`,
      settings: `${base}/settings`,
      pomeloattempt: `${base}/pomelo-attempt`,
      Relationship: uID => `${base}/relationships/${uID}`,
      boosts: `${base}/guilds/premium/subscription-slots`,
      Guild: guildID => ({
        toString: () => `${base}/guilds/${guildID}`,
        settings: `${base}/guilds/${guildID}/settings`,
      }),
      Note: id => `${base}/notes/${id}`,
      Mentions: (limit, roles, everyone, guildID) =>
        `${base}/mentions?limit=${limit}&roles=${roles}&everyone=${everyone}${guildID ? `&guild_id=${guildID}` : ''}`,
      Avatar: (root, hash) => {
        if (userID === '1') return hash;
        return Endpoints.CDN(root).Avatar(userID, hash);
      },
      Banner: (root, hash) => {
        if (userID === '1') return hash;
        return Endpoints.CDN(root).UserBanner(userID, hash);
      },
      AvatarDecoration: (root, hash) => {
        //if (userID === '1') return hash;
        return Endpoints.CDN(root).AvatarDecoration(hash);
      },
    };
  },
  hypesquad: '/hypesquad/online',
  experiments: '/experiments',
  guilds: '/guilds',
  Guild: guildID => {
    if (guildID.id) guildID = guildID.id;
    const base = `/guilds/${guildID}`;
    return {
      toString: () => base,
      prune: `${base}/prune`,
      embed: `${base}/embed`,
      bans: `${base}/bans`,
      integrations: `${base}/integrations`,
      members: `${base}/members`,
      channels: `${base}/channels`,
      invites: `${base}/invites`,
      roles: `${base}/roles`,
      emojis: `${base}/emojis`,
      stickers: `${base}/stickers`,
      search: `${base}/messages/search`,
      vanityURL: `${base}/vanity-url`,
      voiceRegions: `${base}/regions`,
      webhooks: `${base}/webhooks`,
      ack: `${base}/ack`,
      settings: `${base}/settings`,
      auditLogs: `${base}/audit-logs`,
      templates: `${base}/templates`,
      premium: `${base}/premium/subscriptions`,
      bulkban: `${base}/bulk-ban`,
      Emoji: emojiID => `${base}/emojis/${emojiID}`,
      Sticker: emojiID => `${base}/stickers/${emojiID}`,
      Icon: (root, hash) => Endpoints.CDN(root).Icon(guildID, hash),
      Banner: (root, hash) => Endpoints.CDN(root).Banner(guildID, hash),
      Splash: (root, hash) => Endpoints.CDN(root).Splash(guildID, hash),
      Role: roleID => `${base}/roles/${roleID}`,
      Member: memberID => {
        if (memberID.id) memberID = memberID.id;
        const mbase = `${base}/members/${memberID}`;
        return {
          toString: () => mbase,
          Role: roleID => `${mbase}/roles/${roleID}`,
          nickname: `${base}/members/@me`,
        };
      },
      Integration: id => `${base}/integrations/${id}`,
    };
  },
  channels: '/channels',
  Channel: channelID => {
    if (channelID.id) channelID = channelID.id;
    const base = `/channels/${channelID}`;
    return {
      toString: () => base,
      messages: {
        toString: () => `${base}/messages`,
        bulkDelete: `${base}/messages/bulk-delete`,
      },
      invites: `${base}/invites`,
      typing: `${base}/typing`,
      permissions: `${base}/permissions`,
      webhooks: `${base}/webhooks`,
      search: `${base}/messages/search`,
      pins: `${base}/pins`,
      silent: `${base}?silent=true`,
      Icon: (root, hash) => Endpoints.CDN(root).GDMIcon(channelID, hash),
      Pin: messageID => `${base}/pins/${messageID}`,
      Recipient: recipientID => `${base}/recipients/${recipientID}`,
      Message: messageID => {
        if (messageID.id) messageID = messageID.id;
        const mbase = `${base}/messages/${messageID}`;
        return {
          toString: () => mbase,
          reactions: `${mbase}/reactions`,
          ack: `${mbase}/ack`,
          Reaction: emoji => {
            const rbase = `${mbase}/reactions/${emoji}`;
            return {
              toString: () => rbase,
              User: userID => `${rbase}/${userID}`,
            };
          },
        };
      },
    };
  },
  Message: m => exports.Endpoints.Channel(m.channel).Message(m),
  Member: m => exports.Endpoints.Guild(m.guild).Member(m),
  CDN(root) {
    return {
      Emoji: (emojiID, format = 'png') => `${root}/emojis/${emojiID}.${format}`,
      Sticker: (stickerId, stickerFormat) =>
        `${root}/stickers/${stickerId}.${
          stickerFormat === 'LOTTIE' ? 'json' : stickerFormat === 'GIF' ? 'gif' : 'png'
        }`,
      Asset: name => `${root}/assets/${name}`,
      Avatar: (userID, hash) => `${root}/avatars/${userID}/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      UserBanner: (userID, hash) => `${root}/banners/${userID}/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      Icon: (guildID, hash) => `${root}/icons/${guildID}/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      Banner: (guildID, hash) => `${root}/banners/${guildID}/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      AvatarGuild: (guildID, userID, hash) => `${root}/guilds/${guildID}/users/${userID}/avatars/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      BannerGuild: (guildID, userID, hash) => `${root}/guilds/${guildID}/users/${userID}/banners/${hash}.${hash.startsWith('a_') ? 'gif?size=1024' : 'png?size=2048'}`,
      AppIcon: (clientID, hash) => `${root}/app-icons/${clientID}/${hash}.png`,
      AppAsset: (clientID, hash) => `${root}/app-assets/${clientID}/${hash}.png`,
      GDMIcon: (channelID, hash) => `${root}/channel-icons/${channelID}/${hash}.jpg?size=2048`,
      Splash: (guildID, hash) => `${root}/splashes/${guildID}/${hash}.jpg?size=2048`,
      TeamIcon: (teamID, hash) => `${root}/team-icons/${teamID}/${hash}.jpg`,
      RoleIcon: (roleID, hash) => `${root}/role-icons/${roleID}/${hash}.png`,
      AvatarDecoration: (hash) => `${root}/avatar-decoration-presets/${hash}.png?passthrough=true`,
    };
  },
  OAUTH2: {
    Application: appID => {
      const base = `/oauth2/applications/${appID}`;
      return {
        toString: () => base,
        resetSecret: `${base}/reset`,
        resetToken: `${base}/bot/reset`,
        externalAssets: `${base}/external-assets`
      };
    },
    App: appID => `/oauth2/authorize?client_id=${appID}`,
  },
  App: appID => {
    const base = `/applications/${appID}`;
    return {
      externalAssets: `${base}/external-assets`
    }
  },
  login: '/auth/login',
  logout: '/auth/logout',
  voiceRegions: '/voice/regions',
  gateway: {
    toString: () => '/gateway',
    bot: '/gateway/bot',
  },
  Invite: inviteID => `/invite/${inviteID}?with_counts=true`,
  Invites: inviteID => `/invites/${inviteID}`,
  inviteLink: id => `https://discord.gg/${id}`,
  Webhook: (webhookID, token) => `/webhooks/${webhookID}${token ? `/${token}` : ''}`,
  Quest: {
    base: `/quests/@me`,
    quests: (questID) => {
      const base = `/quests/${questID}`
      return {
        heartbeat: `${base}/heartbeat`
      }
    }
  },
  Activities: {
    base: `/activities`
  }
};


/**
 * The current status of the client. Here are the available statuses:
 * * READY: 0
 * * CONNECTING: 1
 * * RECONNECTING: 2
 * * IDLE: 3
 * * NEARLY: 4
 * * DISCONNECTED: 5
 * @typedef {number} Status
 */
exports.Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
};

/**
 * The current status of a voice connection. Here are the available statuses:
 * * CONNECTED: 0
 * * CONNECTING: 1
 * * AUTHENTICATING: 2
 * * RECONNECTING: 3
 * * DISCONNECTED: 4
 * @typedef {number} VoiceStatus
 */
exports.VoiceStatus = {
  CONNECTED: 0,
  CONNECTING: 1,
  AUTHENTICATING: 2,
  RECONNECTING: 3,
  DISCONNECTED: 4,
};

exports.ChannelTypes = {
  TEXT: 0,
  DM: 1,
  VOICE: 2,
  GROUP_DM: 3,
  CATEGORY: 4,
  NEWS: 5,
  STORE: 6,
  NEWS_THREAD: 7,
  PUBLIC_THREAD: 8,
  PRIVATE_THREAD: 9,
  STAGE_VOICE: 10,
  STAGE: 13,
  FORUM: 15
};

exports.OPCodes = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_GUILD_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
  // GUILD_SYNC: 12, // #  Receive         guild_sync but not used anymore
  /** Add some opcode from Discum
  /* @extends https://github.com/Merubokkusu/Discord-S.C.U.M/blob/master/discum/gateway/gateway.py#L56
  */
  DM_UPDATE: 13, // #  Send            used to get dm features
  LAZY_REQUEST: 14, // #  Send            discord responds back with GUILD_MEMBER_LIST_UPDATE type SYNC...
  LOBBY_CONNECT: 15,
  LOBBY_DISCONNECT: 16,
  LOBBY_VOICE_STATE_UPDATE: 17, // #  Receive
  STREAM_CREATE: 18,
  STREAM_DELETE: 19,
  STREAM_WATCH: 20,
  STREAM_PING: 21, // #  Send
  STREAM_SET_PAUSED: 22,
  REQUEST_APPLICATION_COMMANDS: 24, // #  Send            request application/bot cmds (user, message, and slash cmds)
  EMBEDDED_ACTIVITY_LAUNCH: 25,
  EMBEDDED_ACTIVITY_CLOSE: 26,
  EMBEDDED_ACTIVITY_UPDATE: 27,
  REQUEST_FORUM_UNREADS: 28, // Payload: { guild_id: Snowflake, channel_id: Snowflake, threads: { thread_id: Snowflake, ack_message_id: Snowflake }[] }
  REMOTE_COMMAND: 29, // Payload: { target_session_id: string, payload: any }
  GET_DELETED_ENTITY_IDS_NOT_MATCHING_HASH: 30, // Payload: { guild_id: Snowflake, channel_ids_hash: string[], role_ids_hash: string[], emoji_ids_hash: string[], sticker_ids_hash: string[] }
  REQUEST_SOUNDBOARD_SOUNDS: 31, // Payload: { guild_ids: string[] }
  SPEED_TEST_CREATE: 32, // Payload: { preferred_region: string }
  SPEED_TEST_DELETE: 33, // Payload: null
  REQUEST_LAST_MESSAGES: 34, // Payload: { guild_id: string, channel_ids: string[] }
  SEARCH_RECENT_MEMBERS: 35, // Payload: { guild_id: string, query: string, continuation_token?: Snowflake }
  REQUEST_CHANNEL_STATUSES: 36, // Payload: { guild_id: string } | Response: CHANNEL_STATUSES | { guild_id, channels: { status, id }[] }
  GUILD_SUBSCRIPTIONS_BULK: 37, // Payload: { subscriptions: Object<guild_id, { Payload_op14 - guild_id }> } | Response: Opcode 14
};

exports.VoiceOPCodes = {
  IDENTIFY: 0,
  SELECT_PROTOCOL: 1,
  READY: 2,
  HEARTBEAT: 3,
  SESSION_DESCRIPTION: 4,
  SPEAKING: 5,
  HELLO: 8,
};

exports.Events = {
  RATE_LIMIT: 'rateLimit',
  READY: 'ready',
  RESUME: 'resume',
  GUILD_CREATE: 'guildCreate',
  GUILD_DELETE: 'guildDelete',
  GUILD_UPDATE: 'guildUpdate',
  GUILD_UNAVAILABLE: 'guildUnavailable',
  GUILD_AVAILABLE: 'guildAvailable',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
  GUILD_MEMBER_LIST_UPDATE: 'guildMemberListUpdate',
  GUILD_MEMBER_SPEAKING: 'guildMemberSpeaking',
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
  GUILD_INTEGRATIONS_UPDATE: 'guildIntegrationsUpdate',
  GUILD_ROLE_CREATE: 'roleCreate',
  GUILD_ROLE_DELETE: 'roleDelete',
  GUILD_ROLE_UPDATE: 'roleUpdate',
  GUILD_EMOJI_CREATE: 'emojiCreate',
  GUILD_EMOJI_DELETE: 'emojiDelete',
  GUILD_EMOJI_UPDATE: 'emojiUpdate',
  GUILD_BAN_ADD: 'guildBanAdd',
  GUILD_BAN_REMOVE: 'guildBanRemove',
  INVITE_CREATE: 'inviteCreate',
  INVITE_DELETE: 'inviteDelete',
  CHANNEL_CREATE: 'channelCreate',
  CHANNEL_DELETE: 'channelDelete',
  CHANNEL_UPDATE: 'channelUpdate',
  CHANNEL_PINS_UPDATE: 'channelPinsUpdate',
  MESSAGE_CREATE: 'message',
  MESSAGE_DELETE: 'messageDelete',
  MESSAGE_UPDATE: 'messageUpdate',
  MESSAGE_BULK_DELETE: 'messageDeleteBulk',
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
  MESSAGE_REACTION_REMOVE_EMOJI: 'messageReactionRemoveEmoji',
  MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll',
  USER_UPDATE: 'userUpdate',
  USER_NOTE_UPDATE: 'userNoteUpdate',
  USER_SETTINGS_UPDATE: 'clientUserSettingsUpdate',
  USER_GUILD_SETTINGS_UPDATE: 'clientUserGuildSettingsUpdate',
  PRESENCE_UPDATE: 'presenceUpdate',
  VOICE_STATE_UPDATE: 'voiceStateUpdate',
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  WEBHOOKS_UPDATE: 'webhookUpdate',
  DISCONNECT: 'disconnect',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
  RELATIONSHIP_ADD: 'relationshipAdd',
  RELATIONSHIP_REMOVE: 'relationshipRemove',
  CHANNEL_RECIPIENT_ADD: 'channelRecipientAdd',
  CHANNEL_RECIPIENT_REMOVE: 'channelRecipientRemove',
  FRIEND_PRESENCE_UPDATE: 'friendPresenceUpdate',
};

/**
 * <info>Bots cannot set a `CUSTOM_STATUS`, it is only for custom statuses received from users</info>
 * The type of an activity of a users presence, e.g. `PLAYING`. Here are the available types:
 * * PLAYING
 * * STREAMING
 * * LISTENING
 * * WATCHING
 * * CUSTOM_STATUS
 * @typedef {string} ActivityType
 */
exports.ActivityTypes = createEnum(['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM_STATUS', 'COMPETING']);

/**
 * Numeric activity flags. All available properties:
 * * `INSTANCE`
 * * `JOIN`
 * * `SPECTATE`
 * * `JOIN_REQUEST`
 * * `SYNC`
 * * `PLAY`
 * @typedef {string} ActivityFlag
 * @see {@link https://discordapp.com/developers/docs/topics/gateway#activity-object-activity-flags}
 */
exports.ActivityFlags = {
  INSTANCE: 1 << 0,
  JOIN: 1 << 1,
  SPECTATE: 1 << 2,
  JOIN_REQUEST: 1 << 3,
  SYNC: 1 << 4,
  PLAY: 1 << 5,
};

/**
 * The type of a websocket message event, e.g. `MESSAGE_CREATE`. Here are the available events:
 * * READY
 * * RESUMED
 * * GUILD_SYNC
 * * GUILD_CREATE
 * * GUILD_DELETE
 * * GUILD_UPDATE
 * * GUILD_MEMBER_ADD
 * * GUILD_MEMBER_REMOVE
 * * GUILD_MEMBER_UPDATE
 * * GUILD_MEMBERS_CHUNK
 * * GUILD_INTEGRATIONS_UPDATE
 * * GUILD_ROLE_CREATE
 * * GUILD_ROLE_DELETE
 * * GUILD_ROLE_UPDATE
 * * GUILD_BAN_ADD
 * * GUILD_BAN_REMOVE
 * * CHANNEL_CREATE
 * * CHANNEL_DELETE
 * * CHANNEL_UPDATE
 * * CHANNEL_PINS_UPDATE
 * * MESSAGE_CREATE
 * * MESSAGE_DELETE
 * * MESSAGE_UPDATE
 * * MESSAGE_DELETE_BULK
 * * MESSAGE_REACTION_ADD
 * * MESSAGE_REACTION_REMOVE
 * * MESSAGE_REACTION_REMOVE_EMOJI
 * * MESSAGE_REACTION_REMOVE_ALL
 * * USER_UPDATE
 * * USER_NOTE_UPDATE
 * * USER_SETTINGS_UPDATE
 * * PRESENCE_UPDATE
 * * VOICE_STATE_UPDATE
 * * TYPING_START
 * * VOICE_SERVER_UPDATE
 * * RELATIONSHIP_ADD
 * * RELATIONSHIP_REMOVE
 * * WEBHOOKS_UPDATE
 * @typedef {string} WSEventType
 */
exports.WSEvents = {
  READY: 'READY',
  RESUMED: 'RESUMED',
  GUILD_SYNC: 'GUILD_SYNC',
  GUILD_CREATE: 'GUILD_CREATE',
  GUILD_DELETE: 'GUILD_DELETE',
  GUILD_UPDATE: 'GUILD_UPDATE',
  GUILD_MEMBER_ADD: 'GUILD_MEMBER_ADD',
  GUILD_MEMBER_REMOVE: 'GUILD_MEMBER_REMOVE',
  GUILD_MEMBER_LIST_UPDATE: 'GUILD_MEMBER_LIST_UPDATE',
  GUILD_MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK: 'GUILD_MEMBERS_CHUNK',
  GUILD_INTEGRATIONS_UPDATE: 'GUILD_INTEGRATIONS_UPDATE',
  GUILD_ROLE_CREATE: 'GUILD_ROLE_CREATE',
  GUILD_ROLE_DELETE: 'GUILD_ROLE_DELETE',
  GUILD_ROLE_UPDATE: 'GUILD_ROLE_UPDATE',
  GUILD_BAN_ADD: 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE: 'GUILD_BAN_REMOVE',
  GUILD_EMOJIS_UPDATE: 'GUILD_EMOJIS_UPDATE',
  INVITE_CREATE: 'INVITE_CREATE',
  INVITE_DELETE: 'INVITE_DELETE',
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  CHANNEL_PINS_UPDATE: 'CHANNEL_PINS_UPDATE',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  MESSAGE_DELETE_BULK: 'MESSAGE_DELETE_BULK',
  MESSAGE_REACTION_ADD: 'MESSAGE_REACTION_ADD',
  MESSAGE_REACTION_REMOVE: 'MESSAGE_REACTION_REMOVE',
  MESSAGE_REACTION_REMOVE_EMOJI: 'MESSAGE_REACTION_REMOVE_EMOJI',
  MESSAGE_REACTION_REMOVE_ALL: 'MESSAGE_REACTION_REMOVE_ALL',
  USER_UPDATE: 'USER_UPDATE',
  USER_NOTE_UPDATE: 'USER_NOTE_UPDATE',
  USER_SETTINGS_UPDATE: 'USER_SETTINGS_UPDATE',
  USER_GUILD_SETTINGS_UPDATE: 'USER_GUILD_SETTINGS_UPDATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
  TYPING_START: 'TYPING_START',
  VOICE_SERVER_UPDATE: 'VOICE_SERVER_UPDATE',
  RELATIONSHIP_ADD: 'RELATIONSHIP_ADD',
  RELATIONSHIP_REMOVE: 'RELATIONSHIP_REMOVE',
  WEBHOOKS_UPDATE: 'WEBHOOKS_UPDATE',
  CHANNEL_RECIPIENT_ADD: 'CHANNEL_RECIPIENT_ADD',
  CHANNEL_RECIPIENT_REMOVE: 'CHANNEL_RECIPIENT_REMOVE',
};

/**
 * The type of a message, e.g. `DEFAULT`. Here are the available types:
 * * DEFAULT
 * * RECIPIENT_ADD
 * * RECIPIENT_REMOVE
 * * CALL
 * * CHANNEL_NAME_CHANGE
 * * CHANNEL_ICON_CHANGE
 * * PINS_ADD
 * * GUILD_MEMBER_JOIN
 * * USER_PREMIUM_GUILD_SUBSCRIPTION
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3
 * * CHANNEL_FOLLOW_ADD
 * * GUILD_DISCOVERY_DISQUALIFIED
 * * GUILD_DISCOVERY_REQUALIFIED
 * @typedef {string} MessageType
 */
exports.MessageTypes = [
  'DEFAULT',
  'RECIPIENT_ADD',
  'RECIPIENT_REMOVE',
  'CALL',
  'CHANNEL_NAME_CHANGE',
  'CHANNEL_ICON_CHANGE',
  'PINS_ADD',
  'GUILD_MEMBER_JOIN',
  'USER_PREMIUM_GUILD_SUBSCRIPTION',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
  'CHANNEL_FOLLOW_ADD',
  // 13 isn't yet documented
  null,
  'GUILD_DISCOVERY_DISQUALIFIED',
  'GUILD_DISCOVERY_REQUALIFIED',
  'REPLY',
];

/**
 * The type of a message notification setting. Here are the available types:
 * * EVERYTHING
 * * MENTIONS
 * * NOTHING
 * * INHERIT (only for GuildChannel)
 * @typedef {string} MessageNotificationType
 */
exports.MessageNotificationTypes = [
  'EVERYTHING',
  'MENTIONS',
  'NOTHING',
  'INHERIT',
];

exports.DefaultAvatars = {
  BLURPLE: '6debd47ed13483642cf09e832ed0bc1b',
  GREY: '322c936a8c8be1b803cd94861bdfa868',
  GREEN: 'dd4dbc0016779df1378e7812eabaa04d',
  ORANGE: '0e291f67c9274a1abdddeb3fd919cbaa',
  RED: '1cbd08c76f8af6dddce02c5138971129',
};

exports.ExplicitContentFilterTypes = [
  'DISABLED',
  'NON_FRIENDS',
  'FRIENDS_AND_NON_FRIENDS',
];

exports.UserSettingsMap = {
  /**
   * Automatically convert emoticons in your messages to emoji
   * For example, when you type `:-)` Discord will convert it to 😃
   * @name ClientUserSettings#convertEmoticons
   * @type {boolean}
   */
  convert_emoticons: 'convertEmoticons',

  /**
   * If new guilds should automatically disable DMs between you and its members
   * @name ClientUserSettings#defaultGuildsRestricted
   * @type {boolean}
   */
  default_guilds_restricted: 'defaultGuildsRestricted',

  /**
   * Automatically detect accounts from services like Steam and Blizzard when you open the Discord client
   * @name ClientUserSettings#detectPlatformAccounts
   * @type {boolean}
   */
  detect_platform_accounts: 'detectPlatformAccounts',

  /**
   * Developer Mode exposes context menu items helpful for people writing bots using the Discord API
   * @name ClientUserSettings#developerMode
   * @type {boolean}
   */
  developer_mode: 'developerMode',

  /**
   * Allow playback and usage of the `/tts` command
   * @name ClientUserSettings#enableTTSCommand
   * @type {boolean}
   */
  enable_tts_command: 'enableTTSCommand',

  /**
   * The theme of the client. Either `light` or `dark`
   * @name ClientUserSettings#theme
   * @type {string}
   */
  theme: 'theme',

  /**
   * Last status set in the client
   * @name ClientUserSettings#status
   * @type {PresenceStatus}
   */
  status: 'status',

  /**
   * Display currently running game as status message
   * @name ClientUserSettings#showCurrentGame
   * @type {boolean}
   */
  show_current_game: 'showCurrentGame',

  /**
   * Display images, videos, and lolcats when uploaded directly to Discord
   * @name ClientUserSettings#inlineAttachmentMedia
   * @type {boolean}
   */
  inline_attachment_media: 'inlineAttachmentMedia',

  /**
   * Display images, videos, and lolcats when uploaded posted as links in chat
   * @name ClientUserSettings#inlineEmbedMedia
   * @type {boolean}
   */
  inline_embed_media: 'inlineEmbedMedia',

  /**
   * Language the Discord client will use, as an RFC 3066 language identifier
   * @name ClientUserSettings#locale
   * @type {string}
   */
  locale: 'locale',

  /**
   * Display messages in compact mode
   * @name ClientUserSettings#messageDisplayCompact
   * @type {boolean}
   */
  message_display_compact: 'messageDisplayCompact',

  /**
   * Show emoji reactions on messages
   * @name ClientUserSettings#renderReactions
   * @type {boolean}
   */
  render_reactions: 'renderReactions',

  /**
   * Array of snowflake IDs for guilds, in the order they appear in the Discord client
   * @name ClientUserSettings#guildPositions
   * @type {Snowflake[]}
   */
  guild_positions: 'guildPositions',

  /**
   * Array of snowflake IDs for guilds which you will not recieve DMs from
   * @name ClientUserSettings#restrictedGuilds
   * @type {Snowflake[]}
   */
  restricted_guilds: 'restrictedGuilds',

  explicit_content_filter: function explicitContentFilter(type) { // eslint-disable-line func-name-matching
    /**
     * Safe direct messaging; force people's messages with images to be scanned before they are sent to you.
     * One of `DISABLED`, `NON_FRIENDS`, `FRIENDS_AND_NON_FRIENDS`
     * @name ClientUserSettings#explicitContentFilter
     * @type {string}
     */
    return exports.ExplicitContentFilterTypes[type];
  },
  friend_source_flags: function friendSources(flags) { // eslint-disable-line func-name-matching
    /**
     * Who can add you as a friend
     * @name ClientUserSettings#friendSources
     * @type {Object}
     * @property {boolean} all Mutual friends and mutual guilds
     * @property {boolean} mutualGuilds Only mutual guilds
     * @property {boolean} mutualFriends Only mutual friends
     */
    return {
      all: flags?.all || false,
      mutualGuilds: flags?.all ? true : flags?.mutual_guilds || false,
      mutualFriends: flags?.all ? true : flags?.mutualFriends || false,
    };
  },
};

exports.UserGuildSettingsMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you
     * @name ClientUserGuildSettings#messageNotifications
     * @type {MessageNotificationType}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether to receive mobile push notifications
   * @name ClientUserGuildSettings#mobilePush
   * @type {boolean}
   */
  mobile_push: 'mobilePush',
  /**
   * Whether the guild is muted
   * @name ClientUserGuildSettings#muted
   * @type {boolean}
   */
  muted: 'muted',
  /**
   * Whether to suppress everyone mention
   * @name ClientUserGuildSettings#suppressEveryone
   * @type {boolean}
   */
  suppress_everyone: 'suppressEveryone',

  /**
   * Whether to suppress everyone mention
   * @name ClientUserGuildSettings#suppressEveryone
   * @type {boolean}
   */
  suppress_roles: 'suppressRoles',
  /**
   * A collection containing all the channel overrides
   * @name ClientUserGuildSettings#channelOverrides
   * @type {Collection<ClientUserChannelOverride>}
   */
  channel_overrides: 'channelOverrides',
};

exports.UserChannelOverrideMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you
     * @name ClientUserChannelOverride#messageNotifications
     * @type {MessageNotificationType}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether the channel is muted
   * @name ClientUserChannelOverride#muted
   * @type {boolean}
   */
  muted: 'muted',
};

exports.Colors = {
  DEFAULT: 0x000000,
  WHITE: 0xFFFFFF,
  AQUA: 0x1ABC9C,
  GREEN: 0x2ECC71,
  BLUE: 0x3498DB,
  PURPLE: 0x9B59B6,
  LUMINOUS_VIVID_PINK: 0xE91E63,
  GOLD: 0xF1C40F,
  ORANGE: 0xE67E22,
  RED: 0xE74C3C,
  GREY: 0x95A5A6,
  NAVY: 0x34495E,
  DARK_AQUA: 0x11806A,
  DARK_GREEN: 0x1F8B4C,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368A,
  DARK_VIVID_PINK: 0xAD1457,
  DARK_GOLD: 0xC27C0E,
  DARK_ORANGE: 0xA84300,
  DARK_RED: 0x992D22,
  DARK_GREY: 0x979C9F,
  DARKER_GREY: 0x7F8C8D,
  LIGHT_GREY: 0xBCC0C0,
  DARK_NAVY: 0x2C3E50,
  BLURPLE: 0x7289DA,
  GREYPLE: 0x99AAB5,
  DARK_BUT_NOT_BLACK: 0x2C2F33,
  NOT_QUITE_BLACK: 0x23272A,
};

/**
 * The value set for the verification levels for a guild:
 * * None
 * * Low
 * * Medium
 * * (╯°□°）╯︵ ┻━┻
 * * ┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻
 * @typedef {string} VerificationLevel
 */
exports.VerificationLevels = [
  'None',
  'Low',
  'Medium',
  '(╯°□°）╯︵ ┻━┻',
  '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻',
];

/**
 * An error encountered while performing an API request. Here are the potential errors:
 * * UNKNOWN_ACCOUNT
 * * UNKNOWN_APPLICATION
 * * UNKNOWN_CHANNEL
 * * UNKNOWN_GUILD
 * * UNKNOWN_INTEGRATION
 * * UNKNOWN_INVITE
 * * UNKNOWN_MEMBER
 * * UNKNOWN_MESSAGE
 * * UNKNOWN_OVERWRITE
 * * UNKNOWN_PROVIDER
 * * UNKNOWN_ROLE
 * * UNKNOWN_TOKEN
 * * UNKNOWN_USER
 * * UNKNOWN_EMOJI
 * * UNKNOWN_WEBHOOK
 * * BOT_PROHIBITED_ENDPOINT
 * * BOT_ONLY_ENDPOINT
 * * MAXIMUM_GUILDS
 * * MAXIMUM_FRIENDS
 * * MAXIMUM_PINS
 * * MAXIMUM_ROLES
 * * MAXIMUM_REACTIONS
 * * MAXIMUM_CHANNELS
 * * MAXIMUM_INVITES
 * * UNAUTHORIZED
 * * USER_BANNED
 * * MISSING_ACCESS
 * * INVALID_ACCOUNT_TYPE
 * * CANNOT_EXECUTE_ON_DM
 * * EMBED_DISABLED
 * * CANNOT_EDIT_MESSAGE_BY_OTHER
 * * CANNOT_SEND_EMPTY_MESSAGE
 * * CANNOT_MESSAGE_USER
 * * CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL
 * * CHANNEL_VERIFICATION_LEVEL_TOO_HIGH
 * * OAUTH2_APPLICATION_BOT_ABSENT
 * * MAXIMUM_OAUTH2_APPLICATIONS
 * * INVALID_OAUTH_STATE
 * * MISSING_PERMISSIONS
 * * INVALID_AUTHENTICATION_TOKEN
 * * NOTE_TOO_LONG
 * * INVALID_BULK_DELETE_QUANTITY
 * * CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL
 * * INVALID_OR_TAKEN_INVITE_CODE
 * * CANNOT_EXECUTE_ON_SYSTEM_MESSAGE
 * * INVALID_OAUTH_TOKEN
 * * BULK_DELETE_MESSAGE_TOO_OLD
 * * INVALID_FORM_BODY
 * * INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT
 * * INVALID_API_VERSION
 * * REACTION_BLOCKED
 * * RESOURCE_OVERLOADED
 * @typedef {string} APIError
 */
exports.APIErrors = {
  UNKNOWN_ACCOUNT: 10001,
  UNKNOWN_APPLICATION: 10002,
  UNKNOWN_CHANNEL: 10003,
  UNKNOWN_GUILD: 10004,
  UNKNOWN_INTEGRATION: 10005,
  UNKNOWN_INVITE: 10006,
  UNKNOWN_MEMBER: 10007,
  UNKNOWN_MESSAGE: 10008,
  UNKNOWN_OVERWRITE: 10009,
  UNKNOWN_PROVIDER: 10010,
  UNKNOWN_ROLE: 10011,
  UNKNOWN_TOKEN: 10012,
  UNKNOWN_USER: 10013,
  UNKNOWN_EMOJI: 10014,
  UNKNOWN_WEBHOOK: 10015,
  BOT_PROHIBITED_ENDPOINT: 20001,
  BOT_ONLY_ENDPOINT: 20002,
  MAXIMUM_GUILDS: 30001,
  MAXIMUM_FRIENDS: 30002,
  MAXIMUM_PINS: 30003,
  MAXIMUM_ROLES: 30005,
  MAXIMUM_REACTIONS: 30010,
  MAXIMUM_CHANNELS: 30013,
  MAXIMUM_INVITES: 30016,
  UNAUTHORIZED: 40001,
  USER_BANNED: 40007,
  MISSING_ACCESS: 50001,
  INVALID_ACCOUNT_TYPE: 50002,
  CANNOT_EXECUTE_ON_DM: 50003,
  EMBED_DISABLED: 50004,
  CANNOT_EDIT_MESSAGE_BY_OTHER: 50005,
  CANNOT_SEND_EMPTY_MESSAGE: 50006,
  CANNOT_MESSAGE_USER: 50007,
  CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008,
  CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009,
  OAUTH2_APPLICATION_BOT_ABSENT: 50010,
  MAXIMUM_OAUTH2_APPLICATIONS: 50011,
  INVALID_OAUTH_STATE: 50012,
  MISSING_PERMISSIONS: 50013,
  INVALID_AUTHENTICATION_TOKEN: 50014,
  NOTE_TOO_LONG: 50015,
  INVALID_BULK_DELETE_QUANTITY: 50016,
  CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019,
  INVALID_OR_TAKEN_INVITE_CODE: 50020,
  CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021,
  INVALID_OAUTH_TOKEN: 50025,
  BULK_DELETE_MESSAGE_TOO_OLD: 50034,
  INVALID_FORM_BODY: 50035,
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036,
  INVALID_API_VERSION: 50041,
  REACTION_BLOCKED: 90001,
  RESOURCE_OVERLOADED: 130000,
};

/**
 * Google Chrome v108 TLS ciphers
 * @see {@link https://tls.browserleaks.com/tls}
 * @see {@link https://github.com/yifeikong/curl-impersonate}
 * @typedef {Array<string>} Ciphers
 */
exports.ciphers = [
  'TLS_AES_128_GCM_SHA256',
  'TLS_AES_256_GCM_SHA384',
  'TLS_CHACHA20_POLY1305_SHA256',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-CHACHA20-POLY1305',
  'ECDHE-RSA-AES128-SHA',
  'ECDHE-RSA-AES256-SHA',
  'AES128-GCM-SHA256',
  'AES256-GCM-SHA384',
  'AES128-SHA',
  'AES256-SHA',
];

/**
 * The value set for a guild's default message notifications, e.g. `ALL`. Here are the available types:
 * * ALL
 * * MENTIONS
 * @typedef {string} DefaultMessageNotifications
 */
exports.DefaultMessageNotifications = [
  'ALL',
  'MENTIONS',
];

/**
 * The value set for a team members's membership state:
 * * INVITED
 * * ACCEPTED
 * @typedef {string} MembershipStates
 */
exports.MembershipStates = [
  // They start at 1
  null,
  'INVITED',
  'ACCEPTED',
];

/**
 * The value set for a webhook's type:
 * * Incoming
 * * Channel Follower
 * @typedef {string} WebhookTypes
 */
exports.WebhookTypes = [
  // They start at 1
  null,
  'Incoming',
  'Channel Follower',
];

/**
 * Relationship Enums:
 * * 0: NONE
 * * 1: FRIEND
 * * 2: BLOCKED
 * * 3: PENDING_INCOMING
 * * 4: PENDING_OUTGOING
 * * 5: IMPLICIT
 * @typedef {string} RelationshipTypes
 * @see {@link https://luna.gitlab.io/discord-unofficial-docs/relationships.html}
 */

exports.RelationshipTypes = createEnum([
  'NONE',
  'FRIEND',
  'BLOCKED',
  'PENDING_INCOMING',
  'PENDING_OUTGOING',
  'IMPLICIT',
]);

/**
 * All available nitro types:
 * * `NONE` - None
 * * `NITRO_CLASSIC` - Nitro Classic
 * * `NITRO_BOOST` - Nitro
 * * `NITRO_BASIC` - Nitro Basic
 * * `UNKNOWN` - Unknown
 * @typedef {string} NitroType
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-premium-types}
 */
exports.NitroType = createEnum(['NONE', 'NITRO_CLASSIC', 'NITRO_BOOST', 'NITRO_BASIC']);

function createEnum(keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}
/**
 * An overwrite type:
 * * role
 * * member
 * @typedef {string} OverwriteType
 * @see {@link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure}
 */
exports.OverwriteTypes = createEnum(['role', 'member']);
