import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  searchValue: string = "";
  results: any;
  constructor(private firestore: AngularFirestore) {


   }

   firequery(start, end) {

    return this.firestore.collection('cla_scanner_empresa', ref => ref.limit(4).orderBy('RAZON_SOCIAL_EMPRESA').startAt(start).endAt(end)).valueChanges();
  }
  firequery_rut(Rutempresa) {
    return this.firestore.collection('cla_scanner_empresa',ref=>ref.limit(4).orderBy('RUT_EMPRESA','asc').where('RUT_EMPRESA','>=',Number(Rutempresa))).valueChanges();
  }

  firequery_rut2_test(Rutempresa) {
    return this.firestore.collection('cla_scanner_empresa',ref=>ref.limit(4).orderBy('RUT_EMPRESA','asc').where('RUT_EMPRESA','>=',Number(Rutempresa))).valueChanges();
  }
  public getallempresas() {
    return this.firestore.collection('cla_scanner_empresa', ref => ref.orderBy('RAZON_SOCIAL_EMPRESA')).valueChanges();
  }

public searchEmpresa(search:string){

  return this.firestore.
  collection('cla_scanner_emp', ref=>ref.limit(5).where('KEYWORDS','array-contains', search.toUpperCase()).orderBy('RAZON_SOCIAL_EMPRESA')).valueChanges();
}
public searchComuna(search:string){

  return this.firestore.
  collection('cla_scanner_comuna', ref=>ref.limit(5).where('KEYWORDS','array-contains', search.toUpperCase()).orderBy('nombre')).valueChanges();
}

public searchSucursal(search:string){

  return this.firestore.
  collection('cla_scanner_sucursales', ref=>ref.limit(5).where('KEYWORDS','array-contains', search.toUpperCase()).orderBy('SUCURSAL')).valueChanges();
}

