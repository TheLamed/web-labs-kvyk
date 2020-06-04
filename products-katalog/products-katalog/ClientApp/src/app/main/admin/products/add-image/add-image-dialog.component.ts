import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DialogService } from '../../../../services/dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductModel } from '../../../../models/products/product.model';
import { AddProductModel } from '../../../../models/products/add-product.model';
import { AdminProductService } from '../../../../services/admin-products.service';
import { IdValueModel } from '../../../../models/id-value.model';
import { UploadImageRequest } from '../../../../models/products/upload-image-request.model';

@Component({
    selector: 'add-image-dialog',
    templateUrl: './add-image-dialog.component.html',
    styleUrls: ['./add-image-dialog.component.scss']
})
export class AddImageDialogComponent implements OnInit, OnDestroy {

  id: number;

  fileToUpload: File = null;

  private _unsubscribe: Subject<any>;

  constructor(
    private _dialogService: DialogService,
    private _adminProductService: AdminProductService,
    public dialogRef: MatDialogRef<AddImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;

    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {



  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  addImage() {
    if (this.fileToUpload == null) {
      this._dialogService.showSnackBar("Виберіть фото!");
      return;
    }

    let data = new FormData();
    data.append('image', this.fileToUpload);

    let request = new UploadImageRequest({ id: this.id, image: data });
    this._adminProductService.onAddImage.next(request);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}
