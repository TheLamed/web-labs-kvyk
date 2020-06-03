import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { EditProfileModel } from "../models/profile/edit-profile.model";
import { ApiProfileService } from "./api/api-profile.service";
import { AuthService } from "./auth.service";
import { DialogService } from "./dialog.service";
import { ChangePasswordModel } from "../models/profile/change-password.model";
import { ApiAdminProductsService } from "./api/api-admin-product.service";
import { AddProductModel } from "../models/products/add-product.model";
import { IdValueModel } from "../models/id-value.model";
import { UploadImageRequest } from "../models/products/upload-image-request.model";
import { ProductService } from "./product.service";

@Injectable()
export class AdminProductService {

  onAddProduct: Subject<AddProductModel>;
  onEditProduct: Subject<IdValueModel<AddProductModel>>;
  onDeleteProduct: Subject<number>;
  onAddImage: Subject<UploadImageRequest>;
  onRemoveProduct: Subject<IdValueModel<string>>;

  constructor(
    private _api: ApiAdminProductsService,
    private _productsService: ProductService,
    private _dialogService: DialogService,
  ) {

    this.onAddProduct = new Subject();
    this.onEditProduct = new Subject();
    this.onDeleteProduct = new Subject();
    this.onAddImage = new Subject();
    this.onRemoveProduct = new Subject();

    this.onAddProduct.subscribe(request => {
      this.addProduct(request);
    });
    
    this.onEditProduct.subscribe(request => {
      this.editProduct(request);
    });
    
    this.onDeleteProduct.subscribe(request => {
      this.deleteProduct(request);
    });
    
    this.onAddImage.subscribe(request => {
      this.addImage(request);
    });
    
    this.onRemoveProduct.subscribe(request => {
      this.removeImage(request);
    });

  }

  private async addProduct(request: AddProductModel) {
    let response = await this._api.AddProduct(request);

    if (response.success) {
      this._dialogService.showSnackBar("Додано!");
      this._productsService.onGetProducts.next();
      return;
    }
  }
  
  private async editProduct(request: IdValueModel<AddProductModel>) {
    let response = await this._api.EditProduct(request);

    if (response.success) {
      this._dialogService.showSnackBar("Відредаговано!");
      this._productsService.onGetProducts.next();
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Продукт не знайдено");
        break;
    }
  }
  
  private async deleteProduct(request: number) {
    let response = await this._api.DeleteProduct(request);

    if (response.success) {
      this._dialogService.showSnackBar("Видалено!");
      this._productsService.onGetProducts.next();
      return;
    }
  }
  
  private async addImage(request: UploadImageRequest) {
    let response = await this._api.AddImage(request);

    if (response.success) {
      this._dialogService.showSnackBar("Додано!");
      this._productsService.onGetProducts.next();
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Продукт не знайдено");
        break;
    }
  }
  
  private async removeImage(request: IdValueModel<string>) {
    let response = await this._api.RemoveImage(request);

    if (response.success) {
      this._dialogService.showSnackBar("Видалено!");
      this._productsService.onGetProducts.next();
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Продукт не знайдено");
        break;
    }
  }

}
