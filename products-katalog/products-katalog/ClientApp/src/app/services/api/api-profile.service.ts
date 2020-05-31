import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "../../helpers/api.decorator";
import { ModelResponse } from "../../models/model-response.model";
import { UserModel } from "../../models/profile/user.model";
import { AuthService } from "../auth.service";
import { ChangePasswordModel } from "../../models/profile/change-password.model";
import { EditProfileModel } from "../../models/profile/edit-profile.model";

@Injectable()
export class ApiProfileService {

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
        this.headers = new HttpHeaders()
      }
    });
  }

  @API<ModelResponse<UserModel>>()
  public async GetProfile(): Promise<ModelResponse<UserModel>> {
    let response = new ModelResponse<UserModel>();
    response.model = await this._httpClient.get<UserModel>('api/profile', { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async ChangePassword(request: ChangePasswordModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.post<boolean>('api/profile/change-password', request, { headers: this.headers }).toPromise();
    return response;
  }
  
  @API<ModelResponse<UserModel>>()
  public async EditProfile(request: EditProfileModel): Promise<ModelResponse<UserModel>> {
    let response = new ModelResponse<UserModel>();
    response.model = await this._httpClient.post<UserModel>('api/profile/edit', request, { headers: this.headers }).toPromise();
    return response;
  }
  
  @API<ModelResponse<boolean>>()
  public async AddLike(request: number): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.get<boolean>(`api/profile/like/${request}`, { headers: this.headers }).toPromise();
    return response;
  }
  
  @API<ModelResponse<boolean>>()
  public async RemoveLike(request: number): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>(`api/profile/like/${request}`, { headers: this.headers }).toPromise();
    return response;
  }

}
