#!/bin/bash
sudo systemctl start mongodb
fuser -k 5000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 1
cd /home/$USER/bizsathi/backend && npm run dev &
sleep 3
cd /home/$USER/bizsathi/frontend && npm start
