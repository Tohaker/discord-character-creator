#!/bin/bash

# Install node
curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt install -y nodejs

# Clone the repository
git clone https://github.com/Tohaker/discord-character-creator.git
cd discord-character-creator

# Build and run the app
npm install
npm run build
npm start
