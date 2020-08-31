import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCardifService {
  urlLogin = environment.cardif_api_login;
  urlData = environment.cardif_api_data;
  credentials = environment.cardif_api_credentials;

  constructor(private http: HttpClient) { }

  public addDataCardif(jsonData: any) {
    console.log('jsonData ==> ', jsonData);
    console.log('urlLogin ==> ', this.urlLogin);
    console.log('urlData ==> ', this.urlData);
    console.log('credentials ==> ', this.credentials);
    this.http.post(this.urlLogin, this.credentials).toPromise().then((data: any) => {
      console.log(data);

      let header: HttpHeaders = new HttpHeaders();
      header = header.set('Authorization', `Bearer ${data.token}`);
      header = header.append('Content-Type', 'application/json');

      const resp = this.http.post<any>(this.urlData, jsonData, { headers: header }).subscribe(
        result => {
          console.log('Carga de datos ==> ', result);
        },
        error => {
          console.log('Error occured', error);
        }
      );
    });

  }
}
