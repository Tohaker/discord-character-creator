#!/bin/bash

# Install node and git
curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt update && apt install -y git nodejs

# Clone the repository
git clone https://github.com/Tohaker/discord-character-creator.git
cd discord-character-creator

# Setup environment variables
export BOT_TOKEN={{BOT_TOKEN}}

# Build and run the app
npm install
npm run build
npm start
