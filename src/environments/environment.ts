export const environment = {
  production: false,
  //DEV
  firebase : {
    apiKey: "AIzaSyDJbo3mV3SXqyNTmA6oJejWSK0JoRrexYo",
    authDomain: "fenix-cp-286516.firebaseapp.com",
    databaseURL: "https://fenix-cp-286516.firebaseio.com",
    projectId: "fenix-cp-286516",
    storageBucket: "fenix-cp-286516.appspot.com",
    messagingSenderId: "481596145278",
    appId: "1:481596145278:web:a4b573211abba8c2d9622f",
    measurementId: "G-1M4YBZXFCE"
  },
  gcp:{
    clientId:'481596145278-4d6b32o286k9bp6nmf6jiak1to8etp2p.apps.googleusercontent.com',
    mapsKey: 'AIzaSyAarjPy9Qk9bSEYvwY08o5rA4p_CVzMMSs'
  },
  //ceoapi_url: 'https://us-central1-nicanor.cloudfunctions.net/apiceocrm'
  ceoapi_url: 'http://localhost:3000',
  cardif_api_credentials : {
    user: 'userCla',
    pass: 'zaxscdvf'
  },
  cardif_api_login: 'http://testacc.s3clientes.cl:3000/login',
  cardif_api_data: 'http://testacc.s3clientes.cl:3000/ClaSeguro',
  //mercadopago_api:'https://us-central1-fenix-cp-286516.cloudfunctions.net/apimercadopago'
  mercadopago_api:'http://localhost:4000'
  /*PRD
  firebase : {
    apiKey: 'AIzaSyDZoHPnVaUd7a-2kX80sCfdB1hNUBjYlQs',
    authDomain: 'nicanor-5933d.firebaseapp.com',
    databaseURL: 'https://nicanor-5933d.firebaseio.com',
    projectId: 'nicanor',
    storageBucket: 'nicanor.appspot.com',
    messagingSenderId: '231772546460'
  },
  ceoapi_url: 'https://us-central1-nicanor.cloudfunctions.net/apiceocrm'*/

};

/*y tu
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
