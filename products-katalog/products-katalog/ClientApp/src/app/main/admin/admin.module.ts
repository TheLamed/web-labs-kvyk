import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,


  ],
  providers: [

  ],
})
export class AdminModule { }

