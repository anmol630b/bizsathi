#!/bin/bash
echo "Starting BizSathi..."
cd ~/bizsathi/backend && node server.js &
sleep 2
cd ~/bizsathi/frontend && npm start