public searchAfiliado(search:string){

  return this.firestore.
  collection('cla_scanner_datos_afiliados', ref=>ref.limit(5).where('KEYWORDS','array-contains', search.toUpperCase()).orderBy('NOMBRES')).valueChanges();
}


  public getSucursales(){
    return this.firestore.collection('sucursales').snapshotChanges();

  }

  public getColaboradores(){
    return this.firestore.collection('colaboradores').snapshotChanges();

  }

  public getEstados(){
    return this.firestore.collection('estados',ref=>ref.orderBy('orden','asc')).snapshotChanges();

  }

  public getRegiones(){
    return this.firestore.collection('regiones',ref=>ref.orderBy('id_region','asc')).snapshotChanges();

  }

  public getPost(){
    return this.firestore.collection('twitter_post',ref=>ref.orderBy('created_at','desc')).snapshotChanges();

  }

  public getContexto(formid: string){
    return this.firestore.collection('forms', ref=>ref.where('id_form','==',formid)).snapshotChanges();

  }
  public getCentrar(regionid: string){
    return this.firestore.collection('regiones', ref=>ref.where('id_region','==',regionid)).snapshotChanges();

  }

  public getUf(Fecha: string){
    return this.firestore.collection('cla_scanner_uf', ref=>ref.where('FECHA','==',Fecha)).snapshotChanges();

  }

  public getTwitter(){
    return this.firestore.collection('twitter_post', ref=>ref.orderBy('created_at','desc')).snapshotChanges();

  }

  public getComercios(regionid: number){
    return this.firestore.collection('comercios', ref=>ref.where('id_region','==',regionid).orderBy('estado')).snapshotChanges();

  }
  //Obtiene un gato
  public getLead(documentId: string) {
    return this.firestore.collection('cla_scanner_leads').doc(documentId).snapshotChanges();
  }

  public updateLead(documentId: string, data: any) {
    return this.firestore.collection('cla_scanner_leads').doc(documentId).update(data);
  }
  public updateLeadNuevo(documentId: string, data: any) {

    return this.firestore.collection('cla_scanner_leads').doc(documentId).update(data);
  }

  public updateUsuario(documentId: string, data: any) {

    return this.firestore.collection('cla_scanner_usuarios').doc(documentId).update(data);
  }

  public addUsuario(documentId: string, data: any) {

    return this.firestore.collection('cla_scanner_usuarios').doc(documentId).set(data);
  }

  public deleteUsuario(documentId: string) {

    return this.firestore.collection('cla_scanner_usuarios').doc(documentId).delete();
  }

  public getEmpresa(Rutempresa: string) {

    return this.firestore.collection('scan_empresas',ref=>ref.where('RutEmpresa','==',Number(Rutempresa))).snapshotChanges();


  }

  public getProducto(Rutempresa: string, categoria: number) {
    return this.firestore.collection('scanner_ofertas',ref=>ref.where('RutEmpresa','==',Number(Rutempresa)).where('categoria','==',categoria)).snapshotChanges();
  }


  public getBeneficios(Rutempresa: string) {

    return this.firestore.collection('BSS_SCANNER',ref=>ref.where('RutEmpresa','==',Number(Rutempresa))).snapshotChanges();
  }
  public getEmpresa2(Rutempresa: string) {
    return this.firestore.collection('scanner_empresas',ref=>ref.where('RutEmpresa','==',Number(Rutempresa))).snapshotChanges();
  }

  public getEmpresa_cla(Rutempresa: string) {
    return this.firestore.collection('cla_scanner_emp').doc(Rutempresa).snapshotChanges();
  }

  getUsuariosAll() {
    return  this.firestore.collection('cla_scanner_usuarios',ref=>ref.orderBy('RUT','asc')).valueChanges({ idField: 'propertyId' });
}

  public getEmpresa_cla_credito(Rutempresa: string) {
    return this.firestore.collection('cla_scanner_credito_detalle',ref=>ref.where('RUT_EMPRESA','==',Number(Rutempresa))).snapshotChanges();
  }

  public getEmpresa_cla_ahorro(Rutempresa: string) {
    return this.firestore.collection('cla_scanner_ahorro_detalle',ref=>ref.where('RUT_EMPRESA','==',Number(Rutempresa))).snapshotChanges();
  }

  public getEmpresas() {
    return this.firestore.collection('scanner_empresa').snapshotChanges();
  }
  public getEmpresas_cla(offset: any, batch: any) {
    return this.firestore
      .collection('cla_scanner_empresa', ref =>
        ref
          .orderBy('RAZON_SOCIAL_EMPRESA')
          .startAfter(offset)
          .limit(batch)
      );

  }

  public getEmpresas_cla_beneficios(Rutempresa: string) {
    return this.firestore.collection('cla_scanner_beneficios', ref=>ref.where('RUT_EMPRESA','==',Number(Rutempresa)).orderBy('ORDEN')).snapshotChanges();

  }

  public getEmpresas_cla_oferta(Rutempresa: string,Categoria:string) {
    return this.firestore.collection('cla_scanner_ofertas', ref=>ref.where('RUT_EMPRESA','==',Number(Rutempresa)).where('CATEGORIA','==',Categoria)).snapshotChanges();

  }


  public getAfiliados_cla_ofertas(Rutpersona: string, categoria: string) {
    return this.firestore.collection('cla_scanner_ofertas_af',ref=>ref.where('RUT_PERSONA','==',Number(Rutpersona)).where('CATEGORIA','==',categoria)).snapshotChanges();

  }


  public getAfiliado_cla(Rutpersona: string) {
    return this.firestore.collection('cla_scanner_datos_afiliados').doc(Rutpersona).snapshotChanges();
  }

  public getMora_cla(Rutpersona: string) {
    return this.firestore.collection('cla_scanner_mora',ref=>ref.where('RUT_CLIENTE','==',Number(Rutpersona)).orderBy('MORA_OP','desc')).snapshotChanges();

  }

  public getCampanaSeguroAuto(Rutpersona: string) {
    return this.firestore.collection('cla_scanner_campana_auto_total',ref=>ref.where('RUT_PERSONA','==',Number(Rutpersona)).where('PREDETERMINADO','==',1)).snapshotChanges();
  }

  public getCampanaSeguroAutoRef(rutPersona: string) {
    return this.firestore.collection(
      'cla_scanner_campana_auto_total', ref => ref.where(
        'RUT_PERSONA', '==', Number(rutPersona)).orderBy('PREDETERMINADO', 'desc')).snapshotChanges();
  }

  public getGestorCampana(EmailPersona: string) {
    return this.firestore.collection('cla_scanner_gestor_campana', ref=>ref.where('CORREO_PERSONA','==',EmailPersona).orderBy('ORDEN')).snapshotChanges();

  }

  /***********NUEVOS SERVICIOS */
  public getAfiliados_cla_ofertas_aprobados(Rutpersona: string) {
    return this.firestore.collection('cla_scanner_oferta_aprobado_af',ref =>ref.where('RUT_PERSONA','==',Number(Rutpersona))).snapshotChanges();

  }

  public getAfiliados_cla_ofertas_efi(Rutpersona: string) {
    return this.firestore.collection('cla_scanner_oferta_efi_af',ref =>ref.where('RUT_PERSONA','==',Number(Rutpersona))).snapshotChanges();

  }

