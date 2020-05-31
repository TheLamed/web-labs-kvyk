export class UploadImageRequest {
  public image: FormData;
  public id: number;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
