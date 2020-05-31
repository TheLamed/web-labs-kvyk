export class IdValueModel<T>{
  public id: number;
  public value: T;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
