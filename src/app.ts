import express from "express";
import cors from "cors";
import authorRouter from "./routes/authors";
import MessageRouter from "./routes/getmsg";


const app = express();

app.use(express.json());
app.use(
    '*',
    cors({
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );


app.use("/author", authorRouter);
app.use('/getmessages' , MessageRouter)

export default app;
