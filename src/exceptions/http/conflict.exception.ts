import { HttpException } from "./http.exception";

export class ConflictException extends HttpException {
  constructor(message: string = "Conflict", data?: any) {
    super(409, message, data);
  }
}
