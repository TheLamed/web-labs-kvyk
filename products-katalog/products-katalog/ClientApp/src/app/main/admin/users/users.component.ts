import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewUserModel } from '../../../models/profile/view-user.model';
import { GetUsersRequest } from '../../../models/requests/get-users-request.model';
import { AdminUsersService } from '../../../services/admin-users.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent {

  dataSource: MatTableDataSource<ViewUserModel>;
  expandedElement: ViewUserModel | null;
  columnsToDisplay = ['more', 'id', 'name', 'email', 'actions'];
  totalCount: number = 0;
  pagingParams: GetUsersRequest;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private _unsubscribe: Subject<any>;

  constructor(
    private _usersService: AdminUsersService,
    private _dialogService: DialogService,
    public dialog: MatDialog
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ViewUserModel>([]);
    this.pagingParams = this._usersService.request;

    this._usersService.onGetUsers
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.pagingParams = request;
      });

    this._usersService.onUsersChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.dataSource.data = response.items;
        this.totalCount = response.totalCount;
      });

    this.sort.sortChange.subscribe((s: Sort) => {
      this.pagingParams.sortDir = s.direction;
      this.pagingParams.sort = s.active;
      this._usersService.onGetUsers.next(this.pagingParams);
    });

    this.paginator.page.subscribe((p: PageEvent) => {
      this.pagingParams.pn = p.pageIndex;
      this.pagingParams.ps = p.pageSize;
      this._usersService.onGetUsers.next(this.pagingParams);
    });

    this._usersService.onGetUsers.next(this.pagingParams);
  }

  deleteUser(id: number) {
    this._dialogService.showConfirmationDialog('Ви впевнені, що хочете видалити цього користувача?', result => {
      if (result) {
        this._usersService.onDeleteUser.next(id);
      }
    });
  }

}
