export class SignUpModel {  /*Required*/  public email: string;  /*Required*/  public password: string;  /*Required*/  public name: string;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
