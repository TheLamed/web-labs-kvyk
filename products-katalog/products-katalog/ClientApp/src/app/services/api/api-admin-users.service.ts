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
import { AddProductModel } from "../../models/products/add-product.model";
import { IdValueModel } from "../../models/id-value.model";
import { UploadImageRequest } from "../../models/products/upload-image-request.model";
import { ViewUserModel } from "../../models/profile/view-user.model";
import { GetUsersRequest } from "../../models/requests/get-users-request.model";

@Injectable()
export class ApiAdminUsersService {

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

  @API<ModelResponse<boolean>>()
  public async DeleteUser(request: AddProductModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>(`api/admin/users/${request}`, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<PagingList<ViewUserModel>>>()
  public async GetUsers(request: GetUsersRequest): Promise<ModelResponse<PagingList<ViewUserModel>>> {
    let params = new HttpParams();
    if (request.pn != null) params = params.set("pn", request.pn.toString());
    if (request.ps != null) params = params.set("ps", request.ps.toString());
    if (request.sort != null) params = params.set("sort", request.sort);
    if (request.sortDir != null) params = params.set("sortDir", request.sortDir);
    if (request.find != null) params = params.set("find", request.find);
    if (request.like != null) params = params.set("like", request.like.toString());

    let response = new ModelResponse<PagingList<ViewUserModel>>();
    response.model = await this._httpClient.get<PagingList<ViewUserModel>>('api/users', { params: params, headers: this.headers }).toPromise();
    return response;
  }

}
