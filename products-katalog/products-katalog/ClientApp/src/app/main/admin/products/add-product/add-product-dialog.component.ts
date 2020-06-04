import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DialogService } from '../../../../services/dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductModel } from '../../../../models/products/product.model';
import { AddProductModel } from '../../../../models/products/add-product.model';
import { AdminProductService } from '../../../../services/admin-products.service';
import { IdValueModel } from '../../../../models/id-value.model';

@Component({
    selector: 'add-product-dialog',
    templateUrl: './add-product-dialog.component.html',
    styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;

  product: ProductModel;
  isEdit: boolean = true;

  private _unsubscribe: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _adminProductService: AdminProductService,
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.product = data.product;

    if (this.product == null) {
      this.product = new ProductModel();
      this.isEdit = false;
    }

    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.form = this.createForm();

  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      name: [this.product.name || null, Validators.required],
      description: [this.product.description || null, Validators.required],
      price: [this.product.price || null, [Validators.required, Validators.pattern(/[0-9]+/)]],
    });
    return form;
  }

  addProduct() {
    if (!this.form.valid) {
      this.touchForm(this.form);
      this._dialogService.showConfirmationDialog("Перевірте форму!");
      return;
    }

    let request = new AddProductModel(this.form.value);
    request.price = +this.form.value.price;

    this._adminProductService.onAddProduct.next(request);
    this.close();
  }

  editdProduct() {
    if (!this.form.valid) {
      this.touchForm(this.form);
      this._dialogService.showConfirmationDialog("Перевірте форму!");
      return;
    }

    let model = new AddProductModel(this.form.value);
    model.price = +this.form.value.price;

    let request = new IdValueModel<AddProductModel>({ id: this.product.id, value: model });

    this._adminProductService.onEditProduct.next(request);
    this.close();
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
