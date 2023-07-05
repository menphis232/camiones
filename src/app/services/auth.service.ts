import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  login(param:any) {
    return this.http.post(`${this.apiUrl}/auth/login`, param );
  }

  register(param:any) {
    return this.http.post(`${this.apiUrl}/auth/register`,  param);
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true// Verifica la fecha de expiración del token y devuelve true si no ha expirado o false si ha expirado
    }
    return false;
  }
}
