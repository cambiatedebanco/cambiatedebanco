import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-chat-form',
  templateUrl: './ticket-chat-form.component.html',
  styleUrls: ['./ticket-chat-form.component.css']
})
export class TicketChatFormComponent implements OnInit, OnDestroy {
  @Input() params: any;
  @Input() idDoc: any;
  navigationSubscription;
  updateForm;
  generoSelect: any;
  submitted = false;
  selected: any;

  constructor(public firestoreservice: FirestoreService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });

  }

  initialiseInvites() {
    this.updateForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.email, Validators.required]),
        numero_cliente: new FormControl('', [Validators.required]),
        rut: new FormControl('', [Validators.required]),
        //genero: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,10}')]),
        direccion: new FormControl('', [Validators.required]),
        comentarios: new FormControl(''),
      });

    this.generoSelect = [
        {genero: 'M', name: 'Masculino'},
        {genero: 'F', name: 'Femenino'},
        {genero: 'O', name: 'Otro'},
      ];

    this.selected = ' ';
  }

  onSubmit(id) {

    this.submitted = true;


    if (this.updateForm.invalid) {
      return;
    }

    const formData = this.updateForm.value;
    const data = {
      idDocumento: id,
      email: formData.email,
      numero_cliente: formData.numero_cliente,
      rut: formData.rut,
      genero: 'F',
      telefono: formData.telefono,
      direccion: formData.telefono,
      comentarios: formData.comentarios
    };

    this.firestoreservice.updateFormAtencionVirtual(id, data);

    Swal.fire({
      title: 'OK',
      text: 'Formulario ha sido actualizado',
      type: 'success'
    }).then(() => {});

  }

  inicializaForm(idDoc) {
    this.firestoreservice.getFormAtencionVirtual(idDoc).subscribe((fichaDoc: any) => {
      if (fichaDoc.payload.exists) {

        this.updateForm.controls.email.setValue(fichaDoc.payload.data().email);
        this.updateForm.controls.numero_cliente.setValue(fichaDoc.payload.data().numero_cliente);
        this.updateForm.controls.rut.setValue(fichaDoc.payload.data().rut);
        this.updateForm.controls.telefono.setValue(fichaDoc.payload.data().telefono);
        this.updateForm.controls.direccion.setValue(fichaDoc.payload.data().direccion);
        this.updateForm.controls.comentarios.setValue(fichaDoc.payload.data().comentarios);
      }
    });
}
  ngOnInit() {
    this.inicializaForm(this.idDoc);
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

}
