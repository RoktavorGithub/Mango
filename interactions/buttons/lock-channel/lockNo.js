const { ComponentCommand } = require('../../../classes/Commands');
const { LOCK_NO } = require("../../../constants");

module.exports = new ComponentCommand({
     //Additional Protection
    permLevel: "Administrator",
    // Command Name
    data: { name: LOCK_NO },
  run: async (client, interaction) => {
    const { emojis } = client.container;
    await interaction.deferReply();
    await interaction.editReply({
        content: `${ emojis.error } Lockdown cancelled.`
    });
  }
});