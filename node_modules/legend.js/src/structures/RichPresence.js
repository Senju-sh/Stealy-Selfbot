const { ActivityTypes } = require('../util/Constants');
const { resolvePartialEmoji } = require('../util/Util');
const crypto = require('crypto');
// eslint-disable-next-line
const getUUID = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ ((Math.random() * 16) >> (a / 4))).toString(16));
// Function check url valid (ok copilot)
// eslint-disable-next-line
const checkUrl = url => {
    try {
        return new URL(url);
    } catch {
        return false;
    }
};

class CustomStatus {
    /**
     * @typedef {Object} CustomStatusOptions
     * @property {string} [state] The state to be displayed
     * @property {EmojiIdentifierResolvable} [emoji] The emoji to be displayed
     */

    /**
     * @param {CustomStatus|CustomStatusOptions} [data={}] CustomStatus to clone or raw data
     */
    constructor(data = {}) {
        this.name = 'Custom Status';
        /**
         * The emoji to be displayed
         * @type {?EmojiIdentifierResolvable}
         */
        this.emoji = null;
        this.type = ActivityTypes.CUSTOM_STATUS;
        /**
         * The state to be displayed
         * @type {?string}
         */
        this.state = null;
        this.details = null;
        this.setup(data);
    }
    /**
     * Sets the status from a JSON object
     * @param {CustomStatus|CustomStatusOptions} data CustomStatus to clone or raw data
     * @private
     */
    setup(data) {
        this.emoji = data.emoji ? resolvePartialEmoji(data.emoji) : null;
        this.state = data.state;
        this.details = data.details;
    }
    /**
     * Set the emoji of this activity
     * @param {EmojiIdentifierResolvable} emoji The emoji to be displayed
     * @returns {CustomStatus}
     */
    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }
    /**
     * Set state of this activity
     * @param {string | null} state The state to be displayed
     * @returns {CustomStatus}
     */
    setState(state) {
        this.state = state;
        return this;
    }

    /**
     * The details of the activity
     * * @param {string | null} details The details to be displayed
     * @returns {CustomStatus} 
    */
    setDetails(details) {
        this.details = details;
        return this;
    }

    /**
     * Returns an object that can be used to set the status
     * @returns {CustomStatus}
     */
    toJSON() {
        if (!this.emoji & !this.state) throw new Error('CustomStatus must have at least one of emoji or state');
        return {
            name: this.name,
            emoji: this.emoji,
            type: this.type,
            details: this.details,
            state: this.state,
        };
    }

    toDiscord() {
        if (!this.emoji & !this.state) throw new Error('CustomStatus must have at least one of emoji or state');
        return {
            name: this.name,
            emoji: this.emoji,
            type: this.type,
            details: this.details,
            state: this.state,
        }
    }
}

