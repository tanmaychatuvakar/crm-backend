export class HttpException extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message?: string, data: any = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
