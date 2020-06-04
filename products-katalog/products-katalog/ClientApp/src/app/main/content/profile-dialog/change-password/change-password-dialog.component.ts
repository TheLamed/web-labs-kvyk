import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from '../../../../services/dialog.service';
import { ProfileService } from '../../../../services/profile.service';
import { ChangePasswordModel } from '../../../../models/profile/change-password.model';
import { AuthService } from '../../../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from '../../../../models/profile/user.model';

@Component({
  selector: 'change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;

  user: UserModel;
  failed: boolean = false;

  isSent: boolean = false;

  private _unsubscribe: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _profileService: ProfileService,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.form = this.createForm();

    this._authService.onUserChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(user => {
        this.user = user;
      });

    this._profileService.onPasswordChangeFailed
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(failed => {
        this.failed = failed;

        if (this.isSent && !failed) {
          this.close();
        }
      });

  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
    });
    return form;
  }

  changePassword() {
    if (!this.form.valid) {
      this.touchForm(this.form);
      this._dialogService.showSnackBar("Перевірта форму!");
      return;
    }

    let request = new ChangePasswordModel(this.form.value);
    request.id = this.user.id;
    this.isSent = true;
    this.failed = false;
    this._profileService.onChangePassword.next(request);
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
