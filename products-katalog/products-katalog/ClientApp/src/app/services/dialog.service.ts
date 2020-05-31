import { Injectable } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ConfirmDialogComponent } from "../main/shared/dialogs/confirm-dialog/confirm-dialog.component";

@Injectable()
export class DialogService {

  constructor(
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
  ) {

  }

  public showSnackBar(message: string, action: string = ""): void {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  public showConfirmationDialog(message: string);
  public showConfirmationDialog(message: string, afterClose: (result: boolean) => void);
  public showConfirmationDialog(afterClose: (result: boolean) => void);
  public showConfirmationDialog(param1: any, param2?: any) {
    let message: string;
    let afterClose: (result: boolean) => void;

    if (typeof param1 == 'string')
      message = param1;
    else
      message = null;

    if (typeof param1 == 'function')
      afterClose = param1;
    else if (param2 != null && typeof param2 == 'function')
      afterClose = param2;
    else
      afterClose = null;

    let dialog = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: message,
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (afterClose != null)
        afterClose(result);
    });
  }

  //public showAlertDialog(title: string, message: string, action: string) {
  //  let dialog = this._dialog.open(ConfirmationDialogComponent, {
  //    data: {
  //      title: title,
  //      message: message,
  //      action: action,
  //    },
  //  });
  //}

}
