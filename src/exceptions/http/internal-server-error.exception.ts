import { HttpException } from "./http.exception";

export class InternalServerErrorException extends HttpException {
  constructor(message: string = "Internal Server Error", data?: any) {
    super(500, message, data);
  }
}
