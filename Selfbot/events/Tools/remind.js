module.exports = {
    name: "remind",
    once: false,
    run: async (data, client) => {
        client.data[`remind_${data.channelId}_${data.message}`] = setInterval(() => {
            const channel = client.channels.get(data.channelId);
            if (channel) channel.send(data.message).catch(() => false);
        }, data.time);
    }
}