export class SignUpModel {

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}