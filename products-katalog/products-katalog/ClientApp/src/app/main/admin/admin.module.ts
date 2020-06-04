import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule, MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatIconModule, MatFormFieldModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatMenuModule, MatTooltipModule } from "@angular/material";
import { ProductsComponent } from "./products/products.component";
import { AddProductDialogComponent } from "./products/add-product/add-product-dialog.component";
import { AddImageDialogComponent } from "./products/add-image/add-image-dialog.component";
import { ProductFindComponent } from "./products/product-find/product-find.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
]

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    AddProductDialogComponent,
    AddImageDialogComponent,
    ProductFindComponent,
  ],
  entryComponents: [
    DashboardComponent,
    ProductsComponent,
    AddProductDialogComponent,
    AddImageDialogComponent,
    ProductFindComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSortModule,
    MatTooltipModule,

  ],
  providers: [

  ],
})
export class AdminModule { }

