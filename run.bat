@echo off

start cmd /k "cd frontend/ && npm start"

cd backend && start cmd /k "npm run dev"