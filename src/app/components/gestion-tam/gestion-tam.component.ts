import { Component, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from '../utility';
import {  } from '@agm/core/services/google-maps-types';
import { MapsAPILoader } from '@agm/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PostalService } from 'src/app/services/maps/postal.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';



@Component({
    selector: 'gestion-tam',
    templateUrl: 'gestion-tam.component.html',
    styleUrls: ['./gestion-tam.component.css']
})
export class GestionTam {

    authForm: FormGroup
    headers = getHeaderStts(this.authservice.isUserLoggedIn())
    isOpen:boolean = false;
    persona: any;
    subscriptiongetTam: Subscription;
    subscriptionupdateTam: Subscription;
    subscriptionEstadosTam: Subscription;
    postalSubscription: Subscription;

    public checks: Array<any> = [
        {description: 'SI', value: true},
        {description: 'NO', value: false},
    ]
    @ViewChild('search', { static: false })
    public searchElementRef: ElementRef;
    public isSubmit = false;

    constructor(
        private formBuilder: FormBuilder, private route: ActivatedRoute,
        private _router: Router,
        private postgresService: PostgresService,
        private authservice: AuthService,
        private mapApiLoader: MapsAPILoader,
        private ngZone: NgZone,
        private postalService: PostalService
    ) { }


    ngOnInit() {
        registerLocaleData( es );
        const id = this.route.snapshot.params.id;
        this.authForm = this.formBuilder.group({
            rut: new FormControl('', [Validators.required]),
            names: new FormControl('', [Validators.required]),
            ap_paterno: new FormControl('', [Validators.required]),
            ap_materno: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            benefitsInDates: new FormControl(''),
            address: new FormControl('', [Validators.required]),
            regionAddress: new FormControl('', [Validators.required]),
            communeAddress: new FormControl('', [Validators.required]),
            numberAddress:  new FormControl('', [Validators.required]),
            routeAddress: new FormControl('', [Validators.required]),
            complementAddress: new FormControl(''),
            referenceAddress: new FormControl(''),
            postalCode: new FormControl('', [Validators.required]),
            quitBip: new FormControl(false),
            quitMandato: new FormControl(false),
            estado: new FormControl('', [Validators.required])
        })
        this.getPersonaTam(id);
        this.prepareMapInput();

    }
    prepareMapInput(){
        var options = {
            types: ['address'],
           // componentRestrictions: {country: 'cl'}
        };
        this.mapApiLoader.load().then(
            () => {
                let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                        let addressComponents = place.address_components;
                        //const found = array1.find(element => element > 10);
                        if(typeof addressComponents === 'undefined'){
                            return
                        }
                        let regionAddress = this.searchBySubKey(addressComponents, "administrative_area_level_1");
                        let communeAddress = this.searchBySubKey(addressComponents, "administrative_area_level_3")
                        let numberAddress = this.searchBySubKey(addressComponents, "street_number")
                        let routeAddress = this.searchBySubKey(addressComponents, "route")
                        this.authForm.setControl('regionAddress', new FormControl(regionAddress, [Validators.required]))
                        this.authForm.setControl('communeAddress', new FormControl(communeAddress, [Validators.required]))
                        this.authForm.setControl('numberAddress', new FormControl(numberAddress, [Validators.required]))
                        this.authForm.setControl('routeAddress', new FormControl(routeAddress, [Validators.required]))
                        this.getPostalCode(numberAddress, routeAddress, communeAddress)
                    })

                })
            }
        )
    }

    searchBySubKey(addressComponents, subkey){
        const result = addressComponents.find(element => element.types.includes(subkey))
        return typeof result !== 'undefined' ? result.long_name.toUpperCase() : null
    }

    getPostalCode(number, route, commune){
        console.log("postal code")
       this.postalSubscription = this.postalService.getGeoCodeByAddress(number, route, commune).subscribe(result => {
        console.log(result);
        if(typeof result === "undefined"){
            return;
        }
        console.log(result);
        let currenDir = JSON.parse(result.currentDir)
        let codPostal = currenDir.codPostal;
        this.authForm.setControl('postalCode', new FormControl(codPostal))
       }, error => {
           console.error(error)
       })
    }

    getPersonaTam(id: string) {
        this.subscriptiongetTam = this.postgresService.getPersonasTam(this.headers, id).subscribe(result => {
            if (result) {
                this.prepareAuthForm(result[0]);
                this.persona = result[0];
                console.log(this.persona);
                this.getEstadosTam();
            }

        }, error => {
            console.error(error)
        })
    }

    estadosTam = [];
    getEstadosTam(){
        this.subscriptionEstadosTam = this.postgresService.getEstadosTam(this.headers).subscribe(
        result => {
            this.estadosTam = result;
        }, error => {
            console.log(error)
        }
        )
    }


    prepareAuthForm(data: any) {

        this.authForm.setControl('email', new FormControl(data.email, [Validators.required]))
        this.authForm.setControl('rut', new FormControl(data.rut, [Validators.required]))
        this.authForm.setControl('names', new FormControl(data.nombres, [Validators.required]))
        this.authForm.setControl('ap_paterno', new FormControl(data.ap_paterno, [Validators.required]));
        this.authForm.setControl('ap_materno', new FormControl(data.ap_materno, [Validators.required]));
        this.authForm.setControl('phone', new FormControl(data.telefono, [Validators.required]));
        this.authForm.setControl('regionAddress', new FormControl(data.dir_region, [Validators.required]))
        this.authForm.setControl('communeAddress', new FormControl(data.dir_comuna, [Validators.required]))
        this.authForm.setControl('numberAddress', new FormControl(data.dir_numero, [Validators.required]))
        this.authForm.setControl('routeAddress', new FormControl(data.dir_calle, [Validators.required]))
        this.authForm.setControl('postalCode', new FormControl(data.dir_codigo_postal, [Validators.required]))
        this.authForm.setControl('quitBip', new FormControl(data.renuncia_bip))
        this.authForm.setControl('quitMandato', new FormControl(data.renuncia_mandato))
        let calle = data.dir_calle ? data.dir_calle : ''
        let numero = data.dir_numero ? data.dir_numero: ''
        let comuna = data.dir_comuna ? data.dir_comuna : ''
        let region = data.dir_region ? data.dir_region: ''
        let completeAd = `${calle} ${numero} , ${comuna}, ${region}`
        this.authForm.setControl('address', new FormControl(completeAd ,[Validators.required] ))

    }


    submitTam(){
        if(this.authForm.invalid){
            this.isSubmit = true;
            return;
        }
        let formData = this.prepareData(this.authForm.value)
        this.updateTamPostgre(formData);
    }

    prepareData(data){
        let preparedData = {
            rut: data.rut,
            renunciaBip: data.quitBip ? 1 : 0,
            renunciaMandato: data.quitMandato ? 1: 0,
            dirComplemento: data.complementAddress,
            email: data.email,
            dirComuna: data.communeAddress,
            dirRegion: data.regionAddress,
            dirReferencia: data.referenceAddress,
            dirCodigoPostal: data.postalCode,
            emailColaborador: this.authservice.isUserLoggedIn().email,
            id_estado: data.estado
         }
        return preparedData
    }

    updateTamPostgre(data:any){
        this.postgresService.updateTam(this.headers, data).
        subscribe(result => {
            Swal.fire({
                title: 'OK',
                text: 'Persona gestionada',
                type: 'success'
              }).then(() => {});
            this._router.navigate(['home-tam'], { skipLocationChange: true });
        }, error => {
            Swal.fire({
                title: 'Ups!',
                text: 'Algo salio mal',
                type: 'warning'
              }).then(() => {});
            console.error(error);
        })
    }


    onCancel() {
        this._router.navigate(['home-tam'], { skipLocationChange: true });
    }

    toogleIsOpen(){
        event.stopPropagation();
        this.isOpen = !this.isOpen;
    }
    onClickedOutside(event: Event){
        event.preventDefault()
        if(this.isOpen){
            event.stopPropagation();

            this.isOpen = !this.isOpen;
        }

    }
}
