export class ChangePasswordModel {  /*Required*/  public id: number;  /*Required*/  public oldPassword: string;  /*Required*/  public newPassword: string;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
