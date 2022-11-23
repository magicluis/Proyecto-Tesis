import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { claseNivel } from '../shared/claseNivel';
import { leccion } from '../shared/leccion';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.page.html',
  styleUrls: ['./tarjeta.page.scss'],
})
export class TarjetaPage implements OnInit {

  tarjeta: leccion [] = [];
  tarjetaActual:leccion [] = [];

  constructor(private authSvc: AuthService, private router:Router) {
    this.startData()
    //this.asignarData()
    this.obtenerTarjetas()
   }

  ngOnInit() {
    
   }

   obtenerTarjetas(){
     this.authSvc.getTarjeta<leccion>().subscribe( res =>{
       console.log("La nueva carga "+res)
        this.tarjeta = res;
        this.tarjetaActual = this.ordenarData(this.tarjeta,'numero','asc');
     })
   }


   /*
  asignarData(){
    this.authSvc.getlecciones<leccion>().subscribe(res=>{

      this.tarjeta = [];
      this.tarjetaActual=[];
      
      this.tarjeta = res;
      let aux = this.ordenarData(this.tarjeta,'numero','asc');

      //------------- modificacion para tarjetas solo del nivel correspondiente 
      for(let item of aux){
        if(item.nivel == localStorage.getItem('nivel')){
          this.tarjetaActual.push(item)
        }
      }
      
    });
  }*/

  startData(){
    this.tarjeta=[{ 
      nivel:'0',
      numero:'0',
      url:'',
    }];  
  }

  ordenarData(data,key,orden){
    return data.sort(function(a,b){
      var x = a[key],
      y = b[key];

      if (orden === 'asc') {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
      if(orden == 'desc'){
        return ((x>y)? -1:((x<y)? 1:0))
      }
    })
  }
  

}
