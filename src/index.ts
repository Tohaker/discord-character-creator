import Discord from "discord.js";
import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  console.log(message.content);
  if (message.content === "!ping") message.channel.send("pong");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
client.login(process.env.BOT_TOKEN);
