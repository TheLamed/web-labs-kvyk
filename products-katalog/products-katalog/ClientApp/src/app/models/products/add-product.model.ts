export class AddProductModel {  /*Required*/  public name: string;  /*Required*/  public description: string;  /*Required*/  public price: number;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
