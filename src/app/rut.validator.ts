import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as rutValidator from 'rut-validator-ca';
export class RutValidator {

    static validaRut(control: AbstractControl) : ValidationErrors | null {
     // let rutValidator = require('rut-validator-ca');
      let strRut=String(control.value);
      let res_dv =rutValidator(strRut);

      if (res_dv === false && strRut.length > 6 ) {
        return { validaRut : true };
      }
      return null;
    }
}
