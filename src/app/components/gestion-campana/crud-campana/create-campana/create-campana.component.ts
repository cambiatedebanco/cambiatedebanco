import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import { getHeaders } from 'src/app/components/utility';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-campana',
  templateUrl: './create-campana.component.html',
  styleUrls: ['./create-campana.component.css']
})
export class CreateCampanaComponent implements OnInit {
  submitted = false;
  createCampainForm;
  headers = null;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private postgresService: PostgresService,
    private router: Router) {
    this.createCampainForm = this.formBuilder.group(
      {
        nombre: new FormControl('', [Validators.required]),
        tipo: new FormControl('', [Validators.required])
      }
    )
  }

  ngOnInit() {
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) {  
      this.headers = getHeaders(user)
       } })
    ).subscribe(
      _ => {}
    )
  }

  onSubmit(){
    if(this.createCampainForm.invalid){
      return
    }
    
    let data = this.createCampainForm.value;
    data.created_time = new Date();
    this.createCampain(data);
  }
  createCampain(data){
    this.postgresService.addCampain(data, this.headers).subscribe(_ => {
      Swal.fire({title:'OK',text: 'Campaña creada exitosamente'}).then(_ => 
        this.router.navigate(['/crud-campana'], {skipLocationChange:true})
      )
    }, error => {
      console.error(error)
      Swal.fire({title:'Error', text: 'No se ha podido ingresar la campaña de manera exitosa.', type: 'error'}).then(() => {})
    })
  }
  
}
