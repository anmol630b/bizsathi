#!/bin/bash
echo "🚀 Starting BizSathi..."

# Start MongoDB
sudo systemctl start mongodb
echo "✅ MongoDB Started!"

# Start Backend in background
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ Backend Started! (PID: $BACKEND_PID)"

# Start Frontend
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend Started! (PID: $FRONTEND_PID)"

echo ""
echo "🎉 BizSathi Running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop everything"

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'Stopped!'" EXIT
wait
