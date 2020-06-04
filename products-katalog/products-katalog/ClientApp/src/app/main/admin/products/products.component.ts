import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { AdminProductService } from '../../../services/admin-products.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort, PageEvent } from '@angular/material';
import { DialogService } from '../../../services/dialog.service';
import { ProductModel } from '../../../models/products/product.model';
import { Subject } from 'rxjs';
import { GetProductsRequest } from '../../../models/requests/get-products-request.model';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AddProductDialogComponent } from './add-product/add-product-dialog.component';
import { IdValueModel } from '../../../models/id-value.model';
import { AddImageDialogComponent } from './add-image/add-image-dialog.component';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsComponent {

  dataSource: MatTableDataSource<ProductModel>;
  expandedElement: ProductModel | null;
  columnsToDisplay = ['more', 'id', 'name', 'price', 'actions'];
  totalCount: number = 0;
  pagingParams: GetProductsRequest;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private _unsubscribe: Subject<any>;

  constructor(
    private _productsService: ProductService,
    private _adminProductsService: AdminProductService,
    private _dialogService: DialogService,
    public dialog: MatDialog
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ProductModel>([]);
    this.pagingParams = new GetProductsRequest(this._productsService.request);

    this._productsService.onGetProducts
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.pagingParams = request;
      });

    this._productsService.onProductsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.dataSource.data = response.items;
        this.totalCount = response.totalCount;
      });

    this.sort.sortChange.subscribe((s: Sort) => {
      this.pagingParams.sortDir = s.direction;
      this.pagingParams.sort = s.active;
      this._productsService.onGetProducts.next(this.pagingParams);
    });

    this.paginator.page.subscribe((p: PageEvent) => {
      this.pagingParams.pn = p.pageIndex;
      this.pagingParams.ps = p.pageSize;
      this._productsService.onGetProducts.next(this.pagingParams);
    });

    this._productsService.onGetProducts.next(this.pagingParams);
  }

  deleteTerm(id: number) {
    this._dialogService.showConfirmationDialog('Ви впевнені, що хочете видалити цей продукт?', result => {
      if (result) {
        this._adminProductsService.onDeleteProduct.next(id);
      }
    });
  }

  addProduct() {
    let dialogRef = this.dialog.open(AddProductDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '600px',
      data: {}
    });
  }

  editProduct(item: ProductModel) {
    let dialogRef = this.dialog.open(AddProductDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '600px',
      data: {
        product: item
      }
    });
  }

  deletePhoto(id: number, img: string) {
    this._dialogService.showConfirmationDialog('Ви впевнені, що хочете видалити це фото?', result => {
      if (result) {
        this._adminProductsService.onRemoveImage.next(new IdValueModel<string>({ id: id, value: img }));
      }
    });
  }

  addImage(id: number) {
    let dialogRef = this.dialog.open(AddImageDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '320px',
      data: {
        id: id
      }
    });
  }

}
