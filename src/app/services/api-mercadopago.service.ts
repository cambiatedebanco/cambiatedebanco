import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiMercadopagoService {
  urlData = environment.mercadopago_api;
 

  constructor(private http: HttpClient) { }

  getMP(data):Observable<any>{
    return this.http.post(this.urlData+'/payment/new', data).pipe(
      retry(1),catchError(this.errorHandl))
  }

  errorHandl(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
 }
}
