import Discord from "discord.js";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createCharacter, deleteCharacter } from "./character";

dotenv.config();

// Front end routing - BEGIN
const app = express();

app.get("/", (_req, res) => {
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

const getParameters = (content: string) => {
  const spaceIndex = content.indexOf(" ");
  return spaceIndex >= 0 ? content.substr(spaceIndex + 1) : undefined;
};

client.on("message", async (message) => {
  if (message.content.startsWith(`${prefix}create`)) {
    console.log(`Received creation request: ${message.content}`);
    const userId = message.author.id;

    const characterName = getParameters(message.content);
    message.channel.send(await createCharacter(userId, characterName));
  }

  if (message.content.startsWith(`${prefix}delete`)) {
    console.log(`Received deletion request: ${message.content}`);
    const userId = message.author.id;

    const characterId = getParameters(message.content);
    message.channel.send(await deleteCharacter(userId, characterId));
  }

  if (message.content.startsWith(`${prefix}ping`)) message.channel.send("pong");
});

client.login(process.env.BOT_TOKEN);
// Server Discord client - END
