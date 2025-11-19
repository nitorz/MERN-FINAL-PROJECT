FROM node:18-alpine
WORKDIR /app
COPY . .
RUN cd client && npm install && npm run build
RUN cd server && npm install
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server/server.js"]
