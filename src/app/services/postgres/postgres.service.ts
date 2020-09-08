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

  // GET Empresa
  getEmpresa(id: any, headers): Observable<any> {
    return this.http.get<any>(this.BASE_URI + '/empresa/' + id, headers).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getEmpresaCreditoDetalle(id: any, headers): Observable<any> {
    return this.http.get<any>(this.BASE_URI + '/empresa_credito_detalle/' + id, headers).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getEmpresaAhorroDetalle(id: any, headers): Observable<any> {
    return this.http.get<any>(this.BASE_URI + '/empresa_ahorro_detalle/' + id, headers).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getEmpresaBeneficios(id: any, headers): Observable<any> {
    return this.http.get<any>(this.BASE_URI + '/empresa_beneficios/' + id, headers).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getEmpresaOfertas(id: any, categoria: any, headers): Observable<any> {
    return this.http.get<any>(this.BASE_URI + '/empresa_ofertas/' + id + '/' + categoria , headers).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

    // GET Afiliado
    getAfiliado(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoEmpresa(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_empresa/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoMora(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_mora/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoAprobadoPrecalificado(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_aprobado/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoAutoFull(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_auto/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoOfertaEfi(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_oferta_efi/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoRecomendacionSeguro(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_recomendacion_seguro/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoOfertasAhorro(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_oferta_ahorro/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadoOfertasBbss(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliado_oferta_bbss/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getColaboradoresRegion(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/colaboradores_region/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadosRegion(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliados_region/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getColaboradoresComuna(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/colaboradores_comuna/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }
    getColaboradoresPos(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/colaboradores_pos/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadosPos(id: any, headers): Observable<any>{
      return this.http.get<any>(this.BASE_URI + '/afiliados_pos/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getAfiliadosComuna(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/afiliados_comuna/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }


    getVulnerabilidadComuna(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/vulnerabilidad_comuna/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getVulnerabilidadComunaCol(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/vulnerabilidad_comuna_col/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getComunaPos(id: any, headers): Observable<any> {
      return this.http.get<any>(this.BASE_URI + '/comuna_pos/' + id, headers).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }

    getVulnerabilidadRegion(id: any, headers): Observable<any> {
      let complete_uri = this.BASE_URI + '/vulnerabilidad_region/' + id;
      return this.httpGet(complete_uri, headers)
    }

    getVulnerabilidadRegionColaborador(id: any, headers): Observable<any> {
      let complete_uri = this.BASE_URI + '/vulnerabilidad_region_col/' + id;
      return this.httpGet(complete_uri, headers);
    }

    getContagiosCovid(id: any, headers): Observable<any> {
      let complte_uri = this.BASE_URI + '/contagios_covid/' + id;
      return this.httpGet(complte_uri, headers)
    }

    getFarmaciasOperativas(headers): Observable<any> {
      let complete_uri = this.BASE_URI + '/farmacias_operativas'
      return this.httpGet(complete_uri, headers)
    }

    getOfertaCreditoDigitalEmpresa(id: any, headers): Observable<any> {
      let complete_url = `${this.BASE_URI}/empresa_oferta_cred_digital/${id}`
      return this.httpGet(complete_url, headers)
    }
    /* MI- FICHA AFILIADO */
    getOfertaAfiliadoPPFF(id: any, headers): Observable<any> {
      let complete_uri = `${this.BASE_URI}/afiliado_oferta_ppff?id=${id}`
      return this.httpGet(complete_uri, headers);
    }

    getOfertasBBSSAfiliado(id: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/afiliado_oferta_cbbss?id=${id}`
      return this.httpGet(complete_uri, headers);
    }
    getOfertaAlertaAfiliado(id: any, headers): Observable<any>{
      let complete_uri = `${this.BASE_URI}/afiliado_oferta_alerta?id=${id}`
      return this.httpGet(complete_uri, headers);
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
    getTimeLineAfiliado(id: string, headers: any, channel?: string) {
      let complete_uri = `${this.BASE_URI}/timeline_afiliado?id=${id}`;
      if(typeof channel !== 'undefined'){
        complete_uri +=`&channel=${channel}`
      }
      return this.httpGet(complete_uri, headers);
    }

    getCargasFamiliaresAfiliado(id:any, period:any, headers: any):Observable<any[]>
    {
      let complete_uri = `${this.BASE_URI}/afiliado_cargas_familiares?id=${id}&period=${period}`
      return this.httpGet(complete_uri, headers);
    }

    getCreditoMiFicha(id: string, headers) {
      let complete_uri = `${this.BASE_URI}/mi-ficha-credito?id=${id}`;
      return this.httpGet(complete_uri, headers);
    }
    getSeguroMiFicha(id: string, headers){
      let complete_uri = `${this.BASE_URI}/mi-ficha-seguro?id=${id}`;
      return this.httpGet(complete_uri, headers);
    }
    getAhorroMiFicha(id: string, headers){
      let complete_uri = `${this.BASE_URI}/mi-ficha-ahorro?id=${id}`;
      return this.httpGet(complete_uri, headers);
    }

    saveTimeLine(formData: any, headers: any) {
      let complete_uri = `${this.BASE_URI}/timeline-afiliado`;
      return this.http.post(complete_uri, formData, headers);
    }

    setExecutiveSimulation(data: any, headers: any) {
      let complete_uri = `${this.BASE_URI}/simulacion-ejecutivo`;
      return this.http.post(complete_uri, data, headers);
    }
    /* FIN MI-FICHA AFILIADO */

    getImagenesComponente(componente:string, headers) {
      let complete_uri = `${this.BASE_URI}/imagen-componente?componente=${componente}`
      return this.httpGet(complete_uri, headers);
    }

    getAutoFullMiFicha(id: string, headers) {
      let complete_uri = `${this.BASE_URI}/auto-full?id=${id}`;
      return this.httpGet(complete_uri, headers);
    }

    getOfertaAfiliado(id: any, headers:any, producto?:string): Observable<any> {
      let complete_uri = `${this.BASE_URI}/afiliado_oferta?id=${id}`

      if(producto){
        complete_uri +=`&producto=${producto}`
      }
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

    getAllCampains(headers: any, id?:number):Observable<any>{
      let url = typeof id === "undefined"
        ? this.BASE_URI+`/cla_campanas`
        : this.BASE_URI+`/cla_campanas?id=${id}`
      return this.http.get(url ,headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    updateCampain(data: any, headers:any):Observable<any>{
      return this.http.put(this.BASE_URI+ `/cla_campanas`, data,headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    addCampain(data:any, headers: any):Observable<any>{
      return this.http.post(this.BASE_URI+ `/cla_campanas`, data,headers).pipe(
        retry(1),catchError(this.errorHandl))

    }

    getCampainsByTipo(tipo:string, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_campanas_tipo?tipo=${tipo}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    deleteCampain(id:number, headers:any): Observable<any>{
      return this.http.delete(this.BASE_URI+`/cla_campanas?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getSupervisoresPorCampain(id:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_supervisores_campain?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getColaboradoresByCampain(tipo:string, idcampana:number, idsucursal:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_colaboradores_campain?tipo=${tipo}&idcampana=${idcampana}&idsucursal=${idsucursal}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    addSupervisoresCampain(data, headers: any) {
      return this.http.post(this.BASE_URI+`/cla_supervisores_campain`, data ,headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    deleteSupervisoresCampain(id:number, headers:any): Observable<any>{
      return this.http.delete(this.BASE_URI+`/cla_supervisores_campain?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    addColaboradoresCampain(data, headers: any) {
      return this.http.post(this.BASE_URI+`/cla_colaboradores_campain`, data ,headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    deleteColaboradoresCampain(idcampana:number, idsucursal:number, headers:any): Observable<any>{
      return this.http.delete(this.BASE_URI+`/cla_colaboradores_campain?idcampana=${idcampana}&idsucursal=${idsucursal}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getAllSucursales(headers: any):Observable<any>{
      return this.http.get(this.BASE_URI+`/cla_sucursales`,headers).pipe(
        retry(1),catchError(this.errorHandl))
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

    addOrUpdatePrioridad(data:any, headers: any):Observable<any>{
      return this.http.post(this.BASE_URI+ `/cla_prioridad`, data,headers).pipe(
        retry(1),catchError(this.errorHandl))

    }

    getColaboradoresBySucursal(idsucursal:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_usuarios_sucursal?idsucursal=${idsucursal}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getSucursalesDisponibles(headers:any, idCargo?:number,idUsuario?:number):Observable<any>
    {
      // Disponibles en donde no este gestionada o un tenga con cargo en especifico.
      // EX (SOCIO NEGOCIO)
      let q = typeof idCargo !== 'undefined'
      ? `?idCargo=${idCargo}`
      : `?idUsuario=${idUsuario}`
      return this.http.get(this.BASE_URI+`/cla_us_sucursal${q}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    updateRolUsuario(data, headers:any):Observable<any>{
      return this.http.put(this.BASE_URI+`/cla_usuario_rol`, data, headers).pipe(
        retry(1),catchError(this.errorHandl)
      )
    }

    deteleSucursalUsuario(id, headers:any):Observable<any>{
      return this.http.delete(this.BASE_URI+`/cla_usuarios_sucursal?id=${id}`, headers).pipe(
        retry(1),catchError(this.errorHandl))

    }
    addUsuarioSucursal(data, headers: any):Observable<any>{
      return this.http.post(this.BASE_URI+'/cla_usuarios_sucursal', data, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getSucursalesByRutUsuario(idusuario:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_us_suc_rut?idusuario=${idusuario}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    updateColaboradorCampain(data, headers:any):Observable<any>{
      return this.http.put(this.BASE_URI+`/cla_colaboradores_campain`, data, headers).pipe(
        retry(1),catchError(this.errorHandl)
      )
    }

    getPrioridad(idcampana:number, idsucursal:number, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_prioridad?idcampana=${idcampana}&idsucursal=${idsucursal}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    getLeadsByColaboradores(data, headers: any):Observable<any>{
      return this.http.post(this.BASE_URI+'/cla_leads_usuarios', data, headers).pipe(
        retry(1),catchError(this.errorHandl))
    }

    updateAsignLeads(data, headers: any):Observable<any>{
      return this.http.put(this.BASE_URI+'/cla_leads_usuarios', data, headers).pipe(
        retry(1),catchError(this.errorHandl))}


    updateUsuarioSucursal(data, headers):Observable<any>{
      return this.http.put(this.BASE_URI+`/cla_usuarios_sucursal/dotacion`, data,headers)
      .pipe(retry(1),catchError(this.errorHandl))
    }

    getLeadsBySucursal(sucursal:string, campana: string, headers:any):Observable<any>{
      return this.http.get<any>(this.BASE_URI + `/cla_leads_usuarios?sucursal=${sucursal}&campana=${campana}`, headers).pipe(
        retry(1),catchError(this.errorHandl))
      }

      getSucursales(headers: any):Observable<any> {
        return this.http.get(this.BASE_URI+'/cla_sucursal/v2', headers).pipe(
          retry(1),catchError(this.errorHandl)
        )
      }
      getSucursalesEnabled(headers: any): Observable<any>{
        return this.http.get(this.BASE_URI+'/cla_sucursal/v2/enabled', headers).pipe(
          retry(1),catchError(this.errorHandl)
       )
      }
      updateSucursalDestino(data, headers: any): Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_sucursal/v2/enabled', data, headers).pipe(
          retry(1),catchError(this.errorHandl)
        )
      }
      getAgentesDisponibles(headers: any):Observable<any>{
        return this.http.get(this.BASE_URI+'/cla_usuarios_sucursal/agente', headers).pipe(
          retry(1),catchError(this.errorHandl)
        )
      }
      setagenteSucursal(data, headers:any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_usuarios_sucursal/agente', data, headers).pipe(
          retry(1),catchError(this.errorHandl)
        )
      }
      getUsuarioPorCargoSuc(cargo, sucursal, headers:any):Observable<any>{
        return this.http.get(this.BASE_URI+ `/cla_usuarios_sucursal/buscar?id=${sucursal}&cargo=${cargo}`,headers).pipe
        (retry(1),catchError(this.errorHandl))
      }

      getDotacion(id_suc, rut, headers:any): Observable<any>{
        return this.http.get(this.BASE_URI+ `/cla_usuarios_sucursal/dotacion?id=${id_suc}&rut=${rut}`, headers).pipe(
          (retry(1),catchError(this.errorHandl))
        )
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

      updateBaseLeads(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_base_mensual', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      updateBaseLeadsPendientes(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_base_mensual_pend', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getCreditosMiCarteraEstado(rut, estado, headers):Observable<any>{
        //`/cla_us_suc_rut?idusuario=${idusuario}`
        return this.http.get(this.BASE_URI+`/cla_credito_cartera_estado/staff?id=${rut}&status=${estado}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

    /** Migacion grilla Leads */
      getLeadsColaborador(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/colaborador', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getLeadsPropensosColaborador(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/colaborador_propenso', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getLeadById(id, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_leads?id=${id}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getRegiones(headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/regiones`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getCampanasByColaborador(rut, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_campanas_usuario?rut=${rut}`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getCampanasBySupervisor(rut, headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_campanas_supervisor?rut=${rut}`, headers).pipe(
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

      getAllLeadsColaborador(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/colaborador_all', data, headers).pipe(
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

      getLeadsBySupervisor(data, headers: any):Observable<any>{
        return this.http.post(this.BASE_URI+'/cla_ceo_leads/supervisor', data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      getAllEjecutivosCampana(headers):Observable<any>{
        return this.http.get(this.BASE_URI+`/cla_ceo_leads/ejecutivos_campana`, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      updateEjecutivoLead(data, headers: any):Observable<any>{
        return this.http.put(this.BASE_URI+'/cla_ceo_lead/ejecutivo_assign', data, headers).pipe(
          retry(1),catchError(this.errorHandl))}


      getPersonasTam(headers, id?: string):Observable<any>{
        let param = typeof id !== 'undefined' ? `?id=${id}` : ``
        let url = this.BASE_URI+`/cla_ceo_tam_personas` + param
        return this.http.get(url, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }
      getTamColaborador(headers, q:string=''):Observable<any>{

        let url = this.BASE_URI + `/cla_ceo_tam/colaborador${q}`
        return this.http.get(url, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }

      updateTam(headers, data: any):Observable<any>{
        let url = this.BASE_URI + `/cla_ceo_tam`
        return this.http.put(url, data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }
      updateTamDescargado(headers, data):Observable<any>{
        let url = this.BASE_URI + `/cla_ceo_tam/descargado`
        return this.http.put(url, data, headers).pipe(
          retry(1),catchError(this.errorHandl))
      }


      getTamLike(q: any, headers: any):Observable<any> {
       let url = this.BASE_URI + `/cla_ceo_tam/like?q=${q}`
       return this.http.get(url, headers).pipe(
        retry(1),catchError(this.errorHandl))
      }

      getSucursalLike(q:any, headers):Observable<any> {
        let url = this.BASE_URI + `/cla_ceo_sucursal/like?q=${q}`
        return this.httpGet(url, headers)
      }
      getEstadosTam(headers: { headers: import("@angular/common/http").HttpHeaders; }) {
        let url = this.BASE_URI +`/cla_ceo_tam/estado`
        return this.httpGet(url, headers)
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
