FROM node:22-alpine
WORKDIR /app
USER node
COPY --chown=node:node . .
RUN yarn
CMD ["yarn", "dev"]
