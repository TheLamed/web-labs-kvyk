import { UserModel } from "./user.model";
import { IdValueModel } from "../id-value.model";

export class ViewUserModel extends UserModel {
  public likes: IdValueModel<string>[];
}
