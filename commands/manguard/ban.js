const { ChatInputCommand } = require('../../classes/Commands');
const { BAN_USER_MODAL, BAN_USER_INPUT, BAN_USER } = require("../../constants");
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = new ChatInputCommand({
    clientPerms: ["BanMembers"],
    userPerms: ["BanMembers"],
    cooldown: {
        usages: 1,
        duration: 60,
        type: "global"
    },
    data: { description: "Ban a member using Manguard!" },
  run: async (client, interaction) => {
    // Ban Modal
    const banModal = new ModalBuilder()
    .setCustomId(BAN_USER_MODAL)
    .setTitle("Ban Credentials");

    // User To Ban
    const banMemberInput = new TextInputBuilder()
    .setCustomId(BAN_USER)
    .setLabel("Username")
    .setPlaceholder("Input user here...")
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

    // Ban Input
    const banInput = new TextInputBuilder()
    .setCustomId(BAN_USER_INPUT)
    .setLabel("Reason")
    .setPlaceholder("Input reason for ban here...")
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph);

    //Adding Modal Components
    const inputActionRow = new ActionRowBuilder().addComponents(banInput);
    const memberActionRow = new ActionRowBuilder().addComponents(banMemberInput);
    banModal.addComponents(memberActionRow, inputActionRow);

    await interaction.showModal(banModal);
  }
});