/*** NUEVOS SERVICIOS */
public createLog(coleccion:string,data: any) {
  return this.firestore.collection(coleccion).add(data);
}
public addLead(data){
  return this.firestore.collection('cla_scanner_leads').add(data);
}

public createPensionado(data: any) {
  return this.firestore.collection('cla_scanner_leads').add(data);
}


public getNotifications(rut: number) {
  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).where('nuevo','==',1).orderBy('created_time','desc')).snapshotChanges();

}

public getNotificationsCount(rut: number) {
  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).where('nuevo','==',1)).snapshotChanges();

}

public getLeads(rut: number){
  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).orderBy('created_time','desc')).snapshotChanges();

}

public getBrands() {
  return this.firestore.collection('cla_scanner_marca_auto', ref => ref.orderBy('MARCA')).valueChanges()
}

public getNotificationsAll(quien?: []) {
  var valores=[];
  if (quien){

  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',1).where('rut_agente','==',quien).orderBy('created_time','desc')).snapshotChanges();
  }else{
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',1).orderBy('created_time','desc')).snapshotChanges();

  }
}

public getNotificationsCountAll(quien?: []) {
  var valores=[];
  if (quien){

  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',1).where('rut_agente','==',quien)).snapshotChanges();
  }else{
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',1)).snapshotChanges();

  }
}




public getLeadsAll(quien?: []){
  var valores=[];

  if (quien){

  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_agente','==',quien).orderBy('created_time','desc')).snapshotChanges();
}else{
  return this.firestore.collection('cla_scanner_leads', ref=>ref.orderBy('created_time','desc')).snapshotChanges();


}

}

public getLeadsAll2(quien?: []){
  var valores=[];

  if (quien){

  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_agente','==',quien).orderBy('created_time','desc')).valueChanges({ idField: 'propertyId' });
}else{
  return this.firestore.collection('cla_scanner_leads', ref=>ref.orderBy('created_time','desc')).valueChanges({ idField: 'propertyId' });

}

}

public getLeadsByEstado(rut:Number, estado:string){
 
    if(estado == 'nuevo'){
      return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_agente','==',rut).where('nuevo','==',1).where('gestionado','==',0).orderBy('created_time','desc')).valueChanges({ idField: 'propertyId' });
    }else if(estado == 'pendiente'){
      return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_agente','==',rut).where('nuevo','==',0).where('gestionado','==',0).orderBy('created_time','desc')).valueChanges({ idField: 'propertyId' });
    }else{
      return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_agente','==',rut).where('nuevo','==',0).where('gestionado','==',1).orderBy('created_time','desc')).valueChanges({ idField: 'propertyId' });
    }
  }


public getLeadsByEstadoEjec(rut:Number, estado:string){
  if(estado == 'nuevo'){
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).where('nuevo','==',1).where('gestionado','==',0)).snapshotChanges();
  }else if(estado == 'pendiente'){
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).where('nuevo','==',0).where('gestionado','==',0)).snapshotChanges();
  }else{
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('rut_colaborador','==',rut).where('nuevo','==',0).where('gestionado','==',1)).snapshotChanges();
  }
}

