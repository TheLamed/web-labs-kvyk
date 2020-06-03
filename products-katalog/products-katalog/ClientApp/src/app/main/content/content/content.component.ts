import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/profile/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  user: UserModel;

  private _unsubscribe: Subject<any>;

  constructor(
    private _authService: AuthService,
    private _profileService: ProfileService,
    private dialog: MatDialog,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {

    this._authService.onUserChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(user => {
        this.user = user;
      });

  }

  login() {
    let dialogRef = this.dialog.open(LoginDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '320px',
    });

    dialogRef.afterClosed().subscribe(closed => {
      dialogRef = null;
    });
  }

  logout() {
    this._authService.onLogout.next();
  }

}
