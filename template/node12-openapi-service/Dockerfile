FROM openfaas/of-watchdog:0.7.2 as watchdog
FROM node:12.13.0-alpine as ship

ARG ADDITIONAL_PACKAGES
ARG OPENAPI_PATH
ARG OPERATIONS_PATH

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN apk --no-cache add curl ca-certificates findutils jq ${ADDITIONAL_PACKAGES} \
    && addgroup -S app && adduser -S -g app app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /home/app

# Install wrapper/boot-strapper
WORKDIR /home/app
COPY package.json ./
RUN npm i
COPY lib ./

# Install service implementation
WORKDIR /home/app/function
COPY function/*.json ./
COPY function/.build-deps ./.build-deps
RUN cd .build-deps && \
    find . \( -type d -name node_modules -prune -o -name package.json \) -type f -execdir sh -c '\
        export PACKAGE_NAME=$(jq -r <package.json '.name') && \
        echo "Linking package: ${PACKAGE_NAME}" && \
        npm link && \
        cd /home/app/function && \
        npm link "${PACKAGE_NAME}"' \
        \;
RUN npm i || :
COPY function/lib ./lib

# Set correct permissions to use non root user
WORKDIR /home/app/
# chmod for tmp is for a buildkit issue (@alexellis)
RUN chown app:app -R /home/app && chmod 777 /tmp
USER app

ENV OPERATIONS_PATH=${OPERATIONS_PATH} \
    OPENAPI_PATH=${OPENAPI_PATH} \
    cgi_headers="true" \
    fprocess="node lib/index.js" \
    mode="http" \
    upstream_url="http://127.0.0.1:3000" \
    exec_timeout="10s" \
    write_timeout="15s" \
    read_timeout="15s"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]

