# Usa una imagen base de Node.js LTS (Long Term Support) sobre Debian Bullseye Slim
FROM node:lts-bullseye-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY diagnow-firebase-admin.json ./

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/diagnow-firebase-admin.json

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
