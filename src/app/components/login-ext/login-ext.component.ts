import { Component, OnInit } from '@angular/core';
import { DialogLoginExterno } from 'src/app/dialogs/dialog-login-externo';
import { MatDialog } from '@angular/material';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-ext',
  templateUrl: './login-ext.component.html',
  styleUrls: ['./login-ext.component.css']
})
export class LoginExtComponent implements OnInit {
  imageNumber: number;
  constructor(public dialog: MatDialog, 
    private router: Router) { }

  ngOnInit() {
    this.setImageNumber()
  }
  setImageNumber(){
    this.imageNumber = Math.floor(Math.random() * 3) + 1
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogLoginExterno, {width:'650px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // rearmar home-ext con navbar 
        this.router.navigate([`/home-tam`])
        // route main
      }
    })
  }
}
