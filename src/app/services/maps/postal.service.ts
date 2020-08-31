import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostalService {
    BASE_URI = "https://us-central1-nicanor.cloudfunctions.net/fn_codigopostal"

    constructor(private http: HttpClient){}

    public getGeoCodeByAddress(number, route, commune): Observable<any>{
        let path = this.BASE_URI + `?comuna=${commune}&calle=${route}&numero=${number}`
        return this.http.get<any>(path)
    }

}