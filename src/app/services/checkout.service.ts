import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }

  goCheckOut(products) {
    const CheckOut = firebase.functions().httpsCallable('checkout');
    return  CheckOut(products);
  }
  
}