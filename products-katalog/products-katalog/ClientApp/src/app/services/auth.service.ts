import { Injectable } from "@angular/core";
import { ApiAuthService } from "./api/api-auth.service";
import { LoginRequest } from "../models/requests/login-request.model";
import { Subject, BehaviorSubject } from "rxjs";
import { SignUpModel } from "../models/profile/signup.model";
import { UserModel } from "../models/profile/user.model";
import { DialogService } from "./dialog.service";

@Injectable()
export class AuthService {

  onLogin: Subject<LoginRequest>;
  onSignUp: Subject<SignUpModel>;
  onLogout: Subject<any>;

  onUserChanged: BehaviorSubject<UserModel>;
  onLoginFailedChanged: BehaviorSubject<"email" | "password">;
  onSignUpChanged: BehaviorSubject<boolean>;
  onTokenChanged: BehaviorSubject<string>;

  constructor(
    private _api: ApiAuthService,
    private _dialogService: DialogService,
  ) {
    this.onLogin = new Subject();
    this.onSignUp = new Subject();
    this.onLogout = new Subject();

    this.onUserChanged = new BehaviorSubject(null);
    this.onLoginFailedChanged = new BehaviorSubject(null);
    this.onSignUpChanged = new BehaviorSubject(null);
    this.onTokenChanged = new BehaviorSubject(localStorage.getItem('token'));

    this.onLogin.subscribe(request => {
      this.login(request);
    });

    this.onSignUp.subscribe(request => {
      this.signUp(request);
    });

    this.onLogout.subscribe(request => {
      this.logout();
    });

  }

  private async login(request: LoginRequest) {
    let response = await this._api.Login(request);

    if (response.success) {
      this.onUserChanged.next(response.model.user);
      this.onTokenChanged.next(response.model.token);
      localStorage.setItem("token", response.model.token);
      this._dialogService.showSnackBar("Ввійдено");
      return;
    }

    switch (response.status) {
      case 401:
        this.onLoginFailedChanged.next("password");
        break;
      case 404:
        this.onLoginFailedChanged.next("email");
        break;
    }
  }

  private async signUp(request: SignUpModel) {
    let response = await this._api.SignUp(request);

    if (response.success) {
      this.onSignUpChanged.next(response.model);
      return;
    }

    switch (response.status) {
      case 400:
        this.onSignUpChanged.next(false);
        break;
    }
  }

  private async logout() {
    localStorage.setItem('token', null);
    this.onUserChanged.next(null);
    this.onTokenChanged.next(null);
    this._dialogService.showSnackBar("Вийдено");
  }
}
