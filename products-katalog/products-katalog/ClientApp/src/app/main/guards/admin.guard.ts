import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this._auth.onUserChanged.value != null && this._auth.onUserChanged.value.role == "Admin")
      return true;

    return false;
  }
}
