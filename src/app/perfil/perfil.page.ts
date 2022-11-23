import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { usuario } from '../shared/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  informacion:usuario;
  idInfo:string;

  constructor(private authSvc: AuthService, private router:Router) { }
  ngOnInit() {
    this.startedData();
    this.cargarData();
    this.obtenerIdInfo();

  }

  cargarData(){
    const id = localStorage.getItem('idUsuario');
    this.authSvc.getDocument<usuario>(id).subscribe(res=>{
      console.log(res[0])
      this.informacion = res[0];
    });
  }

  obtenerIdInfo(){
    this.authSvc.getIdInfoUsuario<usuario>().subscribe(res =>{
       this.idInfo = res[0].customId;
      
    })
  }

  startedData(){
    this.informacion={ 
      id:'Default',
      nombre:'Default',
      apellido:'Default',
      carnet:'Default',
      seccion:'Default',
      correo:'Default',
      imagen:'',
      tipo:0
    };  
  }

  //------------- METODO PARA ACTULIZAR -----------

  actualizar(nombre,apellido,seccion,carnet){
    console.log("El id de la info es "+this.idInfo);
    this.authSvc.actulizarUsuario(this.informacion,this.idInfo,nombre.value,apellido.value,seccion.value,carnet.value);
    this.router.navigate(['menu']);
    
  }

}
