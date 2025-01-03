import prisma from "../middlewares/prisma";
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Signupinput,Signinput } from "../zod/zods";
import { sign } from "crypto";




  const authorRouter = express.Router();

authorRouter.post("/signup", async(req, res) => {
    const {username, email, password} = req.body;

    try{
        const result = Signupinput.safeParse({ username, email, password });
        if (!result.success) {
            res.status(400).json({ error: "Error at Zod validation", details: result.error.errors });
            return;
        }

    const hashPass = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
        data:{
            username, email, password:hashPass
        }
    })
    console.log(user)
    res.status(201).json({user});
}catch(err){
    res.status(404).json({error:err})
}
})

authorRouter.post("/login", async(req: any, res:any) => {
    const {email, password} = req.body;

    try{
       const result = Signinput.safeParse({email, password})
       if (!result.success) {
        res.status(400).json({ error: "Error at Zod validation", details: result.error.errors });
        return;
    }

    const user = await prisma.user.findFirst({
        where:{
            email
        }
    })
    if(!user){
        res.status(404).json("your email not same")
    }
    const isPass = bcrypt.compare(password, user?.password as string)
    if(!isPass){
        return res.status(401).json("you password did not match")
    }

    const jwt_token = await jwt.sign({id : user?.id}, process.env.SECRETE_KEY as string)
    console.log(jwt_token)

    return res.status(200).json({
        message: "Login successful",
        token: jwt_token,
      });

    }catch(err){
        return res.status(500).json({error:err})
    }
    
})

export default authorRouter;

