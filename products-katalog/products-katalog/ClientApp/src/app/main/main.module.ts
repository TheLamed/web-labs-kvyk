import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorIntl, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule } from "@angular/material";
import { DialogService } from "../services/dialog.service";
import { ApiAdminProductsService } from "../services/api/api-admin-product.service";
import { ApiAdminUsersService } from "../services/api/api-admin-users.service";
import { ApiAuthService } from "../services/api/api-auth.service";
import { ApiProductsService } from "../services/api/api-products.service";
import { ApiProfileService } from "../services/api/api-profile.service";
import { AuthService } from "../services/auth.service";
import { ConfirmDialogModule } from "./shared/dialogs/confirm-dialog/confirm-dialog.module";

//#region Paginator

const ukrainianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 з ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} з ${length}`;
}


export function getUkrainianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Кількість:';
  paginatorIntl.nextPageLabel = 'Наступна сторінка';
  paginatorIntl.previousPageLabel = 'Попередня сторінка';
  paginatorIntl.getRangeLabel = ukrainianRangeLabel;

  return paginatorIntl;
}

//#endregion

const routes: Routes = [
  {
    path: 'a',
    loadChildren: './admin/admin.module#AdminModule',
  },
  //{
  //  path: '',
  //  loadChildren: './content/content.module#ContentModule',
  //},
  {
    path: '**',
    //redirectTo: ''
    redirectTo: 'a'
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,

    ConfirmDialogModule,

    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    DialogService,

    ApiAdminProductsService,
    ApiAdminUsersService,
    ApiAuthService,
    ApiProductsService,
    ApiProfileService,

    AuthService,


    { provide: MatPaginatorIntl, useValue: getUkrainianPaginatorIntl() }
  ],
})
export class MainModule { }

