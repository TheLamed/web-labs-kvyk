import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API } from "../../helpers/api.decorator";
import { ModelResponse } from "../../models/model-response.model";
import { UserModel } from "../../models/profile/user.model";
import { AuthService } from "../auth.service";
import { ChangePasswordModel } from "../../models/profile/change-password.model";
import { EditProfileModel } from "../../models/profile/edit-profile.model";
import { PagingList } from "../../models/paging-list.model";
import { ProductModel } from "../../models/products/product.model";
import { GetProductsRequest } from "../../models/requests/get-products-request.model";

@Injectable()
export class ApiProductsService {

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

  @API<ModelResponse<PagingList<ProductModel>>>()
  public async GetProducts(request: GetProductsRequest): Promise<ModelResponse<PagingList<ProductModel>>> {
    let params = new HttpParams();
    if (request.pn != null)         params = params.set("pn", request.pn.toString());
    if (request.ps != null)         params = params.set("ps", request.ps.toString());
    if (request.sort != null)       params = params.set("sort", request.sort);
    if (request.sortDir != null)    params = params.set("sortDir", request.sortDir);
    if (request.find != null)       params = params.set("find", request.find);
    if (request.onlyLikes != null)  params = params.set("onlyLikes", request.onlyLikes.toString());

    let response = new ModelResponse<PagingList<ProductModel>>();
    response.model = await this._httpClient.get<PagingList<ProductModel>>('api/products', { params: params, headers: this.headers }).toPromise();
    return response;
  }
}
