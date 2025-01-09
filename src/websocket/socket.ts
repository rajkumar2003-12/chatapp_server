import WebSocket, { WebSocketServer } from "ws";
import prisma from "../middlewares/prisma";
import jwt from "jsonwebtoken";
import { Authentication } from "../middlewares/authentication";

const websocketHandler = (server: any) => {
  const wss = new WebSocketServer({ server });

  
  const clients = new Map<number, WebSocket>();

  wss.on("connection", (socket, req) => {
    console.log("New WebSocket connection established");

    let userId: number;

  
    socket.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === "auth") {
          const token = parsedData.token;

          const author = await Authentication(token);
          if(author){
            userId = (author as jwt.JwtPayload).id;
            clients.set(userId, socket);
            console.log(`User ${userId} authenticated and connected`);
          }else {
            socket.send(JSON.stringify({ error: "Authentication failed" }));
            socket.close();
          }
        } else if (parsedData.type === "message") {
          const { content, receiverId } = parsedData;
          const message = await prisma.message.create({
            data: {
              content,
              senderId: userId,
              receiverId,
            },
          });

          console.log("Message saved to database:", message);

          const receiverSocket = clients.get(receiverId);
          if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
            receiverSocket.send(JSON.stringify(
              {
                type: "message",
                senderId: userId,
                content: message.content,
              }
            ));
          }

          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ status: "sent", message }));
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message", error);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ error: "Server error occurred" }));
        }
      }
    });

    socket.on("close", () => {
      if (userId) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};


export default websocketHandler;
