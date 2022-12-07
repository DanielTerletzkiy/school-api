import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { RouteError } from "@src/declarations/classes";
import { parseJwt } from "@src/services/auth-service";

const NO_AUTH = "no authorization provided";
const INVALID_AUTH = "invalid authorization type";
const EXPIRED_AUTH_TOKEN = "token has expired";

export default async function (req: Request, res: Response, next: NextFunction) {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, NO_AUTH);
  }
  const authRegex = authorization.match(new RegExp("(.*)\\s(.*)"));
  if (!authRegex || !authRegex.length) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_AUTH);
  }
  const authorizationType = authRegex[1].trim();
  const authorizationCode = authRegex[2].trim();
  switch (authorizationType.toLowerCase()) {
    case "key": {
      break;
    }
    case "bearer": {
      const parsedJWT = await parseJwt(authorizationCode);
      const expiration = new Date(parsedJWT.exp * 1000);
      if (expiration.getTime() < new Date().getTime()) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, EXPIRED_AUTH_TOKEN);
      }
      break;
    }
    default: {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_AUTH);
    }
  }
  return next();
}
