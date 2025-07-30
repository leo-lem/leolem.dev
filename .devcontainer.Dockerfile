FROM mcr.microsoft.com/devcontainers/typescript-node:latest

USER vscode
WORKDIR /workspaces/leolem.dev
COPY package*.json ./
RUN npm install && \
    sudo sh -c 'echo "Acquire::http::Pipeline-Depth \"0\";\nAcquire::http::No-Cache true;\nAcquire::BrokenProxy true;" > /etc/apt/apt.conf.d/99fixbadproxy' && \
    sudo npx playwright install-deps && \
    npx playwright install