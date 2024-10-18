FROM node:22-bookworm-slim

LABEL org.opencontainers.image.source=https://github.com/dlol/dw-ring

EXPOSE 8080

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils -y

RUN apt-get autoclean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /dw-ring
COPY . .
RUN mkdir static-tmp
RUN mv /dw-ring/src/static/* /dw-ring/static-tmp

RUN yarn

RUN chmod +x /dw-ring/entrypoint.sh

ENTRYPOINT ["/bin/sh", "-c", "/dw-ring/entrypoint.sh"]
