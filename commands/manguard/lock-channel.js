const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const { LOCK_YES, LOCK_NO } = require("../../constants");

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
      description: "Lock channel/s using Manguard!" ,
      options: [
        {
            name: "channel",
            description: "Lock only 1 channel",
            type: ApplicationCommandOptionType.Channel,
            required: false
        },
    ]
    },
  run: async (client, interaction) => {
    const { emojis } = client.container;
    const { guild } = interaction;
    const channel = interaction.options.getChannel("channel");

    // Deferring the reply
    await interaction.deferReply();

    // Default Role
    const defaultRole = interaction.guild.roles.cache.find(role => role.name === "@everyone");

    if(!channel) {
      // Check if all channels are already locked
      const allChannelsLocked = await Promise.all(interaction.guild.channels.cache.filter(ch => !ch.isThread()).map(async (ch) => {
        const permissionOverwrites = ch.permissionOverwrites.cache.get(defaultRole.id);
        return permissionOverwrites ? permissionOverwrites.deny.has("SendMessages") : false;
      }));

      if (allChannelsLocked.every(locked => locked)) {
        return interaction.editReply({
          content: `${emojis.error} This server is already on lockdown!`
        });
      } else {
              // Verification Prompt
      const embed = new EmbedBuilder()
      .setTitle("⚠️ WARNING: Locking All Channels ⚠️")
      .setDescription("This will lock all channels in this server. Proceed?")
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Manguard Verification Prompt"
      });

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(LOCK_YES)
        .setLabel("Yes")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId(LOCK_NO)
        .setLabel("No")
        .setStyle(ButtonStyle.Success)
      );
      interaction.editReply({
        embeds: [embed],
        components: [row]
      });
      };
    } else {
      // Checking if the channel is already locked
    const permissionOverwrites = channel.permissionOverwrites.cache.get(defaultRole.id);
    if (permissionOverwrites) {
      return interaction.editReply({
        content: `${emojis.error} ${channel} is already locked!`
      });
    };

    // Update permissions ofr the default role
    const newPermissionOverwrites = [
      {
        id: defaultRole.id,
        deny: ["SendMessages"]
      }
    ];

    //Lock the channel
    await channel.permissionOverwrites.set(newPermissionOverwrites);
    await interaction.editReply({
      content: `${emojis.success} Locked ${channel}!`
        });
      };
    },
});