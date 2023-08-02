import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
declare var cordova: any;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  routes() {
    return this.http.get(`${this.apiUrl}/path`, {} );
  }

  getdata(id:any) {
    return this.http.get(`${this.apiUrl}/user/imei/${id}`, {} );
  }
  trucks() {
    return this.http.get(`${this.apiUrl}/truck`, {} );
  }

  path() {
    return this.http.get(`${this.apiUrl}/path`, {} );
  }

  createDay(param:any) {
    return this.http.post(`${this.apiUrl}/day/create`, param );
  }

  zonepath(id:any) {
    return this.http.get(`${this.apiUrl}/path/${id}`, {} );
  }
  getDayBydrive() {
    return this.http.get(`${this.apiUrl}/day/drive?limit=200`, {} );
  }
  endDay(id:any,param:any) {
    return this.http.put(`${this.apiUrl}/day/end/${id}`, param );
  }

  getIMEI(): Promise<string> {
    return new Promise((resolve, reject) => {
     
        cordova.plugins.imeiplugin.getImei(resolve, reject);
     
    });
  }

}
