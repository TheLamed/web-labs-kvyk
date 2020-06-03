import { Injectable } from '@angular/core';
import { ApiAdminUsersService } from './api/api-admin-users.service';
import { DialogService } from './dialog.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { GetUsersRequest } from '../models/requests/get-users-request.model';
import { ViewUserModel } from '../models/profile/view-user.model';
import { PagingList } from '../models/paging-list.model';

@Injectable()
export class AdminUsersService {

  onGetUsers: Subject<GetUsersRequest>;
  onDeleteUser: Subject<number>;

  onUsersChanged: BehaviorSubject<PagingList<ViewUserModel>>;

  request: GetUsersRequest;

  constructor(
    private _api: ApiAdminUsersService,
    private _dialogService: DialogService,
  ) {
    this.request = new GetUsersRequest({});

    this.onGetUsers = new Subject();
    this.onDeleteUser = new Subject();

    this.onUsersChanged = new BehaviorSubject(new PagingList<ViewUserModel>());

    this.onGetUsers.subscribe(request => {
      if (request != null)
        this.request = request;

      this.getUsers();
    });

    this.onDeleteUser.subscribe(request => {
      this.deleteUser(request);
    });
  }

  private async getUsers() {
    let response = await this._api.GetUsers(this.request);

    if (response.success) {
      this.onUsersChanged.next(response.model);
      this._dialogService.showSnackBar(`Загружено ${response.model.totalCount} користувачів`);
      return;
    }
  }

  private async deleteUser(request: number) {
    let response = await this._api.DeleteUser(request);

    if (response.success) {
      this.getUsers();
      this._dialogService.showSnackBar(`Видалено!`);
      return;
    }
  }
}
