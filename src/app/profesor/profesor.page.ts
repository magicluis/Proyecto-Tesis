import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user.interface';
import { usuario } from '../shared/usuario';

import { ModalUsuarioPage } from '../modal-usuario/modal-usuario.page';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {

  mostrar:boolean;
  informacion:any[];
  automaticClose= false;
  contador:number;

  @ViewChild('search',{ static: false }) search: IonSearchbar;


  //------ lista con info usuario 
  informacionUsuario:any[];
  auxiliar:any[];

//-------- lista para seccion 

listaSeccion:any[]=[];
listaSeccionAux:any[];


  constructor(private authSvc: AuthService, private router:Router, public modalControler:ModalController) { 

    this.cargarData();
    this.auxiliar = this.informacionUsuario;
    

  }

  ngOnInit() {}

  ionViewDidEnter(){
    setTimeout(()=>{
      this.search.setFocus();
    });
  }


cargarData(){
    this.contador = 0;
    this.informacionUsuario=[];
    this.authSvc.getUsuarios<User>().subscribe( res =>{

      for(let item of res){
        this.authSvc.getUsuarioId<usuario>(item.uid).subscribe(dat =>{
          if(dat[0] != undefined && this.contador <= res.length-1){
            this.informacionUsuario.push(dat[0]);
            this.listaSeccion.push(dat[0].seccion);
          }

          this.informacionUsuario[0].open = false;
          this.contador++;  
          this.listaSeccionAux = [...new Set(this.listaSeccion)];
          
        });
      }

      
    
    });
  }


  //_-------------- modal

  async presentModal(id:string){

    //------ variable para pasar id del usuario para progreso.
    localStorage.setItem('idMP',id);

    const modal = await this.modalControler.create(
      {
        component: ModalUsuarioPage,
        cssClass: 'my-custom-class',
      });
      return await modal.present();
  }

  

//------------- opciones desplegable -------------

  toogleSeccion(index){
    this.auxiliar[index].open = !this.auxiliar[index].open;
    
    if(this.automaticClose && this.auxiliar[index].open ){
      this.auxiliar
      .filter((item,itemIndex)=> itemIndex != index)
      .map(item => item.open = false)
    }
  }

  toogleItem(index,childIndex){
    this.auxiliar[index].children[childIndex].open = !this.auxiliar[index].open;
  }


  //------------ search --------------
 

 ionChange(event){
  const val = event.target.value;
  this.auxiliar = this.informacionUsuario;

  if(val && val.trim() != ''){
    this.auxiliar = this.auxiliar.filter((item:any)=>{
      return (item.nombre.toLowerCase().indexOf(val.toLowerCase())>-1);
    })
  }

 }


 seleccion(event){
   const val = event.target.value;
   this.auxiliar = this.informacionUsuario;
   
   if(val && val.trim() != ''){
    this.auxiliar = this.auxiliar.filter((item:any)=>{
      return (item.seccion.toLowerCase().indexOf(val.toLowerCase())>-1);
    })
  }
  

 }

}
