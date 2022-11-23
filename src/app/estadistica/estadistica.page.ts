import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { progreso } from '../shared/progreso';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
})
export class EstadisticaPage implements OnInit {

  idProgreso:string;
  auxProgreso:progreso[]=[];


  constructor(private authSvc: AuthService, private router:Router) {
    this.cargarProgreso();
   }

  ngOnInit() {
  }

  cargarData(){

  }


  //---------------- VERIFICAR PROGRESO ------------------

  cargarProgreso(){
    console.log("progreso ---------- ");
    const id = localStorage.getItem('idUsuario');
    this.authSvc.getProgreso<progreso>(id).subscribe(res =>{
      this.auxProgreso = res;
      console.log(res);
    })

}






}
