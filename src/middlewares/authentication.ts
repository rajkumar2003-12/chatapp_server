

import jwt from "jsonwebtoken";
import { json } from "stream/consumers";



export async function Authentication(req: any, res: any, next: any){
    const authorization = req.header("Authorization")
    const token = authorization?.split(" ")[1] || "";
    try{
        const author = await jwt.verify(token, process.env.SECRET_KEY as string)
        console.log(author)
        
        const authorId = (author as jwt.JwtPayload).id as string;
        if(author){
            req.set("userId", authorId)
            await next()
        }else{
            res.status(404).json("you are not as user")
        }
    }catch(err){
        return res.status(404).json({error:err})
        
    }
}