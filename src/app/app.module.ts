import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { ValidateComponent } from './components/validate/validate.component';
import { LoginComponent } from './components/login/login.component';
import { ListQueueComponent } from './components/list-queue/list-queue.component';
import { InterceptorService } from 'src/app/services/interceptor/interceptor.service';
import { FormQueueComponent } from './components/form-queue/form-queue.component';
import { ClientQueueComponent } from './components/client-queue/client-queue.component';
import { FormClientQueueComponent } from './components/form-client-queue/form-client-queue.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ClientQrcodeComponent } from './components/client-qrcode/client-qrcode.component';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ValidateComponent,
    LoginComponent,
    ListQueueComponent,
    FormQueueComponent,
    ClientQueueComponent,
    FormClientQueueComponent,
    FooterComponent,
    HeaderComponent,
    ClientQrcodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
