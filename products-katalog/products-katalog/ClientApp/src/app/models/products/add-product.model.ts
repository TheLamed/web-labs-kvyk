export class AddProductModel {

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}