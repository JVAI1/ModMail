module.exports = {
  name: "bind",
  async execute(param, message, args){
    const Discord = param.Discord;
    const moment = param.moment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const ThreadDB = param.ThreadDB;
    const bind = param.bind;

    const mainServerID = config.mainServerID;
    const mainServer = await client.guilds.get(mainServerID);
    const threadServerID = config.threadServerID;
    const threadServer = await client.guilds.get(threadServerID);

    const userID = args.shift();
    const channelID = args.shift();
    const isThread = await ThreadDB.findOne({where: {userID: userID}});
    const isSame = await ThreadDB.findOne({where: {channelID: channelID}});

    const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Binded <@${userID}> (\`${userID}\`) thread to <#${channelID}>.`);
    const sameChannelEmbed = getEmbed.execute(param, config.error_color, "Failed", `Channel <#${channelID}> binded with a thread already.`);

    if (isSame) {
      return message.channel.send(sameChannelEmbed);
    } else if(!isThread){
      const newThread = await ThreadDB.create({
        userID: userID,
        channelID: channelID,
        threadTitle: "empty"
      });
      return message.channel.send(successEmbed);
    } else {
      await ThreadDB.update(
        { channelID: channelID },
        { where: { userID: userID } }
      );
      return message.channel.send(successEmbed);
    };

  }
};