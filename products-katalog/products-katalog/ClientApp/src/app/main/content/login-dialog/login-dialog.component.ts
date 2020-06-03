import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from '../../../services/dialog.service';
import { LoginRequest } from '../../../models/requests/login-request.model';
import { SignUpModel } from '../../../models/profile/signup.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  loginForm: FormGroup;
  signUpForm: FormGroup;

  isLogin: boolean = true;
  loginFailedMessage: any;
  signUpFailed: boolean = false;

  private _unsubscribe: Subject<any>;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.loginForm = this.createLoginForm();
    this.signUpForm = this.createSignUpForm();

    this._authService.onLoginFailedChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(failed => {
        this.loginFailedMessage = failed;
      });

    this._authService.onSignUpChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(failed => {
        this.signUpFailed = failed;
        if (this.signUpFailed == true) {
          this._authService.onSignUpChanged.next(false);
          this.close();
        }
      });

    this._authService.onUserChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(user => {
        if(user != null)
          this.close();
      });
  }

  createLoginForm(): FormGroup {
    let form = this._formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9.]/)]],
      password: [null, Validators.required],
    });
    return form;
  }
  
  createSignUpForm(): FormGroup {
    let form = this._formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9.]/)]],
      password: [null, Validators.required],
    });
    return form;
  }

  login() {
    if (!this.loginForm.valid) {
      this.touchForm(this.loginForm);
      this._dialogService.showSnackBar("Перевірте форму!");
      return;
    }

    let request = new LoginRequest(this.loginForm.value);
    this._authService.onLogin.next(request);
  }

  signUp() {
    if (!this.signUpForm.valid) {
      this.touchForm(this.signUpForm);
      this._dialogService.showSnackBar("Перевірте форму!");
      return;
    }

    let request = new SignUpModel(this.signUpForm.value);
    this._authService.onSignUp.next(request);
  }

  touchForm(form: FormGroup) {
    (<any>Object).values(form.controls).forEach(control => {
      if (control.controls) this.touchForm(control);
      else control.markAsTouched();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
