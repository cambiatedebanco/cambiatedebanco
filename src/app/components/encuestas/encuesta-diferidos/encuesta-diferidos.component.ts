import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import * as Survey from 'survey-angular';
import { FormControl } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-encuesta-diferidos',
  templateUrl: './encuesta-diferidos.component.html',
  styleUrls: ['./encuesta-diferidos.component.css']
})
export class EncuestaDiferidosComponent implements OnInit {
  idEncuesta: any;
  rut: any;
  idFecha: any;
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
    this.rut = this.route.snapshot.paramMap.get('rutPersona');
    this.idFecha = this.route.snapshot.paramMap.get('idFecha');

    this.getSurveyByRutTipo(this.rut, this.idEncuesta);

  }

  getSurveyByRutTipo(rut: any, idEncuesta: any) {
    this.fireStoreService.getSurveyByRutTipo(rut, idEncuesta).subscribe((encuestaSnap: any) => {

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
      completeText: "Terminar",
      pageNextText: "Continuar",
      pagePrevText: "Atras",
      completedHtml: `<img src='../../../../assets/images/encuestas/2020-04-22.png' width="100%">`,
      pages: [
       {
        name: 'page1',
        elements: [
         {
          type: 'rating',
          name: 'question1',
          title: '¿En una escala de 1 a 7, donde 1 es pésimo y 7 es excelente, ¿ cómo evalúa la atención recibida?',
          isRequired: true,
          rateMax: 7
         },
         {
          type: 'radiogroup',
          name: 'question2',
          title: '¿Tu consulta o requerimiento fue resuelto?',
          isRequired: true,
          choices: [
           {
            value: '1',
            text: 'Si'
           },
           {
            value: '0',
            text: 'No'
           }
          ]
         }
        ],
        title: '¡Queremos saber tu opinión!',
        // tslint:disable-next-line: max-line-length
        description: 'Preocupados de entregarte una mejor experiencia, te invitamos a responder 2 preguntas para evaluar la atención y mejorar nuestro servicio.'
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


