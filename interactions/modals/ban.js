const { ComponentCommand } = require("../../classes/Commands");
const { BAN_USER_MODAL, BAN_USER_INPUT, BAN_USER } = require("../../constants");

module.exports = new ComponentCommand({
    data: { name: BAN_USER_MODAL },
    run: async (client, interaction) => {
        const { guild } = interaction;
        const { emojis } = client.container;
        
        // Deferring Reply
        await interaction.deferReply();

        //Inputs
        const reasonInput = interaction.fields.getTextInputValue(BAN_USER_INPUT);
        const userInput = interaction.fields.getTextInputValue(BAN_USER);

        // Fetch user by username
        const user = (await guild.members.search({
            query: userInput,
            limit: 1
        })).first();

            if (!user) {
                return interaction.editReply({
                    content: `${ emojis.error } Manguard is unable to ban the user for the following reasons: \n- The mentioned user is invalid. \n- Something went wrong with the process. (Try again later or try contacting one of the developers) \n- Incorrect naming format. (Must be username) \n- The user isn't in the server prior to this action.`
                });
            };
            try {
                await guild.members.ban(user, {
                    reason: reasonInput
                });
                await interaction.editReply({
                    content: `${ emojis.success } Ban Case: \n- **User:** ***${ user }*** \n- **Reason:** ***${ reasonInput }***`
                });
            } catch (error) {
                return interaction.editReply({
                    content: `${ emojis.error } Manguard is unable to ban the user for the following reasons: \n- The mentioned user is invalid. \n- Something went wrong with the process. (Try again later or try contacting one of the developers) \n- Incorrect naming format. (Must be username) \n- The user isn't in the server prior to this action.`
                });
            };
    },
});