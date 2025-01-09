import jwt from "jsonwebtoken";

export async function Authentication(token: string): Promise<any> {
  try {
    const author = jwt.verify(token, process.env.SECRETE_KEY as string);
    console.log(author);
    return author; 
  } catch (err) {
    console.error("Authentication error", err);
    return null;
  }
}
