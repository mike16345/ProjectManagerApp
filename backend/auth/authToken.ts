import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";
  
interface TokenData {
  id: string;
}

interface RequestWithTokenData extends Request {
  tokenData?: TokenData;
}

export const authToken = (
  req: RequestWithTokenData,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-api-key") as string | undefined;

  if (!token) {
    res.status(401).json({ msg: "no token" });
  }

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET) as TokenData;
    req.tokenData = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({ msg: "not valid token" });
  }
};