public getLeadsByEstadoAll(estado:string){
  if(estado == 'nuevo'){
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',1).where('gestionado','==',0)).valueChanges({ idField: 'propertyId' });
  }else if(estado == 'pendiente'){
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',0).where('gestionado','==',0)).valueChanges({ idField: 'propertyId' });
  }else{
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('nuevo','==',0).where('gestionado','==',1)).valueChanges({ idField: 'propertyId' });
  }
}

public getmisejecutivos(rut:Number){
  return this.firestore.collection('cla_scanner_usuarios', ref=>ref.where('RUT_AGENTE','array-contains',rut).where('ES_EJEC','==',1)).snapshotChanges();

}

public getCampaign(id:string){
  return this.firestore.collection('campaigns').doc(id).valueChanges();
}

/****SERVICIOS: REFERIDOS AUTO */
public getReferidosAutoAll(rutColaborador:Number){
    return this.firestore.collection('cla_scanner_referidos_auto', ref=>ref.where('rut_colaborador','==',rutColaborador).orderBy('timeStamp','desc')).snapshotChanges();

}

public createReferidoAuto(data: any) {
  return this.firestore.collection('cla_scanner_referidos_auto').add(data);
}
public getCarPatentRefered(patent: string) {
  return this.firestore.collection('cla_scanner_referidos_auto', ref => ref.where('patente', '==', patent)).snapshotChanges();
}
// SIMULADOR
public createSimulation(data: any){
  return this.firestore.collection('cla_credito_simulado_test').add(data)
}

public getSocialCreditData(mount: number, payments: number, ispensionado: number) {
  return this.firestore.collection(
    'cla_scanner_tasa_credito', ref => ref.where(
      'CUOTA', '==', payments).where('RANGO', '==', mount).where(
        'TIPO', '==', ispensionado)).snapshotChanges();
}

public insertChatMensaje(docId: string, data: any) {
  return this.firestore.collection('cla_ceo_tickets').doc(docId).collection('mensaje').add(data);
}

public getTicketsEjecutivo(rutEjecutivo: any) {
  return this.firestore.collection('cla_ceo_tickets', ref=>ref.where('rut_ejecutivo','==',rutEjecutivo).orderBy('fecha_creacion','desc')).snapshotChanges();
}

public getChatByDocument(idDoc: any) {
  return this.firestore.collection('cla_ceo_tickets').doc(idDoc).collection('mensaje', ref=>ref.orderBy('fecha_mensaje','asc')).snapshotChanges();
}

public updateEstadoTicketAtencion(idDoc: any, data: any) {
  return this.firestore.collection('cla_ceo_tickets').doc(idDoc).update(data);
}

public getFormAtencionVirtual(idDoc: string) {
   //return this.firestore.collection('cla_ceo_ficha_atencion',ref=>ref.where('rut','==',idDoc.trim())).snapshotChanges();
  return this.firestore.collection('cla_ceo_ficha_atencion').doc(idDoc).snapshotChanges();
}

public updateFormAtencionVirtual(idDoc: any, data: any) {
  return this.firestore.collection('cla_ceo_ficha_atencion').doc(idDoc).set(data);
}

public getQuarantineForMap(){
  return this.firestore.collection('cla_ceo_cuarentena', ref=>ref.where('comuna','==','NUNOA')).snapshotChanges();
}

public getAllLeadsByArrayId(idCampaigns: []) {

  return this.firestore.collection('cla_scanner_leads', ref=>ref.where('tipo_campana','in',idCampaigns).where('created_time','>=',this.getDateFilter()).orderBy('created_time', 'desc')).valueChanges({ idField: 'propertyId' });
}

