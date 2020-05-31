export class LoginRequest {  /*Required*/  public email: string;  /*Required*/  public password: string;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
