import { Component, OnInit, Input, Output , EventEmitter, SimpleChanges  } from '@angular/core';

import { Chart, HIGHCHARTS_MODULES  } from 'angular-highcharts';
import { Options } from 'highcharts';
import * as _ from 'lodash';
import { PostgresService } from '../../services/postgres/postgres.service';
import { getHeaders } from '../utility';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-valores-total-covid',
  templateUrl: './valores-total-covid.component.html',
  styleUrls: ['./valores-total-covid.component.css']
})
export class ValoresTotalCovidComponent implements OnInit {
  chart: Chart;
  options: Options;
  @Input('colaboradores') colaboradores;
  @Input('total_colaboradores') total_colaboradores;
  @Input() tipo: any;
  @Input() region: any;
  @Output() coordenadasDesdeComuna = new EventEmitter<any>();

  afiliadosComuna: any = [];
  total_afiliados = 0;
  vulnerabilidadComuna: any = [];
  selectorMapa: any;
  esComuna = false;
  headers : any;
  user : any;

  constructor(private postgresService: PostgresService, private authService: AuthService) {

  }

  ngOnInit() {
    this.init();

  }

  sendComuna(element: any) {
    this.chart.removeSeries(0);
    this.selectorMapa = element;
    this.esComuna = true;
    if (this.tipo === 2) {
      this.postgresService.getVulnerabilidadComuna(element, this.headers).subscribe((comunas: any) => {
        this.vulnerabilidadComuna = [];
        let i = 0;
        comunas.forEach((comuna: any) => {
          let colores = '';
          let sliced;
          let selected;
          let data;
          if (i === 0) {
            colores = '#1e88e5';
            sliced = true;
            selected = true;
            data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores, sliced, selected};
          } else {
            colores = '#dbdbdb';
            data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores};
        }
          this.vulnerabilidadComuna.push(data);
          i++;
      });
        this.chart.addSeries({type: 'pie', name: 'Vulnerabilidad', data:  this.vulnerabilidadComuna}, true, true);
        this.postgresService.getComunaPos(element, this.headers).subscribe((pos: any) => {
          this.coordenadasDesdeComuna.emit(pos[0]);
        });
      });
  } else {
    this.postgresService.getVulnerabilidadComunaCol(element, this.headers).subscribe((comunas: any) => {
      this.vulnerabilidadComuna = [];
      let i = 0;
      comunas.forEach((comuna: any) => {
        let colores = '';
        let sliced;
        let selected;
        let data;
        if (i === 0) {
          colores = '#1e88e5';
          sliced = true;
          selected = true;
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores, sliced, selected};
        } else {
          colores = '#dbdbdb';
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores};
        }
        this.vulnerabilidadComuna.push(data);
        i++;
      });
      this.chart.addSeries({type: 'pie', name: 'Vulnerabilidad', data:  this.vulnerabilidadComuna}, true, true);
      this.postgresService.getComunaPos(element, this.headers).subscribe((pos: any) => {
        this.coordenadasDesdeComuna.emit(pos[0]);
      });
    });
}


  }
  addPoint() {
    if (this.chart) {
      this.chart.addPoint(Math.floor(Math.random() * 10));
    } else {
      alert('init chart, first!');
    }
  }




  init() {
this.selectorMapa = 'PAIS';
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    credits: {
      enabled: false,
     },
    title: {
        text: ''
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
    },
    series: []

    };
    const chart = new Chart(this.options);

    this.chart = chart;
    this.authService.isUserLoggedInAuth().pipe(
      tap(user => {
        if (user) {
          this.user = user;
        }
        else {
          // force logout
        }
      })
    ).subscribe(_ => {
      let headers = this.headers = getHeaders(this.user);
      this.getVulnerabilidadComunaCol(headers);
    }
    )
  }

  private getVulnerabilidadComunaCol(headers: any, comuna:string = '0') {
    this.postgresService.getVulnerabilidadComunaCol(comuna, headers).subscribe((comunas: any) => {
      this.vulnerabilidadComuna = [];
      let i = 0;
      comunas.forEach((comuna: any) => {
        let colores = '';
        let sliced;
        let selected;
        let data;
        if (i == 0) {
          colores = '#1e88e5';
          sliced = true;
          selected = true;
          data = { name: String(comuna.name), y: parseInt(comuna.data), color: colores, sliced, selected };
        }
        else {
          colores = '#dbdbdb';
          data = { name: String(comuna.name), y: parseInt(comuna.data), color: colores };
        }
        this.vulnerabilidadComuna.push(data);
        i++;
      });
      this.chart.addSeries({
        type: 'pie',
        name: 'Vulnerabilidad',
        data: this.vulnerabilidadComuna
      }, true, true);
    });
  }

  initRegionByAfiliados(element) {
    this.chart.removeSeries(0);
    this.esComuna = false;
    this.postgresService.getVulnerabilidadRegion(element, this.headers).subscribe((comunas: any) => {
      this.vulnerabilidadComuna = [];
      let i = 0;
      comunas.forEach((comuna: any) => {
        let colores = '';
        let sliced;
        let selected;
        let data;
        if (i == 0) {
          colores = '#1e88e5';
          sliced = true;
          selected = true;
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores, sliced, selected};
        } else {
          colores = '#dbdbdb';
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores};

        }

        this.vulnerabilidadComuna.push(data);
        i++;
        });

      this.chart.addSeries({
       type: 'pie',
        name: 'Vulnerabilidad',
        data:  this.vulnerabilidadComuna
     }, true, true);

    });
  }

  initRegionByColaboradores(element) {
    this.chart.removeSeries(0);
    this.esComuna = false;
    this.postgresService.getVulnerabilidadRegionColaborador(element, this.headers).subscribe((comunas: any) => {
      this.vulnerabilidadComuna = [];
      let i = 0;
      comunas.forEach((comuna: any) => {
        let colores = '';
        let sliced;
        let selected;
        let data;
        if (i == 0) {
          colores = '#1e88e5';
          sliced = true;
          selected = true;
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores, sliced, selected};
        } else {
          colores = '#dbdbdb';
          data = {name: String(comuna.name), y: parseInt(comuna.data), color: colores};

        }

        this.vulnerabilidadComuna.push(data);
        i++;
        });

      this.chart.addSeries({
       type: 'pie',
        name: 'Vulnerabilidad',
        data:  this.vulnerabilidadComuna
     }, true, true);

    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.region && changes.region) {
      if (changes.region.currentValue !== changes.region.previousValue ) {
          this.selectorMapa = changes.region.currentValue;
          if(parseInt(this.tipo) === 2){
            this.initRegionByAfiliados(changes.region.currentValue);
          }else{
            this.initRegionByColaboradores(changes.region.currentValue);
          }
      }
    }

    if (this.tipo && changes.tipo) {
      if (changes.tipo.currentValue !== changes.tipo.previousValue ) {
          this.tipo = changes.tipo.currentValue;
          if(parseInt(this.tipo) === 2 && this.selectorMapa !== 'PAIS') {
            if (this.esComuna ) {
              this.sendComuna(this.selectorMapa);
            } else {
              this.initRegionByAfiliados(this.selectorMapa);
            }
          }

          if(parseInt(this.tipo) === 2 && this.selectorMapa === 'PAIS') {
            this.initRegionByAfiliados('0');
          }

          if(parseInt(this.tipo) === 1 && this.selectorMapa !== 'PAIS' && this.chart) {
            if (this.esComuna) {
              this.sendComuna(this.selectorMapa);
            } else {
              this.initRegionByColaboradores(this.selectorMapa);
            }
          }

          if(parseInt(this.tipo) === 1 && this.selectorMapa === 'PAIS') {
            this.init();
          }

       }
    }
  }

}
