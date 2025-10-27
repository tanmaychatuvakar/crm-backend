import { HttpException } from "./http.exception";

export class ForbiddenException extends HttpException {
  constructor(message: string = "Forbidden", data?: any) {
    super(403, message, data);
  }
}
