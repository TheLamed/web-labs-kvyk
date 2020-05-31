import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../../helpers/api.decorator";
import { ModelResponse } from "../../models/model-response.model";
import { LoginRequest } from "../../models/requests/login-request.model";
import { LoginResponse } from "../../models/responses/login-response.model";
import { SignUpModel } from "../../models/profile/signup.model";

@Injectable()
export class ApiAuthService {

  constructor(
    private _httpClient: HttpClient,
  ) {

  }

  @API<ModelResponse<LoginResponse>>()
  public async Login(model: LoginRequest): Promise<ModelResponse<LoginResponse>> {
    let response = new ModelResponse<LoginResponse>();
    response.model = await this._httpClient.post<LoginResponse>('api/auth/login', model).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async SignUp(model: SignUpModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.post<boolean>('api/auth/signup', model).toPromise();
    return response;
  }

}