public getLeadsArrayIdState(idCampaigns: [], estado: string, startDate: any, endDate: any) {
  //const startDateFormat = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
  //const endDateFormat = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 24, 0, 0);
  if (estado === 'nuevo') {
    return this.firestore.collection('cla_scanner_leads', ref => ref.
    where('tipo_campana', 'in', idCampaigns).
    where('nuevo', '==', 1).
    where('gestionado', '==', 0).
    where('fecha', '>=', this.getFechaString(startDate)).
    where('fecha', '<=', this.getFechaString(endDate)).
    orderBy('fecha', 'desc').
    orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });

  } else if ( estado === 'pendiente') {
    return this.firestore.collection('cla_scanner_leads', ref => ref.
    where('tipo_campana', 'in', idCampaigns).
    where('nuevo', '==', 0).
    where('gestionado', '==', 0).
    where('fecha', '>=', this.getFechaString(startDate)).
    where('fecha', '<=', this.getFechaString(endDate)).
    orderBy('fecha', 'desc').
    orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });

  } else if ( estado === 'propenso') {
    return this.firestore.collection('cla_scanner_leads', ref => ref.
    where('tipo_campana', 'in', idCampaigns).
    where('star', '==', 1).
    where('fecha', '>=', this.getFechaString(startDate)).
    where('fecha', '<=', this.getFechaString(endDate)).
    orderBy('fecha', 'desc').
    orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });

  } else {
    return this.firestore.collection('cla_scanner_leads', ref => ref.
    where('tipo_campana', 'in', idCampaigns).
    where('nuevo', '==', 0).
    where('gestionado', '==' , 1).
    where('fecha', '>=', this.getFechaString(startDate)).
    where('fecha', '<=', this.getFechaString(endDate)).
    orderBy('fecha', 'desc').
    orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });

  }
}

public getCampaingsByProcess(idProcess: any) {
  return this.firestore.collection('campaigns', ref => ref.orderBy('id_campaign')).valueChanges();
}

public insertUpdateCampangsEjecutivo(docId: string, data: any) {
  return this.firestore.collection('cla_ceo_roles_campaigns').doc(docId).set(data);
}

public getCampaingByEjec(idDoc) {
  return this.firestore.collection('cla_ceo_roles_campaigns').doc(idDoc.toString()).valueChanges();
}

public deleteCampaignsEjec(documentId: string) {
  return this.firestore.collection('cla_ceo_roles_campaigns').doc(documentId).delete();
}

public addSurvey(data){
  return this.firestore.collection('cla_ceo_survey').add(data);
}
public getSurveyByRutTipo(rut: any, idEncuesta: any) {
  return this.firestore.collection('cla_ceo_survey', ref=>ref.where('rut','==',Number(rut)).where('tipo_encuesta','==',Number(idEncuesta))).snapshotChanges();
}
public getSurveyByRutTipoEmail(rut: any, idEncuesta: any, email: any) {
  return this.firestore.collection('cla_ceo_survey', ref=>ref.where('rut','==',Number(rut)).where('tipo_encuesta','==',Number(idEncuesta)).where('email','==',email)).snapshotChanges();
}
addUnsuscribedMail(value: any) {
  return this.firestore.collection('cla_ceo_desuscritos').add(value)
}

public getGestionPendiente(mail_ejecutivo: string, estado:string){
  return this.firestore.collection(
    'cla_ceo_gestion_cartera', ref=>ref.where('ejecutivo', '==', mail_ejecutivo).where('estado','==', estado)
    ).valueChanges({ idField: 'propertyId' });
}

public updateGestionCartera(documentId: string, data: any) {
  return this.firestore.collection('cla_ceo_gestion_cartera').doc(documentId).update(data);
}

public getTop11LeadsByArrayId(idCampaigns: [], rut?: any) {
  if(rut){
    return this.firestore.collection('cla_scanner_leads', ref=>ref.limit(11).where('tipo_campana','in',idCampaigns).where('nuevo','==',1).where('rut_colaborador','==',Number(rut)).where('created_time','>=',this.getDateFilter()).orderBy('created_time', 'desc')).valueChanges({ idField: 'propertyId' });
  }else{
    return this.firestore.collection('cla_scanner_leads', ref=>ref.limit(11).where('tipo_campana','in',idCampaigns).where('nuevo','==',1).where('created_time','>=',this.getDateFilter()).orderBy('created_time', 'desc')).valueChanges({ idField: 'propertyId' });
  }  
}

