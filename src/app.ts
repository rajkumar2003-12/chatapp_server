import express from "express";
import cors from "cors";
import authorRouter from "./routes/authors";


const app = express();

app.use(express.json());
app.use(cors());

// Apply routes
app.use("/author", authorRouter);
app.use("/", (req:any, res:any) => res.send("Hello World!"));

// WebSocket setup
export default app;
