import { Component } from '@angular/core';
import { FormBuilder,Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../model/login.model';
import { LoginService } from '../services/login.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin?: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginSvc:LoginService,
    private router: Router,
    private utilSvc: UtilService,
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  loginClick() {
    this.isLoading = true;
    console.log('Click en login');
    console.log('valor form', this.formLogin?.value);
    const req = this.formLogin?.value as LoginRequest;
    this.loginSvc.login(req).subscribe({
      next: (response) => {
        console.log('Respuesta', response);
        this.utilSvc.saveToken(response.token);
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Error', err);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Completed!!');
      }
    });
    console.log('Ya se envió la petición');
  }
}
