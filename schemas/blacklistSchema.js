const { Schema, model } = require("mongoose");

const BlacklistSchema = new Schema({
    userId: { type: String, required: true },
    guildId: { type: String, default: null },
    isGlobal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
});

// Server Blacklists
BlacklistSchema.index({ userId: 1, guildId: 1 }, { 
    unique: true,
    partialFilterExpression: { guildId: { $type: "string" } }
});

// Global Blacklists
BlacklistSchema.index({
    userId: 1,
    isGlobal: 1
}, {
    unique: true,
    partialFilterExpression: { isGlobal: true }
});

module.exports = model("Blacklist", BlacklistSchema);
