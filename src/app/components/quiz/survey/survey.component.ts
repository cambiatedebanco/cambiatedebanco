import { Component, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import { FormControl, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import * as rutValidator from 'rut-validator-ca';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  constructor(private fireStoreService: FirestoreService) { }

  ngOnInit() {
    this.initData();
    this.initSurvey();
  }
  tabs = [];
  selected = new FormControl(0);
  selectedIndex: number;
  surveyModel: any;
  json;
  isTabVisible = true;
  navClass = 'mat-tab-label';
  page;
  mode;
  objetivo_cliente = ["¿Necesitas un nuevo Crédito Social?", "¿Necesitas alivianar tu carga financiera que hoy tienes con Caja los Andes?"]
  booleanResponse = [{ "value": 1, "text": "Si" }, { "value": 0, "text": "No" }]
  Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}
  initSurvey() {
    Survey
      .StylesManager
      .applyTheme("modern");
    Survey.FunctionFactory.Instance.register('isRutValid', this.validarRut, false);
    var survey = new Survey.Model(this.json);
    survey.locale = "es";

    // survey.mode = 'display';
    // survey.isSinglePage = true;

    this.surveyModel = survey;
    var pageCount = this.surveyModel.pages.length;
    for (var i = 0; i < pageCount; i++) {
      if (i == 0) {
        this.tabs.push(
          {
            "index": i,
            "name": this.surveyModel.pages[i].name,
            "selected": true,
            "pageErrorCount": 0,
            "isErrorVisible": false
          });

      } else {
        this.tabs.push(
          {
            "index": i,
            "name": this.surveyModel.pages[i].name,
            "selected": false,
            "pageErrorCount": 0,
            "isErrorVisible": false
          });
      }
    }

    survey.render("surveyElement");

    survey.onCurrentPageChanged.add(result => {
      this.selectedIndex = this.surveyModel.currentPageNo;

      if (survey.getPropertyValue("navjson") != null) {
        this.tabs = survey.getPropertyValue("navjson");
      }
      for (var i = 0; i < this.tabs.length; i++) {
        if (this.selectedIndex == i) {
          this.tabs[i].selected = true;
        } else {
          this.tabs[i].selected = false;
        }
      }
    });

    survey.onComplete
      .add(result => {
        var data = result.data;
        var date = new Date();
        let fecha = date.getFullYear().toString() +  this.Right('00' + (date.getMonth()+1).toString(),2) + this.Right('00' + date.getDate().toString(),2)

        data.platform = 'quiz';
        data.created_time = date;
        data.timestamp = parseInt(date.getTime().toString().substring(0, 10), 0);
        data.gestionado = 0;
        data.tipo_campana = this.getTipoCampana(data);
        data.ruta = this.getRUTA(data);
        data.id_estado = 0;
        data.fecha = fecha;
        data.nuevo = 1;

        // llamado a firebase
        this.fireStoreService.addLead(data);

        this.isTabVisible = false;
      });

    survey.onCompleting.add(function (sender, options) {
      // var localJson = this.json;
      // console.log("Locale JSON", localJson);
      //if (!!survey.isConfirming) return;

      // let errorPageIndex: number;
      // for (var i = 0; i < survey.getAllQuestions().length; i++) {
      //   let question: any = survey.getAllQuestions()[i];
      //   if (question.hasErrors()) {
      //     console.log("question name -------->", question.page.name);
      //     for (var i = 0; i < survey.pages.length; i++) {
      //       if (question.page.name === survey.pages[i].name) {
      //         console.log("Name matched ----------->");
      //         errorPageIndex = i;
      //         console.log("First Break ----------->");
      //         break;
      //       }
      //     }
      //   }
      //   if (errorPageIndex != null) {
      //     console.log("Second Break ----------->");
      //     break;
      //   }
      // }

      let errorPageIndex;
      let pageErrorCount;
      let isErrorPageCountVisible;
      let pageName;
      let localTabs = [];
      for (var i = 0; i < survey.pages.length; i++) {
        pageErrorCount = 0;
        pageName = survey.pages[i].name;
        let questions: any = survey.getAllQuestions();
        for (var j = 0; j < questions.length; j++) {
          if (questions[j].hasErrors() && questions[j].page.name === pageName) {
            pageErrorCount = pageErrorCount + 1;
            if (errorPageIndex == null) {
              errorPageIndex = i;
            }
          }
        }

        if (pageErrorCount != null && pageErrorCount > 0) {
          isErrorPageCountVisible = true;
        } else {
          isErrorPageCountVisible = false;
        }
        localTabs.push(
          {
            "index": i,
            "name": pageName,
            "selected": false,
            "pageErrorCount": pageErrorCount,
            "isErrorVisible": isErrorPageCountVisible
          });
      }

      if (errorPageIndex != null) {
        for (var i = 0; i < localTabs.length; i++) {
          if (errorPageIndex == i) {
            localTabs[i].selected = true;
          } else {
            localTabs[i].selected = false;
          }
        }

        this.tabs = localTabs;
        survey.setPropertyValue("navjson", localTabs);

        survey.isConfirming = false;
        options.allowComplete = false;
        survey.currentPageNo = errorPageIndex;
        survey.onCurrentPageChanged.fire(survey, options);
      }
    });
  }





  initData() {
    var json = {
      "completeText": "Terminar",
      "pageNextText": "Continuar",
      "pagePrevText": "Atras",
      "completedHtml": "<h3>Thank you for your feedback.</h3> <h5>Your thoughts and ideas will help us to create a great product!</h5>",
      "completedHtmlOnCondition": [
        {
          expression: "{question2} = '1'",
          "html": `<a href="https://bit.ly/39ga5Aq"  target="_blank"
          onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'refinanciamiento-click');"><img src='../../../../assets/images/survey/refinanciamiento.png' width="90%"></a>
              `
        }, {
          expression: "{question2} = '0'",
          "html": `<a href="https://www.cajalosandes.cl/apoyo-financiero/creditos/credito-social"  target="_blank" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'solicitud_de_credito-click');"><img src='../../../../assets/images/survey/solicitud-de-credito.png' width="90%"></a>`

        },
        /* repactacion  y reprogramacion*/
        {
          expression: "{question4} = '1'",
          "html": `<a href="https://www.cajalosandes.cl/juntos/reprogramacion" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'repactacion-click');"  target="_blank"><img src='../../../../assets/images/survey/repactacion.png' width="90%"></a>`

        },
        {
          expression: "{question4} = '0' ",
          "html": `<a href="https://www.cajalosandes.cl/juntos/reprogramacion" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'reprogramacion-click');"  target="_blank"><img src='../../../../assets/images/survey/reprogramacion.png' width="90%"></a>`

        },
         /* repactacion  y reprogramacion*/
        {
          expression: "{question6} = '1'",
          "html": `<a href="https://www.cajalosandes.cl/juntos/reprogramacion"  onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'repactacion-click');"  target="_blank"><img src='../../../../assets/images/survey/repactacion.png' width="90%"></a>`
        },
        {
          expression: "{question6} = '0'",
          "html": `<a href="https://www.cajalosandes.cl/juntos/reprogramacion" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'reprogramacion-click');"  target="_blank"><img src='../../../../assets/images/survey/reprogramacion.png' width="90%"></a>`
        },
            /* doble */
        {
          expression: "{question7} = '0'",
          "html": `<img src='../../../../assets/images/survey/reprogramacion_o_repactacion.jpg' width="100%"><br><a href="https://www.cajalosandes.cl/juntos/postergacion-de-cuota" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'postergacion-click');" target="_blank"><img src='../../../../assets/images/survey/button_postergar.png' width="45%"></a>
          <a href="https://www.cajalosandes.cl/juntos/reprogramacion" target="_blank" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'reprogramacion-click');" ><img src='../../../../assets/images/survey/button_repro.png' width="45%"></a>
            `
        },
        /* postergar cuota */
        {
          expression: "{question8} = 1",
          "html": `<a href="https://www.cajalosandes.cl/juntos/postergacion-de-cuota" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'postergacion-click');" target="_blank"><img src='../../../../assets/images/survey/postergar_cuota.png' width="100%"></a>`,
        },
        {
          expression: "{question8} = 0",
          "html": `<a href="https://www.cajalosandes.cl/juntos/postergacion-de-cuota" onclick="ga('send', 'event', 'Alivio-financiero', 'Quiz', 'postergacion-click');" target="_blank"><img src='../../../../assets/images/survey/postergar_cuota.png' width="100%"></a>`,
        }
      ],
      pages: [
        {

          name: "page0",
          elements: [
            {
              "type": "panel",
              "elements": [
                {
                  "type": "html",
                  "name": "income_intro",
                  "html": `
                  <h3>Hoy más que nunca es importante estar cerca</h3>
                  <p>Sabemos que te esfuerzas día a día para cuidar a tu familia, por eso, a través de EFI, nuestro Programa de Empoderamiento Financiero, te invitamos a contestar estas breves preguntas para encontrar juntos una solución a tu medida para aliviar tu vida financiera.

                               </p>
                               <hr>
                               `},
                {
                  "name": "rut",
                  "title": "Ingrese su RUT (Ej. 1111111-1)",
                  "type": "text",
                  "placeholder": "Ingrese su rut",
                  "validators": [{
                    "type": "expression",
                    "expression": "isRutValid({rut}) = true",
                    "text": "Campo requerido o formato de rut invalido. E.j 00000000-0"
                  }]
                },
                {
                  "name": "nombre",
                  "title": "Ingrese su nombre completo",
                  "type": "text",
                  "isRequired": true,
                  "placeholder": "Ingrese su nombre completo"
                }, {
                  "title": "Ingrese su Email",
                  "type": "text",
                  "name": "email",
                  "isRequired": true,
                  "placeholder": "Ingrese su Email",
                  "validators": [
                    {
                      "type": "email"
                    }
                  ]
                }
              ]
            }
          ]
        },
       {
        name: "page1",
        elements: [
         {
          type: "radiogroup",
          name: "question1",
          title: "Cuéntanos tu necesidad:",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "¿Necesitas un nuevo Crédito Social?"
           },
           {
            value: "0",
            text: "¿Necesitas alivianar tu carga financiera que hoy tienes con Caja los Andes?"
           }
          ]
         }
        ]
       },
       {
        name: "page2",
        elements: [
         {
          type: "radiogroup",
          name: "question2",
          visibleIf: "{question1} = '1'",
          title: "¿Tienes un crédito vigente en Caja los Andes?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page3",
        elements: [
         {
          type: "radiogroup",
          name: "question3",
          visibleIf: "{question1} = '0'",
          title: "¿Trabajas actualmente en una empresa afiliada a Caja los Andes?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page4",
        elements: [
         {
          type: "radiogroup",
          name: "question4",
          visibleIf: "{question3} = '0'",
          title: "¿Tú finiquito es posterior al 01 de Febrero del 2020?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page5",
        elements: [
         {
          type: "radiogroup",
          name: "question5",
          visibleIf: "{question3} = '1'",
          title: "¿Tienes tu crédito en Caja los Andes con 3 meses de mora?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page6",
        elements: [
         {
          type: "radiogroup",
          name: "question6",
          visibleIf: "{question5} = '0'",
          title: "¿Tu renta fija o variable se visto disminuida?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page7",
        elements: [
         {
          type: "radiogroup",
          name: "question7",
          visibleIf: "{question5} = '1'",
          title: "¿Tu renta fija o variable se visto disminuida?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       },
       {
        name: "page8",
        elements: [
         {
          type: "radiogroup",
          name: "question8",
          visibleIf: "{question7} = '1'",
          title: "¿Perteneces a los tramos A-B-C de Caja los Andes?",
          isRequired: true,
          choices: [
           {
            value: "1",
            text: "Si"
           },
           {
            value: "0",
            text: "No"
           }
          ]
         }
        ]
       }
      ]
     };
    this.json = json;
  }

  getTipoCampana(data) {
    let refinanciamiento = 40;
    let solicitud_de_credito = 41;
    let repactacion = 42;
    let reprogramacion = 43;
    let diferimiento = 44;
    let postergacion = 45;
    let post_repro = 47;

    // obtener ultimo resultado ...

    if (typeof data.question2 != 'undefined') {
      // refinanciamiento ||  solicitud de credito
      return data.question2 === "1" ? refinanciamiento : solicitud_de_credito;
    }
    //typeof data.{es_desempleado} ='1' or {is_variable_no_pending} = '1'
    if (typeof data.question4 != 'undefined') {
      return data.question4 === "1" ? repactacion : reprogramacion;
    }
    if (typeof data.question6 != 'undefined') {
      return data.question6 === "1" ? repactacion : reprogramacion;
    }
    //"{es_desempleado} ='0' or {is_variable_no_pending} = '0' or {is_variable_pending} = '0'"
    if (typeof data.question8 != 'undefined') {

      return data.question8 === "1" ? 45 : 45;
    }


    if (typeof data.question7 != 'undefined') {
      if (data.question7 === "0") {
        return post_repro;
      }

    }

  }

  getRUTA(data) {
    let ruta = '';

    if (typeof data.question2 != 'undefined') {
      // refinanciamiento ||  solicitud de credito
       ruta = ruta + (data.question2 === "1" ? '|CON CREDITO VIGENTE' : '|SIN CREDITO VIGENTE');
    }
    //typeof data.{es_desempleado} ='1' or {is_variable_no_pending} = '1'
    if (typeof data.question3 != 'undefined') {
      //Repactación con gracia
      ruta = ruta + (data.question3 === "1" ? '|ES AFILIADO' : '|NO ES AFILIADO');

    }


    if (typeof data.question4 != 'undefined') {
      //Repactación con gracia
      ruta = ruta + (data.question4 === "1" ? '|ES DESEMPLEADO RECIENTE' : '|NO ESTA DESEMPLEADO');

    }

    if (typeof data.question5 != 'undefined') {
      ruta = ruta + (data.question5 === "1" ? '|CON TRES MESES DE MORA' : '|SIN MORA');


    }


    if (typeof data.question6 != 'undefined') {
      //Repactación con gracia
      ruta = ruta + (data.question6 === "1" ? '|INGRESOS DISMINUIDOS' : '|SIN INGRESOS DISMINUIDOS');

    }

    if (typeof data.question7 != 'undefined') {
      //Repactación con gracia
      ruta = ruta + (data.question7 === "1" ? '|INGRESOS DISMINUIDOS' : '|SIN INGRESOS DISMINUIDOS');

    }


    //"{es_desempleado} ='0' or {is_variable_no_pending} = '0' or {is_variable_pending} = '0'"


    if (typeof data.question8 != 'undefined') {
      ruta = ruta + (data.question8 === "1" ? '|INGRESO MENOR A $800.000' : '|INGRESO MAYOR $800.000');

    }

    return ruta;
  }
  validarRut = (params): boolean => {
    if (params.length < 1)
    { return false; }
    let rut = params[0].toString();
    return rutValidator(rut)
  }
  dinamicRequired = (params): boolean => {
    var field = params[0];
    var answer = params[1];

    return true
  }
}

