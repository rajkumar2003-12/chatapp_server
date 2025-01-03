import http from "http";
import app from "./app";
import websocketHandler from "./websocket/socket";

const PORT = 3000;

// Create HTTP server and attach WebSocket handler
const server = http.createServer(app);
websocketHandler(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
