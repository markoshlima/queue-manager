import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer/customer.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  error = false;
  confirm = false;
  confirmMessage = '';

  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    password2: new FormControl('')
  });

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.customerService.register(this.profileForm.value).subscribe(
      resp => {
        this.error = false;
        this.confirm = true;
        this.confirmMessage = this.profileForm.value.name+', obrigado por realizar o cadastro. Um mensagem de confirmação foi enviado ao seu e-mail, por favor, realize a validação para utilizar o sistema.';
      },
      err => {
        this.error = err.error.message;
      }
    );
  }

}
