FROM mcr.microsoft.com/devcontainers/typescript-node:latest

USER node
RUN npm install -g playwright &&\
    sudo sh -c 'echo "Acquire::http::Pipeline-Depth \"0\";\nAcquire::http::No-Cache true;\nAcquire::BrokenProxy true;" > /etc/apt/apt.conf.d/99fixbadproxy' &&\
    sudo npx playwright install-deps &&\
    npx playwright install