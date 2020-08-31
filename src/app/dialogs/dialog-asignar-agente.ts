import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogAsignarData } from '../interface/asignarAgenteDialogInterface'
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'dialog-asignar-agente',
    templateUrl: 'dialog-asignar-agente.html',
  })
  export class DialogAsignarAgente {
    constructor(
      public dialogRef: MatDialogRef<DialogAsignarAgente>,
      @Inject(MAT_DIALOG_DATA) public data: DialogAsignarData) { 
      }
    selected: String = "";
    onNoClick(): void {
      this.dialogRef.close()
    }
    confirmSelect() {
      // selected data ...
      if(this.selected === ""){
        this.dialogRef.close()
      }
      this.dialogRef.close(this.selected)
    }
  }