import Discord from "discord.js";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createCharacter } from "./character";

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

client.on("message", async (message) => {
  if (message.content.startsWith(`${prefix}create`)) {
    console.log(`Received creation request: ${message.content}`);
    const userId = message.author.id;

    const spaceIndex = message.content.indexOf(" ");
    const characterName =
      spaceIndex >= 0 ? message.content.substr(spaceIndex + 1) : undefined;
    message.channel.send(await createCharacter(userId, characterName));
  }

  if (message.content.startsWith(`${prefix}ping`)) message.channel.send("pong");
});

client.login(process.env.BOT_TOKEN);
// Server Discord client - END
