export class EditProfileModel {  /*Required*/  public email: string;  /*Required*/  public name: string;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
