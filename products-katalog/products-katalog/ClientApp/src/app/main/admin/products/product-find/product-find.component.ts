import { Component } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { GetProductsRequest } from '../../../../models/requests/get-products-request.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'product-find',
    templateUrl: './product-find.component.html',
    styleUrls: ['./product-find.component.scss']
})
export class ProductFindComponent {

  form: FormGroup;
  request: GetProductsRequest;

  private _unsubscribe: Subject<any>;

  constructor(
    private _productService: ProductService,
    private _builder: FormBuilder,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.request = this._productService.request;
    this.form = this.createForm();

    this._productService.onGetProducts
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });

  }

  createForm() {
    let form = this._builder.group({
      name: [this.request.find],
    });
    return form;
  }

  find() {
    this.request.find = this.form.value.name;

    this._productService.onGetProducts.next(this.request);
  }

}
