import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PagingList } from '../models/paging-list.model';
import { ProductModel } from '../models/products/product.model';
import { GetProductsRequest } from '../models/requests/get-products-request.model';
import { ApiProductsService } from './api/api-products.service';
import { DialogService } from './dialog.service';

@Injectable()
export class ProductService {

  onGetProducts: Subject<GetProductsRequest>;

  onProductsChanged: BehaviorSubject<PagingList<ProductModel>>;

  request: GetProductsRequest;

  constructor(
    private _api: ApiProductsService,
    private _dialogService: DialogService,
  ) {

    this.request = new GetProductsRequest({});

    this.onGetProducts = new Subject();

    this.onProductsChanged = new BehaviorSubject(new PagingList<ProductModel>());

    this.onGetProducts.subscribe(request => {
      if (request != null)
        this.request = request;

      this.getProducts();
    });
  }

  private async getProducts() {
    let response = await this._api.GetProducts(this.request);

    if (response.success) {
      this.onProductsChanged.next(response.model);
      this._dialogService.showSnackBar(`Загружено ${response.model.totalCount} продуктів`);
      return;
    }
  }

}
