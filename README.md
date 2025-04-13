# Lista de Compras com WhatsApp

Um aplicativo de lista de compras com integração com WhatsApp, construído com Next.js, TypeScript e Tailwind CSS.

## Funcionalidades

- Criar e gerenciar múltiplas listas de compras
- Adicionar, remover e marcar itens como comprados
- Compartilhar listas via WhatsApp
- Receber e processar comandos via WhatsApp

## Requisitos

- Node.js 18.17.0 ou superior
- NPM ou Yarn
- Um smartphone com WhatsApp instalado

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/lista-compras.git
cd lista-compras
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

4. Abra http://localhost:3000 no seu navegador para ver o aplicativo.

## Configuração do WhatsApp

Na primeira vez que executar o aplicativo, um QR code será gerado no console. Escaneie este QR code com seu WhatsApp para vincular sua conta ao aplicativo.

### Comandos disponíveis via WhatsApp:

- `adicionar [item]` - Adiciona um item à lista de compras
- `remover [item]` - Remove um item da lista de compras
- `listar` - Lista todos os itens da lista de compras

## Compartilhando listas

1. Crie uma lista e adicione itens
2. Clique no botão "Compartilhar via WhatsApp"
3. Insira o número de telefone no formato +[código do país][número]
4. Clique em "Compartilhar"

## Tecnologias utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- whatsapp-web.js
- LocalStorage para persistência de dados

## Estrutura do projeto

- `/app` - Rotas e páginas
- `/components` - Componentes React reutilizáveis
- `/contexts` - Context providers para gerenciamento de estado
- `/lib` - Utilitários e funções auxiliares
- `/public` - Ativos estáticos
- `/types` - Definições de tipos TypeScript

## Desenvolvimento

Para construir a versão de produção:

```bash
npm run build
# ou
yarn build
```

Para iniciar o servidor de produção:

```bash
npm start
# ou
yarn start
```

## Executando com Docker

Este aplicativo pode ser facilmente executado usando Docker, sem precisar instalar Node.js ou outras dependências localmente.

### Requisitos

- Docker
- Docker Compose (opcional, mas recomendado)

### Usando Docker Compose (Recomendado)

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd lista-compras
   ```

2. Execute o aplicativo usando Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Acesse o aplicativo em seu navegador:
   ```
   http://localhost:3000
   ```

4. Para parar o aplicativo:
   ```bash
   docker-compose down
   ```

### Usando Docker diretamente

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd lista-compras
   ```

2. Construa a imagem Docker:
   ```bash
   docker build -t lista-compras .
   ```

3. Execute o container:
   ```bash
   docker run -p 3000:3000 -d --name lista-compras-app lista-compras
   ```

4. Acesse o aplicativo em seu navegador:
   ```
   http://localhost:3000
   ```

5. Para parar o container:
   ```bash
   docker stop lista-compras-app
   docker rm lista-compras-app
   ```

## Licença

[MIT](LICENSE)
