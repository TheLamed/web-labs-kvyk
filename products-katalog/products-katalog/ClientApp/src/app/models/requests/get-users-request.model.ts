export class GetUsersRequest {
  pn: number = 0;
  ps: number = 10;
  sort: string = null;
  sortDir: "asc" | "desc" | ""  = "asc";
  find: string  = null;
  like: number = null;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
