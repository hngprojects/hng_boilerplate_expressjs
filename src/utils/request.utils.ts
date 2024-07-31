import { Request, Response } from "express";
import { User } from "../models";

class RequestUtils {
  private request: Request;
  private response: Response;

  constructor(req: Request, res: Response) {
    this.request = req;
    this.response = res;
  }

  public addDataToState(key: string, data: any) {
    return (this.response.locals[key] = data);
  }

  public getDataFromState(key: string) {
    return this.response.locals[key] || null;
  }

  public getRequestUser() {
    return this.response.locals.user as User;
  }
}

export default RequestUtils;
