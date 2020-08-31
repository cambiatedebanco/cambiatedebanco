import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import { getHeaders } from 'src/app/components/utility';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-campana',
  templateUrl: './update-campana.component.html',
  styleUrls: ['./update-campana.component.css']
})
export class UpdateCampanaComponent implements OnInit {
  toUpdateId = null;
  headers = null;
  campana = null;
  updateForm;
  constructor(private formBuilder:FormBuilder,
    private authService:AuthService,
    private postgresService:PostgresService,
    private router:ActivatedRoute,
    private _route: Router
    ) { }

  ngOnInit() {
    this.initialiseInvites()
  }

  initialiseInvites(){

    this.toUpdateId = this.router.snapshot.paramMap.get('id')
    console.log('INITIALIZE INVITES')
    console.log(this.toUpdateId)
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => {if (user){
        console.log('tap is user')
        this.headers = getHeaders(user)
        this.getCampana();
      }

    })
    ).subscribe(_ => {
      
    }) 
  }

  getCampana(){
    console.log('get campana')
    this.postgresService.getAllCampains(this.headers, this.toUpdateId).subscribe(
      data => {
        console.log("get campana")
        console.log(data);
        if(data[0]){
          this.campana = data[0]
        this.prepareForm(data[0])
      }
      }
    )
  }
  prepareForm(data){
    this.updateForm = this.formBuilder.group({
      nombre: new FormControl(data.nombre, [Validators.required]),
      tipo: new FormControl(data.tipo, [Validators.required])
    })
  }

  onSubmit(){
    if(this.updateForm.invalid){
      return;
    }
    let data = this.updateForm.value;
    data.idCampana = this.toUpdateId;
    this.updateCampain(data);
  }
  updateCampain(data){
    this.postgresService.updateCampain(data, this.headers).subscribe(_=>{
      Swal.fire({title:'OK',text: 'Campaña actualizada exitosamente'}).then(_ => 
        this._route.navigate(['/crud-campana'], {skipLocationChange:true})
      )
    }, error => {
      console.log(error)
      Swal.fire({title:'Error', text: 'No se ha podido ingresar la campaña de manera exitosa.', type: 'error'}).then(() => {})
    })
  }
}
