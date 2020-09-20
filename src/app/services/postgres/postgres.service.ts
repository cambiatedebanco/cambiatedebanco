import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {

  // Base url
  BASE_URI = environment.ceoapi_url;
  token = null;
  constructor(private http: HttpClient) {
  }
// Http Headers
sendEmail(nombre: any,transaccion:any,email:any) {
  
  return this.http.get<any>('https://us-central1-graphite-maker-287716.cloudfunctions.net/email' + `?nombre=${nombre}&transaccion=${transaccion}&email=${email}`).pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}

sendEmail_contacto(nombre: any,telefono:any,email:any,comentarios:any) {
 
  return this.http.get<any>('https://us-central1-graphite-maker-287716.cloudfunctions.net/email_contacto' + `?nombre=${nombre}&telefono=${telefono}&email=${email}&comentarios=${comentarios}`).pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}

    getMicarteraCreditos(rut: any, id_cargo: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/micartera_creditos?rut=${rut}&idcargo=${id_cargo}`;
       return this.httpGet(complete_uri, headers);
    }

    getMicarteraEjecutivos(rut: any, id_cargo: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/micartera_ejecutivos?rut=${rut}&idcargo=${id_cargo}`;
       return this.httpGet(complete_uri, headers);
    }
    getMicarteraCreditosGestionado(rut: any, id_cargo: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/micartera_creditos_gestionado?rut=${rut}&idcargo=${id_cargo}`;
       return this.httpGet(complete_uri, headers);
    }

    getMicarteraCreditosPendientes(rut: any, id_cargo: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/micartera_creditos_pendientes?rut=${rut}&idcargo=${id_cargo}`;
       return this.httpGet(complete_uri, headers);
    }
    getDiasRestantes(headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/diasrestantes`;
      return this.httpGet(complete_uri, headers);
    }
    getMicarteraCreditosTotal(rut: any, id_cargo: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/micartera_creditos_total?rut=${rut}&idcargo=${id_cargo}`;
      return this.httpGet(complete_uri, headers);
    }


    httpGet(complete_uri, headers): Observable<any> {
      return this.http.get<any>(complete_uri, headers).pipe(
        retry(1), catchError(this.errorHandl)
      )
    }

    getUsuariosCla(headers:any, cargo?:number):Observable<any>{
      let url = typeof cargo === 'undefined'
      ? `/cla_usuarios`
      : `/cla_usuarios?cargo=${cargo}`
      return this.httpGet(this.BASE_URI + url, headers);
    }
    getUsuarioPorRut(id:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_usuario?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }
    getUsuarioPorMail(mail:string, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_usuario?email=${mail}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    updateUsuario(data:any , headers: any):Observable<any>{
      return this.http.put(this.BASE_URI+`/cla_usuario`,data, headers).pipe(
        retry(1),catchError(this.errorHandl)
      )
    }

    deleteUsuarioPorRut(id: number, headers: any):Observable<any>{
      return this.http.delete<any>(this.BASE_URI+`/cla_usuario?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }
    addUser(data, headers: any) {
      return this.http.post(this.BASE_URI+`/cla_usuario`, data ,headers).pipe(
        retry(0),catchError(this.errorHandl))
    }

    addCotizacion(data) {
      return this.http.post(this.BASE_URI+`/cla_cotizacion`, data ).pipe(
        retry(0),catchError(this.errorHandl))
    }


    getBancos(idbanco?:any):Observable<any>{
      if (typeof idbanco === 'undefined') {
        return this.http.get(this.BASE_URI+`/cla_bancos`).pipe(
          retry(1),catchError(this.errorHandl))
      }else{
      return this.http.get(this.BASE_URI+`/cla_bancos?id=${idbanco}`).pipe(
        retry(1),catchError(this.errorHandl))
      }
    }


      getRoles(headers:any): Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_roles`, headers).pipe(
          (retry(1),catchError(this.errorHandl))
        )
      }

      getEstadosLeads(headers:any): Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_estados_leads`, headers).pipe(
          (retry(1),catchError(this.errorHandl))
        )
      }

    /** Migacion grilla Leads */
      getLeadsColaborador(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/colaborador', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getLeadById(id, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_leads?id=${id}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getCampanasByColaborador(rut, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_campanas_usuario?rut=${rut}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      updatePendienteLead(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_ceo_lead_pend', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      updateLead(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_ceo_lead', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getResumenLeadsColaborador(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/colaborador_resumen', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getTop11LeadsColaborador(rut, idcargo, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_leads/colaborador_top?rut=${rut}&idcargo=${idcargo}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getLeads_total(rut: any, id_cargo: any, headers): Observable<any>{
        let complete_uri = `${this.BASE_URI}/cla_ceo_lead/total?rut=${rut}&idcargo=${id_cargo}`;
        return this.httpGet(complete_uri, headers);
      }

      getVistaUsuarioCantidad(rut: any, id_cargo: any, headers): Observable<any>{
        let complete_uri = `${this.BASE_URI}/cla_ceo_vista/cantidad?rut=${rut}&idcargo=${id_cargo}`;
        return this.httpGet(complete_uri, headers);
      }

      getFlow(data):Observable<any>{
        return this.http.post(this.BASE_URI+'/apiFlow/create_order', data).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getLeadByBanco(idbanco: any, headers): Observable<any>{
        let complete_uri = `${this.BASE_URI}/cambiate_leads/banco?idbanco=${idbanco}`;
        return this.httpGet(complete_uri, headers);
      }

      getCreditosByRut(rut: any, headers): Observable<any>{
        let complete_uri = `${this.BASE_URI}/cambiate/creditos?rut=${rut}`;
        return this.httpGet(complete_uri, headers);
      }
      
      updateCreditos(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cambiate/creditos', data, headers).pipe(
          retry(1),catchError(this.errorHandl))}

      updateAsignLeadsCb(data, headers: any):Observable<any>{
            return this.http.put(this.BASE_URI+'/cambiate_leads/asigna', data, headers).pipe(
              retry(1),catchError(this.errorHandl))}
      
              

              getConfiguradorOferta(headers): Observable<any>{
                let complete_uri = `${this.BASE_URI}/cambiate/conf_oferta`;
                return this.httpGet(complete_uri, headers);
              }

              getTramoPrecio(headers): Observable<any>{
                let complete_uri = `${this.BASE_URI}/cambiate/tramo_precio`;
                return this.httpGet(complete_uri, headers);
              }
      getStatusSuccess(data):Observable<any>{
                return this.http.post(this.BASE_URI+'/cambiate/success', data).pipe(
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
