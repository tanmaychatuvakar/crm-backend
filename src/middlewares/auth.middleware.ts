import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "@exceptions/http/unauthorized.exception";
import { ForbiddenException } from "@exceptions/http/forbidden.exception";
import { ActiveUser } from "@/types/active-user.type";
import { JWT_SECRET } from "@config";
import jwtService from "@/modules/iam/jwt.service";

type JwtPayload = { sub: string; email: string; role: string };

const authMiddleware = (...roles: string[]) => {
  return function (req: Request | any, res: Response, next: NextFunction) {
    const token = req.cookies["token"];

    if (!token) next(new UnauthorizedException());

    try {
      const {
        sub,
        email,
        role: userRole,
      } = jwtService.verify<JwtPayload>(token, JWT_SECRET);

      if (roles.length && !roles.includes(userRole)) {
        return next(new ForbiddenException());
      }

      req.user = {
        id: sub,
        email,
        is: (role: string) => role === userRole,
      } as ActiveUser;

      next();
    } catch (error) {
      next(new UnauthorizedException());
    }
  };
};

export default authMiddleware;
