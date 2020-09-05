import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  yourfile:File;
  profileurl = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {  }

  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

  public downloadFile(file, rut) {
    this.storage.ref('/'+file+'.pdf').getDownloadURL().subscribe((ref: any) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
        saveAs(blob, 'certificado_deuda_'+rut+'.pdf')
      };
      xhr.open('GET', ref);
      xhr.send();
    });

  }


}
