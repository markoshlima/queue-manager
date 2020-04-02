import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import {Router} from "@angular/router"
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error;

  profileForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private loginService: LoginService,
              private customerService: CustomerService) { }

  ngOnInit(): void {
    if(this.loginService.getAuthToken()){
      this.goToMainPage();
    }
  }

  onSubmit(){
    this.loginService.login(this.profileForm.value).subscribe(
      resp => {
        this.loginService.setAuthToken(resp.token, resp.type);
        this.getlogin();        
      },
      err => {
        this.error = true;
      }
    );
  }

  getlogin(){
    this.customerService.getCustomer().subscribe(
      resp => {
        this.customerService.setCustomer(resp);
        this.goToMainPage();
      },
      err => console.log(err)
    );
  }

  goToMainPage(){
    window.location.href = "/list-queue"; 
  }

}
