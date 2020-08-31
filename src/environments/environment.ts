export const environment = {
  production: false,
  //DEV
  firebase : {
    apiKey: "AIzaSyApUpSwKIkgJ9yhCmgNYhvez4y2Sg1Qq4A",
    authDomain: "graphite-maker-287716.firebaseapp.com",
    databaseURL: "https://graphite-maker-287716.firebaseio.com",
    projectId: "graphite-maker-287716",
    storageBucket: "graphite-maker-287716.appspot.com",
    messagingSenderId: "1002850217781",
    appId: "1:1002850217781:web:9973358c51a4c2db91267c",
    measurementId: "G-1WHM9K4W5Y"
  },
  gcp:{
    clientId:'1002850217781-4fqsv4j9lvlcthc47striovod92isnd9.apps.googleusercontent.com',
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
