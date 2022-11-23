import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { preguntas } from '../shared/preguntas';
import { progreso } from '../shared/progreso';

@Component({
  selector: 'app-leccion',
  templateUrl: './leccion.page.html',
  styleUrls: ['./leccion.page.scss'],
})
export class LeccionPage implements OnInit {

  info:any[] = [];
  auxPregunta:any;
  envioTexto:string="";
  contadorPregunta:number = 0;
  porcent:number=0.0;
  respuestaCorecta:string;
  respuestaSeleccion:string
  
  comienzo:boolean=false;

  multiple:boolean = false;

  //----------- OPCIONES DE PROGRESO -----------
  idProgreso:string;
  auxProgreso:progreso;
  numeroEstrellas:number=0;

  //----------- Respuestas malas --------------

  numeroFalla:number=0;


  //---------- BANCO DE PREGUNTAS ------------

  listaActual = [];

  /*bancoIncorrecto = [
    "Signo coma",
    "Signo de puntuacion",
    "Comilla simple",
    "variable",
    "soluciones",
    "Terminación",
    "camisa",
    "verde",
    "camaleon",
    "seccion",
    "acento",
    "Acentuacion",
    "Mayuscula",
    "Silaba",
    "silaba tonica",
    "El perro es gordo",
    "El llegará a tiempo"
  ]*/

  bancoIncorrecto = [];

  
  constructor(private authSvc: AuthService, private router:Router, public toastC:ToastController,private alertaControl:AlertController) {
    this.inicioVariables();
    this.actualizacionCargarData();
    this.cargarProgreso();
    
   }

  ngOnInit() { }
  ionViewDidLoad(){ }
  //--------------- actualizacion de cargarData --------------

  actualizacionCargarData(){

    this.authSvc.getPreguntas<preguntas>().subscribe(res =>{
      this.info = res;
      console.log(this.info);
      this.info.sort(function(){ return Math.random()-0.5})
      this.inicioPreguntas();
    })
  }


  //---------- Barajerar preguntas ------

  barajearLista(agregar,respuesta1,respuestaC){

    this.listaActual = [];

    //this.bancoIncorrecto.sort(function(){ return Math.random()-0.5});
    //for(let i = 0;i<8 ;i++){
    //  this.listaActual.push(this.bancoIncorrecto[i]);
    //}

    this.listaActual.push(agregar);
    this.listaActual.push(respuesta1);
    this.listaActual.push(respuestaC);

    this.listaActual.sort(function(){ return Math.random()-0.5});
    console.log(this.listaActual);
  }

  //--------- PASAR PREGUNTAS -----------

  changePalabras(){

    this.auxPregunta = this.info[this.contadorPregunta];
    
    //----------- Verificar tipo de pregunta ----------
    this.multiple = false;
    if(this.auxPregunta.tipo == "multiple"){
      this.multiple = true;
      this.barajearLista(this.auxPregunta.respuesta,this.auxPregunta.respuesta2,this.auxPregunta.respuesta3);
    }
    this.envioTexto = this.auxPregunta.pregunta;
  }


  //---------- Inicio de preguntas ------------------

  inicioPreguntas(){
    
    this.auxPregunta = this.info[this.contadorPregunta];

    //----------- Verificar tipo de pregunta ----------
    this.multiple = false;
    if(this.auxPregunta.tipo == "multiple"){
      this.multiple = true;
      this.barajearLista(this.auxPregunta.respuesta,this.auxPregunta.respuesta2,this.auxPregunta.respuesta3);
    }
    this.envioTexto = this.auxPregunta.pregunta;
    this.comienzo=true;
  }



  //----------- Seleccion del usuario -------------------------

  seleccionado(valor:string){

    console.log("Valor correcto "+ this.auxPregunta.respuesta);

    if(this.auxPregunta.respuesta == valor){
      
      //--------- AUMENTAR CONTADOR DE CORRECTO ------------

      this.contadorPregunta++;
      this.porcent = this.porcent + 0.1;

      this.alerta("Respuesta correcta",'success');

      this.calcularEstrellas();
      this.authSvc.actualizarProgreso(this.auxProgreso,this.idProgreso,this.contadorPregunta,this.numeroEstrellas,this.contadorPregunta,true);
      
      //------------- redireccionar cuando termine las 10 pregruntas -----------
      if(this.contadorPregunta == 10){
        this.router.navigate(['menu']);
      }else{
        this.changePalabras();
      }

    }else{
      this.alerta("Respuesta Incorrecta",'danger');
      this.numeroFalla++;
      if(this.numeroFalla==3){
        this.presentAlert();
      }
      
    }
  }

  //------------ CALCULAR ESTRELLAS ---------------

  public calcularEstrellas(){
    if(this.contadorPregunta == 3){
      this.numeroEstrellas = 1;
    }else if(this.contadorPregunta == 6){
      this.numeroEstrellas = 2;
      this.cargarProgresoSiguente();

    }else if(this.contadorPregunta == 10){
      this.numeroEstrellas = 3;
    }
  }


  async alerta(valor:string,colores:string){
    const toast = await this.toastC.create({

      color: colores,
      duration:500,
      message:valor

    });
    toast.present();
  }


  //---------------- VERIFICAR PROGRESO ------------------

  cargarProgreso(){
      console.log("progreso ---------- ");
      this.authSvc.getIdProgreso<progreso>().subscribe(res =>{
        this.idProgreso =  res[0].customId;
        this.auxProgreso = res[0];
      })

  }

  //---------------- ACTUALIZAR SIGUENTE NIVEL ---------------

 cargarProgresoSiguente(){
  this.authSvc.getIdProgresoSiguente<progreso>().subscribe(res =>{
    this.authSvc.actualizarProgresoSiguente(res[0],res[0].customId,true);
  })
 }

generarLetra(){
	var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
	var numero = (Math.random()*15).toFixed(0);
	return letras[numero];
}
	
 colorHEX(){
	var coolor = "";
	for(var i=0;i<6;i++){
		coolor = coolor + this.generarLetra();
	}
	return "#" + coolor;
}


//--------------- ALERTA ------------------
async presentAlert() {
  const alert = await this.alertaControl.create({
    cssClass: 'my-custom-class',
    header: 'Numero de intentos permitido',
    subHeader: 'Vuelva a empezar',
    message: `<img src="https://cdn-0.emojis.wiki/emoji-pics/facebook/pensive-face-facebook.png" class="card-alert">`,
    buttons: ['OK']
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();
    this.router.navigate(['menu']);
}


//-------------- Inicializar Variables 

inicioVariables(){
  this.contadorPregunta = 0;
}








}
