FROM node:20-alpine AS base

# Instala as dependências necessárias
FROM base AS deps
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package.json package-lock.json ./
RUN npm ci

# Configuração da build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build da aplicação Next.js
RUN NEXT_DISABLE_ESLINT=1 npm run build

# Configuração de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Criar um usuário não-root para executar a aplicação
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mudar para o usuário não-root
USER nextjs

# Expor a porta utilizada pela aplicação
EXPOSE 3000

# Definir variáveis de ambiente
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar a aplicação
CMD ["npm", "start"] 