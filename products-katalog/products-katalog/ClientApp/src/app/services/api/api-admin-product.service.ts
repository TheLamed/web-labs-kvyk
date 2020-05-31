import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "../../helpers/api.decorator";
import { IdValueModel } from "../../models/id-value.model";
import { ModelResponse } from "../../models/model-response.model";
import { AddProductModel } from "../../models/products/add-product.model";
import { ProductModel } from "../../models/products/product.model";
import { UploadImageRequest } from "../../models/products/upload-image-request.model";
import { AuthService } from "../auth.service";

@Injectable()
export class ApiAdminProductsService {

  private headers: HttpHeaders;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {
    _authService.onTokenChanged.subscribe(token => {
      if (token != null) {
        this.headers = new HttpHeaders()
          .set("Authorization", `bearer ${token}`);
      }
      else {
        this.headers = new HttpHeaders();
      }
    });
  }

  @API<ModelResponse<ProductModel>>()
  public async AddProduct(request: AddProductModel): Promise<ModelResponse<ProductModel>> {
    let response = new ModelResponse<ProductModel>();
    response.model = await this._httpClient.post<ProductModel>('api/admin/products', request, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async DeleteProduct(request: number): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>(`api/admin/products/${request}`, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<ProductModel>>()
  public async EditProduct(request: IdValueModel<AddProductModel>): Promise<ModelResponse<ProductModel>> {
    let response = new ModelResponse<ProductModel>();
    response.model = await this._httpClient.put<ProductModel>(`api/admin/products/${request.id}`, request.value, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<ProductModel>>()
  public async AddImage(request: UploadImageRequest): Promise<ModelResponse<ProductModel>> {
    let response = new ModelResponse<ProductModel>();
    response.model = await this._httpClient.post<ProductModel>(`api/admin/products/image/${request.id}`, request.image, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async RemoveImage(request: IdValueModel<string>): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.post<boolean>(`api/admin/products/image/${request.id}/remove`, request, { headers: this.headers }).toPromise();
    return response;
  }
}
