#!/bin/bash

echo "Starting Backend Services locally..."

cd services/api-gateway && npm run dev &
cd services/auth-service && npm run dev &
cd services/meeting-service && npm run dev &
cd services/email-service && npm run dev &
cd services/ai-service && npm run dev &
cd frontend && npm run dev &

echo "All services started! Press Ctrl+C to stop."
wait
