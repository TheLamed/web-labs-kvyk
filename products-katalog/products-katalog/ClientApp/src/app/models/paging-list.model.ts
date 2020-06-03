export class PagingList<T> {
  public totalCount: number;
  public items: T[];

  constructor() {
    this.totalCount = 0;
    this.items = [];
  }
}
