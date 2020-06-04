import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetUsersRequest } from '../../../../models/requests/get-users-request.model';
import { AdminUsersService } from '../../../../services/admin-users.service';

@Component({
    selector: 'user-find',
    templateUrl: './user-find.component.html',
    styleUrls: ['./user-find.component.scss']
})
export class UserFindComponent {

  form: FormGroup;
  request: GetUsersRequest;

  private _unsubscribe: Subject<any>;

  constructor(
    private _usersService: AdminUsersService,
    private _builder: FormBuilder,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.request = this._usersService.request;
    this.form = this.createForm();

    this._usersService.onGetUsers
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });

  }

  createForm() {
    let form = this._builder.group({
      name: [this.request.find],
    });
    return form;
  }

  find() {
    this.request.find = this.form.value.name;

    this._usersService.onGetUsers.next(this.request);
  }

}
