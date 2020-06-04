import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/profile/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ProfileService } from '../../../services/profile.service';
import { ProductService } from '../../../services/product.service';
import { ProductModel } from '../../../models/products/product.model';
import { GetProductsRequest } from '../../../models/requests/get-products-request.model';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        ),
      ])
    ])
  ],
})
export class ContentComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  user: UserModel;

  products: ProductModel[] = [];
  totalCount: number = 0;
  request: GetProductsRequest;

  private _unsubscribe: Subject<any>;

  constructor(
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _productService: ProductService,
    private dialog: MatDialog,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.request = this._productService.request;

    this._authService.onUserChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(user => {
        this.user = user;
      });

    this._authService.onTokenChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(token => {
        this._productService.onGetProducts.next(this.request);
      });

    this._productService.onProductsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(items => {
        this.products = items.items;
        this.totalCount = items.totalCount;
      });

    this._productService.onGetProducts
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });

    this.paginator.page.subscribe((p: PageEvent) => {
      this.request.pn = p.pageIndex;
      this.request.ps = p.pageSize;
      this._productService.onGetProducts.next(this.request);
    });

    this._productService.onGetProducts.next(this.request);

  }

  login() {
    let dialogRef = this.dialog.open(LoginDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '320px',
    });

    dialogRef.afterClosed().subscribe(closed => {
      dialogRef = null;
    });
  }

  logout() {
    this._authService.onLogout.next();
  }

  sortColumn(sort: string) {
    this.request.sort = sort;
    this._productService.onGetProducts.next(this.request);
  }
  
  sortDir(sort: "" | "asc" | "desc") {
    this.request.sortDir = sort;
    this._productService.onGetProducts.next(this.request);
  }

  nextImg(item: ProductModel) {
    if (item['imgselector'] == null) {
      item['imgselector'] = 0;
    }

    if (item.images.length > item['imgselector'] + 1) {
      item['imgselector'] = item['imgselector'] + 1;
    }
    else {
      item['imgselector'] = 0;
    }
  }

  like(item: ProductModel) {
    if (!item.isLiked) {
      this._profileService.onAddLike.next(item.id);
      item.isLiked = true;
    }
    else {
      this._profileService.onRemoveLike.next(item.id);
      item.isLiked = false;
    }
  }

  profile() {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(closed => {
      dialogRef = null;
    });
  }

}
