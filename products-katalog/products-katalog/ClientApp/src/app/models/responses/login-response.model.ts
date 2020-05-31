import { UserModel } from "../profile/user.model";

export class LoginResponse {  public token: string;
  public user: UserModel;
}
