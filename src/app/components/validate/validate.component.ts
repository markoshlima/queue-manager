import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {

  token;
  error;

  constructor(private route: ActivatedRoute, 
              private customerService: CustomerService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get("token")
    this.validate();
  }

  validate(){
    this.customerService.validate({"token":this.token}).subscribe(
      resp => {
        this.error = false;
      },
      err => {
        this.error = true;
      }
    );
  }

}
