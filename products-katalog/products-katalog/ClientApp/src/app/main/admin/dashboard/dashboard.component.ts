import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserModel } from '../../../models/profile/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
/** dashboard component*/
export class DashboardComponent {
  user: UserModel;

  private _unsubscribe: Subject<any>;

  constructor(
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _router: Router,
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

  logout() {
    this._authService.onLogout.next();
    this._router.navigateByUrl("/");
  }
}
