const logger = require('@mirasaki/logger');
const chalk = require('chalk');
const mongoose = require("mongoose");

module.exports = async (client) => {
  // Logging our process uptime to the developer
  const upTimeStr = chalk.yellow(`${ Math.floor(process.uptime()) || 1 } second(s)`);

  // MongoDB
  const { MONGODB_URL } = process.env;
  if (!MONGODB_URL) return;

  await mongoose.connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 60000
  });
  logger.success(`Connected to MongoDB!`);

  logger.success(`Client logged in as ${
    chalk.cyanBright(client.user.username)
  }${
    chalk.grey(`#${ client.user.discriminator }`)
  } after ${ upTimeStr }`);

  // Calculating the membercount
  const memberCount = client.guilds.cache.reduce(
    (previousValue, currentValue) => previousValue += currentValue.memberCount, 0
  ).toLocaleString('en-US');

  // Getting the server count
  const serverCount = (client.guilds.cache.size).toLocaleString('en-US');

  // Logging counts to developers
  logger.info(`Ready to serve ${ memberCount } members across ${ serverCount } servers!`);
};
