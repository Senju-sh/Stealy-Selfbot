"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEmbedChannel = exports.loadBans = exports.loadEmojis = exports.loadAFK = exports.loadChannels = exports.loadRoles = exports.loadConfig = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("./util");
/**
 * Restores the guild configuration
 */
const loadConfig = (guild, backupData) => {
    const configPromises = [];
    if (backupData.name) {
        configPromises.push(guild.setName(backupData.name));
    }
    if (backupData.iconBase64) {
        configPromises.push(guild.setIcon(Buffer.from(backupData.iconBase64, 'base64')));
    }
    else if (backupData.iconURL) {
        configPromises.push(guild.setIcon(backupData.iconURL));
    }
    if (backupData.splashBase64) {
        configPromises.push(guild.setSplash(Buffer.from(backupData.splashBase64, 'base64')));
    }
    else if (backupData.splashURL) {
        configPromises.push(guild.setSplash(backupData.splashURL));
    }
    if (backupData.bannerBase64) {
        configPromises.push(guild.setBanner(Buffer.from(backupData.bannerBase64, 'base64')));
    }
    else if (backupData.bannerURL) {
        configPromises.push(guild.setBanner(backupData.bannerURL));
    }
    if (backupData.verificationLevel) {
        configPromises.push(guild.setVerificationLevel(backupData.verificationLevel));
    }
    if (backupData.defaultMessageNotifications) {
        configPromises.push(guild.setDefaultMessageNotifications(backupData.defaultMessageNotifications));
    }
    const changeableExplicitLevel = guild.features.includes(discord_js_1.GuildFeature.Community);
    if (backupData.explicitContentFilter && changeableExplicitLevel) {
        configPromises.push(guild.setExplicitContentFilter(backupData.explicitContentFilter));
    }
    return Promise.all(configPromises);
};
exports.loadConfig = loadConfig;
/**
 * Restore the guild roles
 */
const loadRoles = async (guild, backupData) => {
    const createdRoles = [];
    
    // Sort roles by position to maintain hierarchy (highest position first)
    const sortedRoles = backupData.roles.sort((a, b) => (b.position || 0) - (a.position || 0));
    
    // First, edit the @everyone role
    const everyoneRole = sortedRoles.find(role => role.isEveryone);
    if (everyoneRole) {
        try {
            await guild.roles.get(guild.id).edit({
                name: everyoneRole.name,
                color: everyoneRole.color,
                permissions: everyoneRole.permissions,
                mentionable: everyoneRole.mentionable
            });
        } catch (error) {
            console.log(`Error editing @everyone role:`, error.message);
        }
    }
    
    // Then create other roles sequentially to maintain proper hierarchy
    for (const roleData of sortedRoles) {
        if (!roleData.isEveryone) {
            try {
                const createdRole = await guild.createRole({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    permissions: roleData.permissions,
                    mentionable: roleData.mentionable
                });
                createdRoles.push(createdRole);
                
                // Add delay between role creations to avoid rate limits
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                console.log(`Error creating role ${roleData.name}:`, error.message);
            }
        }
    }
    
    return createdRoles;
};
exports.loadRoles = loadRoles;
/**
 * Restore the guild channels
 */
const loadChannels = async (guild, backupData, options) => {
    const allCreations = [];

    for (const categoryData of backupData.channels.categories.values()) {
        const createdCategory = await util_1.loadCategory(categoryData, guild);
        await new Promise(r => setTimeout(r, 500));

        const sortedChildren = categoryData.children.sort((a, b) => (a.position || 0) - (b.position || 0));
        
        for (const channelData of sortedChildren.values()) {
            allCreations.push(async () => {
                util_1.loadChannel(channelData, guild, createdCategory, options)
            });
        }
    }

    const sortedOthers = backupData.channels.others.sort((a, b) => (a.position || 0) - (b.position || 0));
    
    sortedOthers.forEach((channelData) => {
        allCreations.push(async () => {
            util_1.loadChannel(channelData, guild, null, options);
        });
    });

    for (let i = 0; i < allCreations.length; i += 4) {
        const batch = allCreations.slice(i, i + 4);
        await Promise.all(batch.map(fn => fn()));
        await new Promise(r => setTimeout(r, 4000));
    }
};
exports.loadChannels = loadChannels;
/**
 * Restore the afk configuration
 */
const loadAFK = (guild, backupData) => {
    const afkPromises = [];
    if (backupData.afk) {
        afkPromises.push(guild.setAFKChannel(guild.channels.find((ch) => ch.name === backupData.afk.name && ch.type === discord_js_1.ChannelType.GuildVoice)));
        afkPromises.push(guild.setAFKTimeout(backupData.afk.timeout));
    }
    return Promise.all(afkPromises);
};
exports.loadAFK = loadAFK;
/**
 * Restore guild emojis
 */
