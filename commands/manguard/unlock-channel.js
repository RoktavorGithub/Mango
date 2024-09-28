const { ChatInputCommand } = require('../../classes/Commands');
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = new ChatInputCommand({
    permLevel: "Administrator",
    clientPerms: ["Administrator"],
    userPerms: ["Administrator"],
    cooldown: {
        usages: 1,
        duration: 60,
        type: "global"
    },
    data: { 
      description: "Unlock channel/s using Manguard!" ,
      options: [
        {
            name: "channel",
            description: "Unlock only 1 channel",
            type: ApplicationCommandOptionType.Channel,
            required: false
        },
    ]
    },
  run: async (client, interaction) => {
    const { emojis } = client.container;
    const { guild } = interaction;
    const channel = interaction.options.getChannel("channel");

    await interaction.deferReply();

    // Default Role
    const defaultRole = interaction.guild.roles.cache.find(role => role.name === "@everyone");
    if (!interaction.guild || !interaction.guild.channels.cache) {
        return interaction.editReply(`${emojis.error} | This command can only be used in a server`)
    }

    if (!channel) {
        //Check if all channels are already unlocked
        const allChannelsUnlocked = await Promise.all(interaction.guild.channels.cache.filter(ch => !ch.isThread()).map(async (ch) => {
                const permissionOverwrites = ch.permissionOverwrites.cache.get(defaultRole.id);
                return !permissionOverwrites || !permissionOverwrites.deny.has("SendMessages");
        }));

        if (!allChannelsUnlocked.includes(false)) {
            return interaction.editReply({
                content: `${ emojis.error } All the channels in this server are unlocked!`
            });


        };

         // Unlock all channels
        await Promise.all(interaction.guild.channels.cache.filter(ch => !ch.isThread()).map(async (ch) => {
            const permissionOverwrites = ch.permissionOverwrites.cache.get(defaultRole.id);
            if (permissionOverwrites) {
                await ch.permissionOverwrites.delete(defaultRole.id);
            }
        }));
        await interaction.editReply({
            content: `${emojis.success} Lifted server lockdown!`
                });
        } else {
        // Checking if the channel is unlocked
        const permissionOverwrites = channel.permissionOverwrites.cache.get(defaultRole.id);
        // Checking if the channel is already unlocked
        if (!permissionOverwrites) {
            return interaction.editReply({
                content: `${emojis.error} ${channel} is already unlocked!`
            });
        };
            await channel.permissionOverwrites.delete(defaultRole);
            await interaction.editReply({
                content: `${ emojis.success } Unlocked ${channel}!`
                });
        };
    },
});