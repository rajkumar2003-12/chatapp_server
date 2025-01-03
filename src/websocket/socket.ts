import WebSocket, { WebSocketServer } from "ws";
import prisma from "../middlewares/prisma";
import { Authentication } from "../middlewares/authentication";


const websocketHandler = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("message", async(data :any,req:any, res:any) => {
      try {
        const userId = req.get("userId")      
        const { chatId, content } = JSON.parse(data);
        const message = await prisma.message.create({
          data: { content, userId, chatId },
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error("Error processing WebSocket message", error);
      }
    });

    socket.send("WebSocket connection established");
  });
};

export default websocketHandler;