class RichPresence {
    /**
     * @param {Client} client Discord client
     * @param {RichPresence} [data={}] RichPresence to clone or raw data
     */
    constructor(client, data = {}) {
        Object.defineProperty(this, 'client', { value: client });
        /**
         * The activity's name
         * @type {string}
         */
        this.name = null;
        /**
         * The activity status's type
         * @type {ActivityType}
         */
        this.type = ActivityTypes.PLAYING;
        /**
         * If the activity is being streamed, a link to the stream
         * @type {?string}
         */
        this.url = null;
        /**
         * The id of the application associated with this activity
         * @type {?Snowflake}
         */
        this.application_id = null;
        /**
         * State of the activity
         * @type {?string}
         */
        this.state = null;
        /**
         * Details about the activity
         * @type {?string}
         */
        this.details = null;
        /**
         * Party of the activity
         * @type {?ActivityParty}
         */
        this.party = null;
        /**
         * Timestamps for the activity
         * @type {?ActivityTimestamps}
         */
        this.timestamps = null;
        /**
         * Assets for rich presence
         * @type {?RichPresenceAssets}
         */
        this.assets = null;
        /**
         * The labels of the buttons of this rich presence
         * @type {string[]}
         */
        this.buttons = null;
        this.flags = null;
        this.platform = null;
        this.session_id = null;
        this.setup(data);
    }
    /**
     * Sets the status from a JSON object
     * @param {RichPresence} data data
     * @private
     */
    setup(data) {
        this.name = data.name;
        this.type = typeof data.type != 'number' ? ActivityTypes[data.type?.toUpperCase()] : data.type;
        this.application_id = data.application_id;
        this.url = data.url;
        this.state = data.state;
        this.details = data.details;
        this.party = data.party;
        this.timestamps = data.timestamps;
        this.created_at = data.created_at;
        this.secrets = data.secrets;
        this.flags = data.flags;
        this.assets = data.assets;
        this.buttons = data.buttons;
        this.metadata = data.metadata;
        this.platform = data.platform;
        this.session_id = data.session_id;
    }
    /**
     * Set the large image of this activity
     * @param {?Snowflake} image The large image asset's id
     * @returns {RichPresence}
     */
    setAssetsLargeImage(image) {
        if (!(this.assets instanceof Object)) this.assets = {};
        if (typeof image != "string") {
            image = null;
        } else if (['http:', 'https:'].includes(checkUrl(image)?.protocol)) {
            image = image
                .replace('https://cdn.discordapp.com/', 'mp:')
                .replace('http://cdn.discordapp.com/', 'mp:')
                .replace('https://media.discordapp.net/', 'mp:')
                .replace('http://media.discordapp.net/', 'mp:');
        }
        this.assets.large_image = image;
        return this;
    }
    /**
     * Set the small image of this activity
     * @param {?Snowflake} image The small image asset's id
     * @returns {RichPresence}
     */
    setAssetsSmallImage(image) {
        if (!(this.assets instanceof Object)) this.assets = {};
        if (image === null || image === "null") image = null;
        this.assets.small_image = image;
        return this;
    }
    /**
     * Hover text for the large image
     * @param {string} text Assets text
     * @returns {RichPresence}
     */
    setAssetsLargeText(text) {
        if (typeof this.assets !== 'object') this.assets = {};
        this.assets.large_text = text;
        return this;
    }
    /**
     * Hover text for the small image
     * @param {string} text Assets text
     * @returns {RichPresence}
     */
    setAssetsSmallText(text) {
        if (typeof this.assets !== 'object') this.assets = {};
        this.assets.small_text = text;
        return this;
    }
    /**
     * Set the name of the activity
     * @param {?string} name The activity's name
     * @returns {RichPresence}
     */
    setName(name) {
        this.name = name;
        return this;
    }
    /**
     * If the activity is being streamed, a link to the stream
     * @param {?string} url URL of the stream
     * @returns {RichPresence}
     */
    setURL(url) {
        if (typeof url == 'string' && !checkUrl(url)) throw new Error('URL must be a valid URL');
        if (typeof url != 'string') url = null;
        this.url = url;
        return this;
    }
    /**
     * The activity status's type
     * @param {?ActivityTypes} type The type of activity
     * @returns {RichPresence}
     */
    setType(type) {
        this.type = ActivityTypes[type?.toUpperCase()];
        if (typeof this.type == 'string') this.type = ActivityTypes[this.type];
        if (typeof this.type != 'number') throw new Error('Type must be a valid ActivityType');
        return this;
    }
    /**
     * Set the application id of this activity
     * @param {?Snowflake} id Bot's id
     * @returns {RichPresence}
     */
    setApplicationId(id) {
        this.application_id = id;
        return this;
    }
    /**
     * Set the state of the activity
     * @param {?string} state The state of the activity
     * @returns {RichPresence}
     */
    setState(state) {
        this.state = state;
        return this;
    }
    /**
     * Set the details of the activity
     * @param {?string} details The details of the activity
     * @returns {RichPresence}
     */
    setDetails(details) {
        this.details = details;
        return this;
    }
    /**
     * @typedef {Object} RichParty
     * @property {string} id The id of the party
     * @property {number} size The maximum number of members in the party
     */
    /**
     * Set the party of this activity
     * @param {?RichParty} party The party to be displayed
     * @returns {RichPresence}
     */
    setParty(party) {
        if (typeof party == 'object') {
            if (!party.id || typeof party.id != 'string') party.id = getUUID();
            this.party = {
                size: party.size,
                id: party.id,
            };
        } else {
            this.party = null;
        }
        return this;
    }
    /**
     * Sets the start timestamp of the activity
     * @param {?number} timestamp The timestamp of the start of the activity
     * @returns {RichPresence}
     */
    setStartTimestamp(timestamp) {
        if (!this.timestamps) this.timestamps = {};
        this.timestamps.start = timestamp;
        return this;
    }
    /**
     * Sets the end timestamp of the activity
     * @param {?number} timestamp The timestamp of the end of the activity
     * @returns {RichPresence}
     */
    setEndTimestamp(timestamp) {
        if (!this.timestamps) this.timestamps = {};
        this.timestamps.end = timestamp;
        return this;
    }
    /**
     * @typedef {object} RichButton
     * @property {string} name The name of the button
     * @property {string} url The url of the button
     */
    /**
     * Set the buttons of the rich presence
     * @param  {...?RichButton} button A list of buttons to set
     * @returns {RichPresence}
     */
    setButtons(...button) {
        if (button.length == 0) {
            this.buttons = null;
            delete this.metadata;
            return this;
        } else if (button.length > 2) {
            throw new Error('RichPresence can only have up to 2 buttons');
        }
        this.buttons = [];
        this.metadata = {
            button_urls: [],
        };
        button.flat(2).forEach(b => {
            if (b.name && b.url) {
                this.buttons.push(b.name);
                if (!checkUrl(b.url)) throw new Error('Button url must be a valid url');
                this.metadata.button_urls.push(b.url);
            } else {
                throw new Error('Button must have name and url');
            }
        });
        return this;
    }
    /**
     * Add a button to the rich presence
     * @param {string} name The name of the button
     * @param {string} url The url of the button
     * @returns {RichPresence}
     */
    addButton(name, url) {
        if (!name || !url) {
            throw new Error('Button must have name and url');
        }
        if (typeof name !== 'string') throw new Error('Button name must be a string');
        if (!checkUrl(url)) throw new Error('Button url must be a valid url');
        if (!this.buttons) {
            this.buttons = [];
            this.metadata = {
                button_urls: [],
            };
        }
        this.buttons.push(name);
        this.metadata.button_urls.push(url);
        return this;
    }

