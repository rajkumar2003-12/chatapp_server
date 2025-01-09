import prisma from "../middlewares/prisma";
import express from "express";



 const MessageRouter = express.Router();

MessageRouter.get("/chat", async (req: any, res: any) => {
    const { userId, receiverId } = req.query;
  
    if (!userId || !receiverId) {
      return res.status(400).json({ error: "Missing userId or receiverId" });
    }
  
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: Number(userId), receiverId: Number(receiverId) },
            { senderId: Number(receiverId), receiverId: Number(userId) },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
  
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });




  export default MessageRouter