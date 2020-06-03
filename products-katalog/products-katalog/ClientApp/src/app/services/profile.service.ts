import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { EditProfileModel } from "../models/profile/edit-profile.model";
import { ApiProfileService } from "./api/api-profile.service";
import { AuthService } from "./auth.service";
import { DialogService } from "./dialog.service";
import { ChangePasswordModel } from "../models/profile/change-password.model";

@Injectable()
export class ProfileService {

  onGetProfile: Subject<any>;
  onEditProfile: Subject<EditProfileModel>;
  onChangePassword: Subject<ChangePasswordModel>;
  onAddLike: Subject<number>;
  onRemoveLike: Subject<number>;

  constructor(
    private _api: ApiProfileService,
    private _authservice: AuthService,
    private _dialogService: DialogService,
  ) {
    this.onGetProfile = new Subject();
    this.onEditProfile = new Subject();
    this.onChangePassword = new Subject();
    this.onAddLike = new Subject();
    this.onRemoveLike = new Subject();

    this.onGetProfile.subscribe(request => {
      this.getProfile();
    });

    this.onEditProfile.subscribe(request => {
      this.editProfile(request);
    });

    this.onChangePassword.subscribe(request => {
      this.changePassword(request);
    });
    
    this.onAddLike.subscribe(request => {
      this.addLike(request);
    });
    
    this.onRemoveLike.subscribe(request => {
      this.removeLike(request);
    });

    if (localStorage.getItem("token") != null)
      this.onGetProfile.next();
  }

  private async getProfile() {
    let response = await this._api.GetProfile();

    if (response.success) {
      this._authservice.onUserChanged.next(response.model);
      return;
    }

    switch (response.status) {
      case 404:
      case 401:
        this._authservice.onUserChanged.next(null)
        break;
    }
  }

  private async editProfile(request: EditProfileModel) {
    let response = await this._api.EditProfile(request);

    if (response.success) {
      this._authservice.onUserChanged.next(response.model);
      return;
    }

    switch (response.status) {
      case 404:
      case 401:
        this._authservice.onUserChanged.next(null)
        break;
      case 400:
        this._dialogService.showSnackBar("Такий емейл вже зареєстровано!");
        break;
    }
  }
  
  private async changePassword(request: ChangePasswordModel) {
    let response = await this._api.ChangePassword(request);

    if (response.success) {
      this._dialogService.showSnackBar("Пароль змінено!");
      return;
    }

    switch (response.status) {
      case 404:
      case 401:
        this._authservice.onUserChanged.next(null)
        break;
      case 400:
        this._dialogService.showSnackBar("Неправельний пароль!");
        break;
    }
  }
  
  private async addLike(request: number) {
    let response = await this._api.AddLike(request);

    if (response.success) {
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Товар не знайдено!");
        break;
    }
  }
  
  private async removeLike(request: number) {
    let response = await this._api.RemoveLike(request);

    if (response.success) {
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Товар не знайдено!");
        break;
    }
  }

}
