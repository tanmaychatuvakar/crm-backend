import { HttpException } from "./http.exception";

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized", data?: any) {
    super(401, message, data);
  }
}
