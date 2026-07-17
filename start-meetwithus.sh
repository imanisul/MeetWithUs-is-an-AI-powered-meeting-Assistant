#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting MeetwithUs Microservices..."
npx concurrently \
    --names "GATEWAY,AUTH,FRONTEND" \
    --prefix-colors "cyan,blue,magenta" \
    "cd services/api-gateway && npm install && npm run dev" \
    "cd services/auth-service && npm install && npm run dev" \
    "cd frontend && npm install && npm run dev"
