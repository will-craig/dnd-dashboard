FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_SIGNAL_HUB_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SIGNAL_HUB_BASE_URL=$VITE_SIGNAL_HUB_BASE_URL
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]