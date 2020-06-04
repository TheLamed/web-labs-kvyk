import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule, MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule, MatMenuModule, MatPaginatorModule } from "@angular/material";
import { ContentComponent } from "./content/content.component";
import { LoginDialogComponent } from "./login-dialog/login-dialog.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { FindComponent } from "./content/find/find.component";

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
  },
]

@NgModule({
  declarations: [
    ContentComponent,
    LoginDialogComponent,
    FindComponent,
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
    MatCheckboxModule,
    MatMenuModule,
    MatPaginatorModule,


  ],
  providers: [

  ],
  entryComponents: [
    LoginDialogComponent,
    FindComponent,
  ]
})
export class ContentModule { }