public getLeadsByArrayIdRut(idCampaigns: [], rut: any, startDate: any, endDate: any) {
  if(rut) {
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('tipo_campana','in',idCampaigns).where('rut_colaborador','==',Number(rut)).where('fecha','>=',this.getFechaString(startDate)).where('fecha','<=',this.getFechaString(endDate)).orderBy('fecha', 'desc').orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });
  } else {
    return this.firestore.collection('cla_scanner_leads', ref=>ref.where('tipo_campana','in',idCampaigns).where('fecha','>=',this.getFechaString(startDate)).where('fecha','<=',this.getFechaString(endDate)).orderBy('fecha', 'desc').orderBy('probabilidad', 'desc')).valueChanges({ idField: 'propertyId' });
  }
}

public getCEOSucursales() {
  return this.firestore.collection('sucursales', ref => ref.orderBy('sucursal','asc')).snapshotChanges();
}

public insertEjecCampaign(data: any) {
  return this.firestore.collection('cla_scanner_asigna_leads').add(data);
}

public deleteAsignaLeads(documentId: string) {
  return this.firestore.collection('cla_scanner_asigna_leads').doc(documentId).delete();
}

public getCampaings() {
  return this.firestore.collection('campaigns', ref => ref.orderBy('id_campaign', 'asc')).snapshotChanges();
}

public setPrioriByDoc(docId: string, data: any) {
    return this.firestore.collection('prioridad').doc(docId).set(data);
}

public getECV() {
  return this.firestore.collection('cla_scanner_usuarios', ref=>ref.where('PUESTO_REAL','==','EJECUTIVO CALIDAD DE VIDA').orderBy('RUT', 'desc')).valueChanges({ idField: 'propertyId' });
}

public getAsignaLeads() {
  return this.firestore.collection('cla_scanner_asigna_leads', ref=>ref.orderBy('rut_ejecutivo','desc')).valueChanges({ idField: 'propertyId' });
}

public setOrigenDestino(docId: string, data: any) {
  return this.firestore.collection('cla_ceo_origen_destino').doc(docId).set(data);
}

public getOrigenDestino() {
  return this.firestore.collection('cla_ceo_origen_destino', ref=>ref.orderBy('origen','desc')).valueChanges({ idField: 'propertyId' });
}

public getNewLeadsToReassign(codigoCampana: any, codigoSucursal: any, arrayColaboradores: any){
  let query = this.firestore.collection('cla_scanner_leads', ref=>ref
  .where('tipo_campana','==',Number(codigoCampana))
  .where('nuevo','==',1)
  .where('codigo_sucursal','==',Number(codigoSucursal))
  .where('rut_colaborador','in',arrayColaboradores));
  return query.get();
}

public batchUpdateLeads(rut, email, idDocuemntsArray) {
  const batch = this.firestore.firestore.batch();
  const collectionRef = this.firestore.collection('cla_scanner_leads');

  idDocuemntsArray.forEach((element: any) => {
    console.log('en batch update foreach')
    const newDocRef = collectionRef.doc(element.documentId).ref;
    batch.update(newDocRef , {
      rut_colaborador: rut,
      email_colaborador: email
    });
  });

  return batch.commit();
}

public cla_ceo_cuarentena(Rutempresa: string) {
  return this.firestore.collection('cla_ceo_cuarentena',ref=>ref.where('comuna','==','VIACURA')).get();
}

getDateFilter() {
  const date = new Date();
  date.setDate(date.getDate() - 60);
  date.setHours(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  date.setSeconds(0);
  return date;
}

getFechaString(fecha) {
  const mes = '0' + (fecha.getMonth() + 1).toString();
  const dia = '0' + (fecha.getDate()).toString();

  return fecha.getFullYear() + mes.substring(mes.length, mes.length - 2) + dia.substring(dia.length, dia.length - 2);
}

}
