const { ComponentCommand } = require('../../../classes/Commands');
const { LOCK_YES } = require("../../../constants");

module.exports = new ComponentCommand({
    //Additional Protection
    permLevel: "Administrator",
    // Command Name
    data: { name: LOCK_YES },
  run: async (client, interaction) => {
    const { emojis } = client.container;
    const { guild } = interaction;

    await interaction.deferReply();

    // Default Role
    const defaultRole = interaction.guild.roles.cache.find(role => role.name === "@everyone");
    await Promise.all(interaction.guild.channels.cache.filter(ch => !ch.isThread()).map(async (ch) => {
        const permissionOverwrites = ch.permissionOverwrites.cache.get(defaultRole.id);
        if (!permissionOverwrites) {
            const newPermissionOverwrites = [
                {
                    id: defaultRole.id,
                    deny: ["SendMessages"]
                },
            ];
            await ch.permissionOverwrites.set(newPermissionOverwrites);
        };
    }));

    await interaction.editReply({
        content: `${ emojis.success } This server is on lockdown!`
    });
  },
});
