import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
  constructor(message: string = "Not Found", data?: any) {
    super(404, message, data);
  }
}
