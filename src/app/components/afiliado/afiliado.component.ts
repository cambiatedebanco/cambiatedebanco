import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-afiliado',
  templateUrl: './afiliado.component.html',
  styleUrls: ['./afiliado.component.css']
})
export class AfiliadoComponent implements OnInit {

  public usoOferta: any =[];
  public usoOferta2: any =[];
  public usoOferta3: any =[];
  public afiliados: any =[];
  public bss: any =[];
  constructor(public _firestoreservice: FirestoreService, private route:ActivatedRoute) {

    const id= this.route.snapshot.paramMap.get('id');


    this._firestoreservice.getAfiliado_cla(id).subscribe((afiliado:any)=>{
      this.afiliados=[];
       this.afiliados.push({
        id: afiliado.payload.id,
        data: afiliado.payload.data()
      })

  });




    this._firestoreservice.getEmpresas_cla_oferta(id,'Crédito').subscribe((bssSnapShot:any)=>{

      this.usoOferta=[];
      bssSnapShot.forEach((oferta : any)=>{


        this.usoOferta.push({
          id: oferta.payload.doc.id,
          data: oferta.payload.doc.data()
        });

    });


  }
    );

    this._firestoreservice.getEmpresas_cla_oferta(id,'Ahorro').subscribe((bssSnapShot:any)=>{

      this.usoOferta2=[];
      bssSnapShot.forEach((oferta : any)=>{


        this.usoOferta2.push({
          id: oferta.payload.doc.id,
          data: oferta.payload.doc.data()
        });

    });


  }
    );


    this._firestoreservice.getEmpresas_cla_oferta(id,'Beneficios').subscribe((bssSnapShot:any)=>{

      this.usoOferta3=[];
      bssSnapShot.forEach((oferta : any)=>{


        this.usoOferta3.push({
          id: oferta.payload.doc.id,
          data: oferta.payload.doc.data()
        });

    });


  }
    );

  }

  ngOnInit() {
  }

}
