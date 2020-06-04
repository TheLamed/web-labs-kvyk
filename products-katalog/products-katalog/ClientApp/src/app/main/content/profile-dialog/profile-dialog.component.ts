import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UserModel } from '../../../models/profile/user.model';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { EditProfileModel } from '../../../models/profile/edit-profile.model';
import { ChangePasswordDialogComponent } from './change-password/change-password-dialog.component';

@Component({
  selector: 'profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;

  user: UserModel;
  failed: boolean = false;

  private _unsubscribe: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _profileService: ProfileService,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
        this.form = this.createForm();
      });

    this._profileService.onEditFailed
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(failed => {
        this.failed = failed;
      });

  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      name: [this.user.name || null, Validators.required],
      email: [this.user.email || null, [Validators.required, Validators.pattern(/[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9.]/)]],
    });
    return form;
  }

  edit() {
    if (!this.form.valid) {
      this.touchForm(this.form);
      this._dialogService.showSnackBar("Перевірта форму!");
      return;
    }

    let request = new EditProfileModel(this.form.value);
    this._profileService.onEditProfile.next(request);
  }

  changePassword() {
    this.dialogRef.addPanelClass('dialog-hide');

    let cahngeDialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '600px',
    });

    cahngeDialogRef.afterClosed().subscribe(closed => {
      this.dialogRef.removePanelClass('dialog-hide');
      cahngeDialogRef = null;
    });
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
