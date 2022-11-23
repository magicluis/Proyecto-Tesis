import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import auxiliares from '../shared/auxiliares';
import { preguntas } from '../shared/preguntas';
import { progreso } from '../shared/progreso';
import { usuario } from '../shared/usuario';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  identificador:string = auxiliares.id;
  informacion:usuario;

  data:progreso[] = [];

  dataPreguntas:preguntas[] = [];


  constructor(private authSvc: AuthService, private router:Router,private menuControl:MenuController) {  
    this.startedData();
    this.cargarData();
    this.asignarData();
    this.cargarPreguntas();

   }


  ngOnInit() { }

  //-------------- CERRAR SESION ------------------
  async onLogOut(){
    try{
      await this.authSvc.logout();
      //--------- se borra el local stora y las variables de entorno.
      localStorage.clear();
      this.router.navigate(['login']);
    }catch(error){
      console.log("Error->", error)
    }
  }


  //---------------- INFO DEL USUARIO --------------------------
  cargarData(){
    var id = localStorage.getItem('idUsuario');
    this.authSvc.getDocument<usuario>(id).subscribe(res=>{
      
     
      if(res[0] == undefined){
        this.authSvc.crearInfo();
        this.informacion = res[0];
      }else{
        this.informacion = res[0];
      }

    });
  }

  startedData(){
    this.informacion={ 
      id:'',
      nombre:'Default',
      apellido:'Default',
      carnet:'',
      seccion:'',
      correo:'',
      imagen:'',
      tipo:0
    };  
  }

  //---------------------- IDENTIFICADOR DE NIVEL -------------

  seleccionNivel(valor:any){
    localStorage.removeItem('nivel');
    localStorage.setItem('nivel',valor);
  }

  //----------------------- COLLECCION DE PROGRESO -------------
  asignarData(){
    var id = localStorage.getItem('idUsuario');
    this.authSvc.getProgreso<progreso>(id).subscribe(res=>{
      //this.data = res;

      if(res.length == 0){
        //console.log("No tengo progreso");
        this.authSvc.creacionProgreso();
        this.data = res;

      }else{
        this.data = res;
      }

    })
  }


  cargarPreguntas(){
    this.authSvc.getAllPreguntas<preguntas>().subscribe( res =>{
      console.log(res);
      this.dataPreguntas = res;
    })
  }

  //------------------------ ABRIR OPCIONES MENU -------

  toggleMenu(){
    this.menuControl.toggle();
  }













}