    setFlags(flags) {
        this.flags = flags;
        return this;
    }
    /**
   * The platform the activity is being played on
   * @param {ActivityPlatform | null} platform Any platform
   * @returns {RichPresence}
   */
    setPlatform(platform) {
        this.platform = platform;
        return this;
    }

    setSessionId(sessionId) {
        this.session_id = sessionId;
        return this;
    }

    /**
     * Converts the rich presence to a JSON object
     * @returns {RichPresence}
     */
    toJSON() {
        return {
            name: this.name,
            type: this.type ?? 0,
            application_id: this.application_id,
            url: this.url,
            state: this.state,
            details: this.details,
            party: this.party,
            timestamps: this.timestamps,
            secrets: this.secrets,
            assets: this.assets,
            buttons: this.buttons,
            metadata: this.metadata,
            flags: this.flags,
            platform: this.platform,
            session_id: this.session_id
        };
    }
    /**
   * @typedef {Object} ExternalAssets
   * @property {?string} url Orginal url of the image
   * @property {?string} external_asset_path Proxy url of the image (Using to RPC)
   */

    /**
     * Get Assets from a RichPresence (Util)
     * @param {Client} client Discord Client
     * @param {Snowflake} applicationId Application id
     * @param {string} image1 URL image 1 (not from Discord)
     * @param {string} image2 URL image 2 (not from Discord)
     * @returns {ExternalAssets[]}
     */
    static async getExternal(client, applicationId, image1 = '', image2 = '') {
        if (!client || !client.token) throw new Error('Client must be set');
        // Check if applicationId is discord snowflake (17 , 18, 19 numbers)
        if (!/^[0-9]{17,19}$/.test(applicationId)) {
            throw new Error('Application id must be a Discord Snowflake');
        }
        // Check if large_image is a valid url
        if (image1 && image1.length > 0 && !checkUrl(image1)) {
            throw new Error('Image 1 must be a valid url');
        }
        // Check if small_image is a valid url
        if (image2 && image2.length > 0 && !checkUrl(image2)) {
            throw new Error('Image 2 must be a valid url');
        }
        const data_ = [];
        if (image1) data_.push(image1);
        if (image2) data_.push(image2);
        return client.rest.methods.postExternalAssets(applicationId, data_);
    }

