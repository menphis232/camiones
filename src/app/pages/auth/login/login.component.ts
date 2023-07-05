import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  locationEnabled: boolean = false;
  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ){
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
         position => {
           this.locationEnabled = true;
         },
         error => {
           this.locationEnabled = false;
         }
      );
    } else {
      this.locationEnabled = false;
    }
  }

  logIn() {
    this.getLocation()
    if (this.locationEnabled) {
        this.authService.login(this.loginForm.value).subscribe(response => {
          // Manejar la respuesta del servidor aquí
          console.log('respuesta',response)
          const token = JSON.parse(JSON.stringify(response)).token;
          const user = JSON.parse(JSON.stringify(response)).data;

          // Guarda el token y los datos del usuario en el localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['dashboard'])
        }, error => {
          // Manejar el error aquí
        });
    }else{
      this.snackBar.open('Por favor, active la ubicación antes de iniciar sesión.', 'Cerrar');
    }
  
  }
}