const loadEmojis = (guild, backupData) => {
    const emojiPromises = [];
    backupData.emojis.forEach((emoji) => {
        if (emoji.url) {
            emojiPromises.push(guild.createEmoji(
                emoji.url,
                emoji.name
            ));
        }
        else if (emoji.base64) {
            emojiPromises.push(guild.createEmoji(
                Buffer.from(emoji.base64, 'base64'),
                emoji.name,
            ));
        }
    });
    return Promise.all(emojiPromises);
};
exports.loadEmojis = loadEmojis;
/**
 * Restore guild bans
 */
const loadBans = (guild, backupData) => {
    const banPromises = [];
    backupData.bans.forEach((ban) => {
        banPromises.push(guild.members.ban(ban.id, {
            reason: ban.reason
        }));
    });
    return Promise.all(banPromises);
};
exports.loadBans = loadBans;
/**
 * Restore embedChannel configuration
 */
const loadEmbedChannel = (guild, backupData) => {
    const embedChannelPromises = [];
    if (backupData.widget.channel) {
        embedChannelPromises.push(guild.setWidgetSettings({
            enabled: backupData.widget.enabled,
            channel: guild.channels.find((ch) => ch.name === backupData.widget.channel)
        }));
    }
    return Promise.all(embedChannelPromises);
};
exports.loadEmbedChannel = loadEmbedChannel;

/**
 * Restore community settings
 */
const loadCommunity = async (guild, backupData) => {
    if (!backupData.community) return;
    
    const rulesChannelData = backupData.channels.categories.find(c => c.children.rulesChannel) || backupData.channels.others.find(c => c.rulesChannel);
    const publicUpdatesChannelData = backupData.channels.categories.find(c => c.children.publicUpdatesChannel) || backupData.channels.others.find(c => c.publicUpdatesChannel);

    let rulesChannel;
    let publicUpdatesChannel;

    try {
        const isCommunityEnabled = guild.features.includes('COMMUNITY');
        const shouldBeCommunityEnabled = backupData.community.enabled;
        
        if (shouldBeCommunityEnabled && !isCommunityEnabled) {
            if (!rulesChannel && backupData.community.rulesChannelID)
                rulesChannel = guild.channels.find(ch => ch.name == rulesChannelData?.name || ch.type === 'text');

            if (!publicUpdatesChannel && backupData.community.publicUpdatesChannelID)
                publicUpdatesChannel = guild.channels.filter(ch => ch.name == publicUpdatesChannelData?.name || ch.type === 'text' && ch.id !== rulesChannel?.id).first();

            if (rulesChannel && publicUpdatesChannel) {
                try {
                    await guild.setCommunity(true, 'Stealy - Backup', rulesChannel, publicUpdatesChannel);
                    await new Promise(r => setTimeout(r, 3000));
                } catch (error) {
                    false
                }
            }    
            } 
            else if (shouldBeCommunityEnabled && isCommunityEnabled) {
                const currentRulesChannel = guild.rulesChannel;
                const currentPublicUpdatesChannel = guild.publicUpdatesChannel;

                let newRulesChannel = null;
                let newPublicUpdatesChannel = null;


                if (backupData.community.rulesChannelID) 
                    newRulesChannel = guild.channels.find(ch => ch.name == rulesChannelData?.name);

                if (backupData.community.publicUpdatesChannelID)
                    newPublicUpdatesChannel = guild.channels.find(ch => ch.name == publicUpdatesChannelData?.name);


                const rulesChannelChanged = newRulesChannel && currentRulesChannel?.id !== newRulesChannel.id;
                const updatesChannelChanged = newPublicUpdatesChannel && currentPublicUpdatesChannel?.id !== newPublicUpdatesChannel.id;
                
                if ((rulesChannelChanged || updatesChannelChanged) && newRulesChannel && newPublicUpdatesChannel) {
                    try {
                        await fetch(`https://discord.com/api/v9/guilds/${guild.id}`, {
                            "headers": {
                                "authorization": guild.client.token,
                                "content-type": "application/json",
                             },
                            "body": JSON.stringify({ description: guild.description ?? null, features: guild.features, preferred_locale: guild.preferredLocale, rules_channel_id: newRulesChannel.id, public_updates_channel_id: newPublicUpdatesChannel.id, safety_alerts_channel_id: null }),
                            "method": "PATCH"
                        });
                    } catch (error) { false }
                    currentPublicUpdatesChannel.delete().catch(() => false);
                    currentRulesChannel.delete().catch(() => false);
                }
            }
            else if (!shouldBeCommunityEnabled && isCommunityEnabled) 
                await guild.setCommunity(false, 'Stealy - Backup');
    } catch (error) {
        false
    }
};
exports.loadCommunity = loadCommunity;
