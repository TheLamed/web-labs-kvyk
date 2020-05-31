import { HttpParams } from "@angular/common/http";

export class GetProductsRequest {
  pn: number = 0;
  ps: number = 10;
  sort: string = null;
  sortDir: "asc" | "desc"  = "asc";
  find: string  = null;
  onlyLikes: boolean = false;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
