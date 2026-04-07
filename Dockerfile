FROM node:18-slim

WORKDIR /usr/src/app

# Bersihkan cache npm agar tidak error 'notarget' lagi
RUN npm cache clean --force

COPY package.json ./

# Install library secara murni
RUN npm install

COPY . .

CMD ["node", "bot_bedrock.js"]
