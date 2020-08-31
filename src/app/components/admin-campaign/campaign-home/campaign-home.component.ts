import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { RutValidator } from '../../../rut.validator';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../../utility';


@Component({
  selector: 'app-campaign-home',
  templateUrl: './campaign-home.component.html',
  styleUrls: ['./campaign-home.component.css']
})

export class CampaignHomeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ordersData: any = [];
  navigationSubscription;
  campaignsEjecutivo: any = [];
  control: any = [];
  checked: boolean;
  searchForm;
  nombreEjec: any;
  emailEjec: any;
  lengthRut;
  rutEjec: any;

  constructor(
    private formBuilder: FormBuilder,
    public firestoreservice: FirestoreService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, private postgresService: PostgresService

    ) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
    }

  initialiseInvites() {
    this.authService.getestado();
    let headers = getHeaderStts(this.authService.isUserLoggedIn())
    const id = this.route.snapshot.paramMap.get('id');
    this.searchForm = this.formBuilder.group(
      {rut: new FormControl('', [Validators.required, RutValidator.validaRut]),
    });
    this.form = this.formBuilder.group({
      orders: new FormArray([], minSelectedCheckboxes(1))
    });
    this.postgresService.getUsuarioPorMail(id, headers).subscribe(
      data => {
        if(data){
          let temp = data[0];
          this.nombreEjec = temp.nombres;
          this.emailEjec = id;
          this.rutEjec = temp.rut;
          this.initProcessCheckBox(this.rutEjec);
        }
      }
    )

  }

  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => (v ? this.ordersData[i].id_campaign : null))
      .filter(v => v !== null);

    if (this.form.invalid) {
        return;
      }
    let data: any = [];

    data = {
          id_campaigns: selectedOrderIds
        };

    this.firestoreservice.insertUpdateCampangsEjecutivo(this.rutEjec.toString(), data);

    Swal.fire({
        title: 'OK',
        text: 'Campaña ha sido actualizada',
        type: 'success'
      }).then(() => {});

      this.router.navigate([`/admin-roles`]);
  }


  initProcessCheckBox(rut: any) {
    this.firestoreservice.getCampaingByEjec(rut).subscribe((estadosSnapShot: any) => {
      this.campaignsEjecutivo = [];
      
      if(estadosSnapShot){
        estadosSnapShot.id_campaigns.forEach((o, i) => {
        this.campaignsEjecutivo.push({
          id_campaign: o
        });
      });
      }
    });

    this.firestoreservice.getCampaingsByProcess(1).subscribe(
      (resp: any) => {
        this.ordersData = [];
         this.ordersData = resp;
         this.addCheckboxes();
        });
  }

  private addCheckboxes() {
    this.ordersData.forEach((o, i) => {
      this.control = [];
      this.checked = false;
      this.campaignsEjecutivo.forEach((a, b) => {
        if (o.id_campaign === a.id_campaign) {
          this.checked = true;
        }
      });
      this.control = new FormControl(this.checked);
      (this.form.controls.orders as FormArray).push(this.control);

    });
  }

  ngOnInit() {

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

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map(control => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => next ? prev + next : prev, 0);

    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}
