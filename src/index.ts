import Discord from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  console.log(message.content);
  if (message.content === "!ping") message.channel.send("pong");
});

client.login(process.env.BOT_TOKEN);