    /**
     * Converts the rich presence to a Discord Game object
     * @returns {RichPresence}
     */
    toDiscord() {
        return {
            game: {
                name: this.name,
                type: this.type ?? 0,
                application_id: this.application_id,
                url: this.url,
                state: this.state,
                details: this.details,
                party: this.party,
                timestamps: this.timestamps,
                secrets: this.secrets,
                assets: this.assets,
                buttons: this.buttons,
                metadata: this.metadata,
                flags: this.flags,
                platform: this.platform,
                session_id: this.session_id,
            }
        }
    }
}

/**
 * @extends {RichPresence}
 */
class SpotifyRPC extends RichPresence {
    /**
     * Create a new RichPresence (Spotify style)
     * @param {Client} client Discord Client
     * @param {SpotifyRPC} [options] Options for the Spotify RPC
     */
    constructor(client, options = {}) {
        if (!client) throw new Error('Client must be set');
        super(client, options);
        this.setup(options);
    }

    /**
     * Sets the status from a JSON object
     * @param {SpotifyRPC} options data
     * @private
     */

    setup(options) {

        this.name = 'Spotify';
        
        this.type = 2;

        this.details = options.details;

        this.state = options.state;

        this.assets = options.assets;

        this.metadata = options.metadata;

        this.buttons = options.buttons;

        this.timestamps = options.timestamps;


        this.party = {
            id: `spotify:${this.client.user?.id}`,
        };

        /**
         * The Spotify song's id
         * @type {?string}
         */

        this.sync_id = options.sync_id;

        /**
         * The activity's id
         * @type {string}
         */

        this.id = 'spotify:1';

        /**
         * Creation date of the activity
         * @type {number}
         */

        this.created_at = Date.now();

        /**
         * Flags that describe the activity
         * @type {ActivityFlags}
         */

        this.flags = 48; // Sync + Play (ActivityFlags)

        /**
         * The game's or Spotify session's id
         * @type {?string}
         */

        this.session_id = this.client.ws?.connection?.sessionID;



        this.secrets = {
            join: crypto.randomBytes(20).toString('hex'),
            spectate: crypto.randomBytes(20).toString('hex'),
            match: crypto.randomBytes(20).toString('hex'),
        };
    }

    /**
     * Set the large image of this activity
     * @param {?string} image Spotify song's image ID
     * @returns {SpotifyRPC}
     */

    setAssetsLargeImage(image) {
        //if (image.startsWith('spotify:')) image = image.replace('spotify:', '');
        super.setAssetsLargeImage(`${image}`);
        return this;
    }

    /**
     * Set the small image of this activity
     * @param {?string} image Spotify song's image ID
     * @returns {RichPresence}
     */

    setAssetsSmallImage(image) {
        //if (image.startsWith('spotify:')) image = image.replace('spotify:', '');
        super.setAssetsSmallImage(`${image}`);
        return this;
    }

    /**
     * Set Spotify song id to sync with
     * @param {string} id Song id
     * @returns {SpotifyRPC}
     */

    setSongId(id) {
        this.sync_id = id;
        return this;
    }



    /**
     * Convert the rich presence to a JSON object
     * @returns {SpotifyRPC}
     */

    toJSON() {
        if (!this.sync_id) throw new Error('Song id is required');

        return {
            name: 'Spotify',
            type: ActivityTypes.LISTENING,
            application_id: this.application_id,
            url: this.url,
            state: this.state,
            details: this.details,
            party: this.party,
            timestamps: this.timestamps,
            secrets: this.secrets,
            assets: this.assets,
            session_id: this.session_id,
            sync_id: this.sync_id,
            flags: this.flags,
            id: this.id,
            created_at: this.created_at,
            metadata: this.metadata,
        };
    }

    /**
     * Converts the rich presence to a Discord Game object
     * @returns {RichPresence}
     */

    toDiscord() {
        if (!this.sync_id) throw new Error('Song id is required');
        return {
            game: {
                name: 'Spotify',
                type: ActivityTypes.LISTENING,
                application_id: this.application_id,
                url: this.url,
                state: this.state,
                details: this.details,
                party: this.party,
                timestamps: this.timestamps,
                secrets: this.secrets,
                assets: this.assets,
                session_id: this.session_id,
                sync_id: this.sync_id,
                flags: this.flags,
                id: this.id,
                created_at: this.created_at,
                metadata: this.metadata,
            }
        }
    }
}


module.exports = {
    CustomStatus,
    RichPresence,
    SpotifyRPC,
    getUUID,
};