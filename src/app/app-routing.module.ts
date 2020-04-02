import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ValidateComponent } from 'src/app/components/validate/validate.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ListQueueComponent } from 'src/app/components/list-queue/list-queue.component';
import { FormQueueComponent } from 'src/app/components/form-queue/form-queue.component';
import { ClientQueueComponent } from 'src/app/components/client-queue/client-queue.component';
import { FormClientQueueComponent } from 'src/app/components/form-client-queue/form-client-queue.component';
import { ClientQrcodeComponent } from 'src/app/components/client-qrcode/client-qrcode.component';


const routes: Routes = [
  // without auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'validate/:token', component: ValidateComponent },
  { path: 'qrcode/:id', component: ClientQrcodeComponent },
  
  //with auth
  { path: 'list-queue', component: ListQueueComponent }, 
  { path: 'form-queue', component: FormQueueComponent },
  { path: 'client-queue/:id', component: ClientQueueComponent },
  { path: 'form-client-queue/:id', component: FormClientQueueComponent },

  //main page
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
