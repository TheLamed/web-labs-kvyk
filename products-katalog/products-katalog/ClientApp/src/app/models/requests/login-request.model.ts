export class LoginRequest {

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}