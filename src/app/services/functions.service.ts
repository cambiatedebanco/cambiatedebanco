import { Injectable, NgProbeToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private httpClient: HttpClient) { }

  get_simulacion_pdf(
    cuotas: any[], projection: number, initialCapital: number, obj: any){
    const url = 'https://us-central1-nicanor.cloudfunctions.net/get_simulacion_pdf';
    // TO DO : pasar detalle a un objeto
    const params = new HttpParams().set(
      'cuotas[]', JSON.stringify(cuotas)).set(
        'objC', 'Credito de consumo').set(
          'tipoC' , 'Credito de consumo').set(
            'afiliado', 'Activo').set(
              'fecha', obj.fechaOtorgamiento).set(
                'projection', projection.toString()).set(
                  'initialCapital', initialCapital.toString()).set(
                    'tasaInteres', obj.interestRate).set(
                      'tipoMoneda', 'Peso').set(
                        'cesantia', '').set('amount', obj.amount)
                        .set('gastoNotarial', obj.gastoNotarial).set('uf', obj.uf).set('impuesto', obj.impuesto)
    return this.httpClient.get(
      url, {
        responseType:'blob',
        params: params
      });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
