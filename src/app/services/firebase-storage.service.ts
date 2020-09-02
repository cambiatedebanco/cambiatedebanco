import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  yourfile:File;
  profileurl = null;
  constructor(
    private storage: AngularFireStorage
  ) { }

  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }



  public downloadFile(): void {

    
   
    
    
/*
    const id = Math.random().toString(36).substring(2);
    const fileRef:AngularFireStorageReference=this.storage.ref("graphite-maker-287716.appspot.com/1599015035132425116.jpg").child(id);
    const task: AngularFireUploadTask =fileRef.put(this.yourfile);
    task.snapshotChanges().pipe(
        finalize(() => {
            fileRef.getDownloadURL().subscribe(downloadURL => {
              this.profileurl=downloadURL;
                console.log(downloadURL);
            });
      })
    ).subscribe();*/

    this.storage.upload("graphite-maker-287716.appspot.com", '1599015035132425116.jpg').then(rst => {
      rst.ref.getDownloadURL().then(url => {
        console.log(url);
      })
    })


    /*this.storage.ref(`graphite-maker-287716.appspot.com/1599015035132425116.jpg `)
      .getDownloadURL().subscribe((url) => {
        console.log(url);
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {

            const blob = new Blob([xhr.response], { type: 'image/jpg' });
            const a: any = document.createElement('a');
            a.style = 'display: none';
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = '1599015035132425116';
            a.click();
            window.URL.revokeObjectURL(url);
          };
          xhr.open('GET', url);
          xhr.send();
          return;
        }).catch(function(error) {
          // Handle any errors
          console.log(error);
        });*/
      }
}
