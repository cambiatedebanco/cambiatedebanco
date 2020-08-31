import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import * as Survey from 'survey-angular';
import { FormControl } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-encuesta-empresas',
  templateUrl: './encuesta-empresas.component.html',
  styleUrls: ['./encuesta-empresas.component.css']
})
export class EncuestaEmpresasComponent implements OnInit {
  idEncuesta: any;
  rut: any;
  idFecha: any;
  email: any;
  test: any;
  tabs = [];
  selected = new FormControl(0);
  selectedIndex: number;
  surveyModel: any;
  json;
  isTabVisible = true;
  navClass = 'mat-tab-label';
  validaEncuesta: string;
  isCompletedSurvey = false;

  constructor(
    private fireStoreService: FirestoreService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.signInAnonymously();
    this.validaEncuesta = '';
    this.idEncuesta = this.route.snapshot.paramMap.get('idEncuesta');
    this.rut = this.route.snapshot.paramMap.get('rutEmpresa');
    this.idFecha = this.route.snapshot.paramMap.get('idFecha');
    this.email = this.route.snapshot.paramMap.get('email');

    this.getSurveyByRutTipoEmail(this.rut, this.idEncuesta, this.email);

  }

  getSurveyByRutTipoEmail(rutEmpresa: any, idEncuesta: any, email: any) {
    this.fireStoreService.getSurveyByRutTipoEmail(rutEmpresa, idEncuesta, email).subscribe((encuestaSnap: any) => {

      if (encuestaSnap.length > 0 && !this.isCompletedSurvey) {
          this.validaEncuesta = `<div class="row">
          <div class="col-xs-4">
              <div class="circle circle-md bg-info m-t-10 pull-right"><i class="ti-check-box"></i></div>
          </div>
          <div class="col-xs-8">
              <ul class="expense-box">
                  <li> <span><h2>LA ENCUESTA YA FUE COMPLETADA</h2><h4>MUCHAS GRACIAS!</h4></span></li>
              </ul>
          </div>
      </div>`;
        }

      if (encuestaSnap.length === 0) {
          this.isCompletedSurvey = true;
          this.initData();
          this.initSurvey();
          this.validaEncuesta = '';
        }
    });
  }

  initSurvey() {
    console.log('initSurvey');
    Survey
      .StylesManager
      .applyTheme('modern');
    var survey = new Survey.Model(this.json);
    survey.locale = 'es';

    // survey.mode = 'display';
    // survey.isSinglePage = true;

    this.surveyModel = survey;
    var pageCount = this.surveyModel.pages.length;
    for (var i = 0; i < pageCount; i++) {
      if (i === 0) {
        this.tabs.push(
          {
            index: i,
            name: this.surveyModel.pages[i].name,
            selected: true,
            pageErrorCount: 0,
            isErrorVisible: false
          });

      } else {
        this.tabs.push(
          {
            index: i,
            name: this.surveyModel.pages[i].name,
            selected: false,
            pageErrorCount: 0,
            isErrorVisible: false
          });
      }
    }


    survey.render('surveyElement');

    survey.onCurrentPageChanged.add(result => {
      this.selectedIndex = this.surveyModel.currentPageNo;

      if (survey.getPropertyValue('navjson') != null) {
        this.tabs = survey.getPropertyValue('navjson');
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
        data.platform = 'encuesta';
        data.created_time = date;
        data.timestamp = parseInt(date.getTime().toString().substring(0, 10), 0);
        data.tipo_encuesta = parseInt(this.idEncuesta);
        data.rut = parseInt(this.rut);
        data.fecha = parseInt(this.idFecha);
        data.email = this.email;
        // llamado a firebase
        this.fireStoreService.addSurvey(data);

        this.isTabVisible = false;
      });

    survey.onCompleting.add(function (sender, options) {
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
            index: i,
            name: pageName,
            selected: false,
            pageErrorCount: pageErrorCount,
            isErrorVisible: isErrorPageCountVisible
          });
      }

      if (errorPageIndex != null) {
        for (var i = 0; i < localTabs.length; i++) {
          if (errorPageIndex === i) {
            localTabs[i].selected = true;
          } else {
            localTabs[i].selected = false;
          }
        }

        this.tabs = localTabs;
        survey.setPropertyValue('navjson', localTabs);

        survey.isConfirming = false;
        options.allowComplete = false;
        survey.currentPageNo = errorPageIndex;
        survey.onCurrentPageChanged.fire(survey, options);
      }
    });
  }


  initData() {
    const json = {
      completeText: 'Terminar',
      pageNextText: 'Continuar',
      pagePrevText: 'Atrás',
      completedHtml: `<img src='../../../../assets/images/encuestas/2020-04-22.png' width="100%">`,
      pages: [
       {
        name: 'page1',
        elements: [
          {
            type: 'html',
            name: 'income_intro',
            html: `
            <div class="panel-heading">
                        <h2 style="color: #ffffff;"><b>¡Queremos saber tu opinión!</b>
                            <br> <small style="color: #ffffff;">Preocupados de entregarte un mejor servicio, te invitamos a responder las siguientes preguntas.</small> </h2>
                    </div>
                    <br>
            <h5 class="sv-title sv-question__title sv-question__title--required">¿Qué tan de acuerdo está usted con las siguientes afirmaciones relacionadas con el llamado que recibió por parte de Caja los Andes?. Por favor utilizar una escala de 1 a 7, donde 1 es "Muy en desacuerdo" y 7 "Muy de acuerdo".</h5>
          `},
         {
          type: 'rating',
          name: 'question1',
          title: 'Caja los Andes demuestra interés y preocupación por la empresa',
          isRequired: true,
          rateMax: 7
         },
         {
          type: 'rating',
          name: 'question2',
          title: 'Caja Los Andes ha sido cercana con la empresa',
          isRequired: true,
          rateMax: 7
         },
         {
          type: 'rating',
          hideNumber: true,
          name: 'question3',
          title: 'La interacción con Caja los Andes fue agradable',
          isRequired: true,
          rateMax: 7
         },
         {
          type: 'radiogroup',
          name: 'question4',
          title: '¿Tuvo la oportunidad de resolver dudas?',
          isRequired: true,
          choices: [
           {
            value: '1',
            text: 'Si'
           },
           {
            value: '0',
            text: 'No'
           },
           {
            value: '2',
            text: 'No tuve dudas'
           }
          ]
         },
         {
          type: 'rating',
          name: 'question5',
          title: 'En una escala de 1 a 7, donde 1 es pésimo, y 7 excelente, ¿Cómo califica el contacto telefónico con CAJA LOS ANDES?',
          isRequired: true,
          rateMax: 7
         },
         {
          type: 'comment',
          name: 'question6',
          title: 'En relación a la situación actual del país  ¿Le parece importante o necesario que Caja los Andes este presente?, ¿Por qué?',
          isRequired: true
         }
        ],
        title: '',
        description: ''
       }
      ]
     };
    this.json = json;
  }

  OnDestroy() {
    this.logOutAnonymous();
  }

  logOutAnonymous() {
    this.authService.logout();
  }
}



