import Discord from "discord.js";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createCharacter } from "./character";

dotenv.config();

// Front end routing - BEGIN
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
// Front end routing - END

// Server Discord client - BEGIN
const client = new Discord.Client();
const prefix = "!";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async (message) => {
  console.log(message.content);

  if (message.content.startsWith(`${prefix}create`)) {
    const userId = message.author.id;
    const characterName =
      message.content.substr(message.content.indexOf(" ") + 1) || undefined;
    await createCharacter(userId, characterName);
  }

  if (message.content.startsWith(`${prefix}ping`)) message.channel.send("pong");
});

client.login(process.env.BOT_TOKEN);
// Server Discord client - END
