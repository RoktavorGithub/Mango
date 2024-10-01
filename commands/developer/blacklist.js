const { ChatInputCommand } = require('../../classes/Commands');
const { ApplicationCommandOptionType } = require("discord.js")
const Blacklist = require("../../schemas/blacklistSchema");
const config = require("../../config");

module.exports = new ChatInputCommand({
    permLevel: "Developer",
    global: true,
    data: {
        description: "Disables the user's ability to use and utilize Mango.",
        options: [
            {
                name: "user",
                description: "The user to blacklist.",
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "action",
                description: "The action to take.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: "Add", value: "add" },
                    { name: "Check", value: "check" },
                    { name: "Remove", value: "remove" }
                ],
            },
            {
                name: "scope",
                description: "The scope of the blacklist.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: "Global", value: "global" },
                    { name: "Guild", value: "guild" }
                ],
            }
        ]
    },
  run: async (client, interaction) => {
    const {
        options
    } = interaction;
    const {
        emojis
    } = client.container;

    const user = options.getUser("user");
    const action = options.getString("action");
    const scope = options.getString("scope");

    // Check if the target is the bot, bot owner or bot developer
    if (user.id === client.user.id ||
        config.permissions.ownerId.includes(user.id) ||
        config.permissions.developers.includes(user.id)
    ) {
        return interaction.reply({ 
            content: `${emojis.error} You cannot blacklist the bot, the owner, or developers.`, 
            ephemeral: true 
        });
    };

    const isGlobal = scope === "global";
    const guildId = isGlobal ? null : interaction.guildId;

    switch (action) {
        case "add":
            let existingBlacklist;
            let newBlacklist;

            const globalBlacklist = await Blacklist.findOne({
                userId: user.id,
                isGlobal: true
            });

        if (globalBlacklist) {
            return interaction.reply({
                content: `${ emojis.error } ${user} is already blacklisted globally you can't blacklist him again via guild scope!`,
                ephemeral: true
            });
        };

        if (isGlobal) {
            existingBlacklist = await Blacklist.findOne({
                userId: user.id,
                isGlobal: true
            });

            if (existingBlacklist) {
                return interaction.reply({ content: `${emojis.error} ${user} is already blacklisted globally.`, ephemeral: true });
            }

            newBlacklist = {
                userId: user.id,
                isGlobal: true,
                guildId: null
            };
        } else {
            existingBlacklist = await Blacklist.findOne({
                userId: user.id,
                guildId: guildId
            });

            if (existingBlacklist) {
                return interaction.reply({ content: `${emojis.error} ${user} is already blacklisted in this server.`, ephemeral: true });
            }

            newBlacklist = {
                userId: user.id,
                guildId: guildId,
                isGlobal: false
            };
        };
            await Blacklist.create(newBlacklist);
            return interaction.reply({ content: `${ emojis.success } ${user} has been blacklisted ${isGlobal ? 'globally' : 'in this server'}.`, ephemeral: true });
        
        case "remove":
            const globalblacklist = await Blacklist.findOne({
                userId: user.id,
                isGlobal: true
            });
        
            const guildBlacklist = await Blacklist.findOne({
                userId: user.id,
                guildId: guildId
            });
        
            if (isGlobal) {
                if (!globalblacklist) {
                    return interaction.reply({ content: `${ emojis.error } ${user} is not blacklisted globally. ${guildBlacklist ? "They are blacklisted in this server. Use the guild-specific remove command instead." : ""}`, ephemeral: true });
                };
                await Blacklist.deleteOne({ _id: globalblacklist._id });
                return interaction.reply({ content: `${ emojis.success } ${user} has been removed from the global blacklist.`, ephemeral: true });
            } else {
                if (!guildBlacklist) {
                    return interaction.reply({ content: `${ emojis.error } ${user} is not blacklisted in this server. ${globalBlacklist ? "They are blacklisted globally. Use the global remove command instead." : ""}`, ephemeral: true });
                }
                await Blacklist.deleteOne({ _id: guildBlacklist._id });
                return interaction.reply({ content: `${ emojis.success } ${user} has been removed from this server's blacklist.`, ephemeral: true });
            };
        
        case "check":
            const blacklistedUser = await Blacklist.findOne({
                userId: user.id,
                ...(isGlobal ? { isGlobal: true } : { guildId: guildId }),
            });
            const isBlacklisted = !!blacklistedUser;
            const blacklistScope = blacklistedUser?.isGlobal ? "globally" : "in this server"
            return interaction.reply({ content: `${ emojis.clipboard } ${user} is ${isBlacklisted ? '' : 'not '}blacklisted ${isBlacklisted ? blacklistScope : ''}.`, ephemeral: true });
        default:
            return interaction.reply({ content: "Invalid action specified.", ephemeral: true });
    };
  },
});