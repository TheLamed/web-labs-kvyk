export class EditProfileModel {

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}