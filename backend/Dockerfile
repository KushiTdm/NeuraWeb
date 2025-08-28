# Étape 1 : Builder
FROM node:20 AS builder

WORKDIR /app

# Installer deps
COPY package*.json tsconfig.json ./
RUN npm install

# Copier le code
COPY src ./src
COPY prisma ./prisma

# Build TS
RUN npm run build

# Étape 2 : Runner
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copier uniquement dist et prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/index.js"]
