import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username;

  constructor(private customerService: CustomerService,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.username = this.customerService.getCustomerName();
    if(this.username){
      this.username = this.username.split(" ", 1)
    }
  }

  logout(){
    this.loginService.logout();
    window.location.href = "/login";     
  }

}
