FROM node:18-slim

# Set folder kerja
WORKDIR /usr/src/app

# Hanya copy package.json dulu (biar cepat)
COPY package.json ./

# Install library (pakai --production agar hemat tempat)
RUN npm install --production

# Baru copy sisa kodenya
COPY . .

# Jalankan botnya
CMD ["node", "bot_bedrock.js"]

