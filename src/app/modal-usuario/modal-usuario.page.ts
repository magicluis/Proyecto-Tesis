import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { progreso } from '../shared/progreso';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.page.html',
  styleUrls: ['./modal-usuario.page.scss'],
})
export class ModalUsuarioPage implements OnInit {


  listaProgreso:progreso[];

  constructor(public modalController:ModalController,private authSvc: AuthService, private router:Router) {
    this.cargarProgreso();
   }


  ngOnInit() {

  }

  cargarProgreso(){
    const id = localStorage.getItem('idMP');
    this.authSvc.getUsuarioProgreso<progreso>(id).subscribe(data =>{
      //console.log(data);
      this.listaProgreso = data;
    });    
  }


  //----------- Cerrar modal ------------
  closeModal(){
    this.modalController.dismiss();
  }

}
