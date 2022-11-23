import { Injectable } from '@angular/core';
import { User } from '../shared/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { usuario } from '../shared/usuario';
import auxiliares from '../shared/auxiliares';
import { progreso } from '../shared/progreso';

import { GooglePlus } from "@ionic-native/google-plus/ngx";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore,private googlePlus:GooglePlus) { 

    this.user$ = this.afAuth.authState.pipe(

      switchMap((user) => {

        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }

        return of(null)
      })

    );

  }

  async resetPassword(email: string): Promise<void> {
    
    try{
      return this.afAuth.sendPasswordResetEmail(email);
    }catch(error){
      console.log('Error->', error)
    }
  }

  async loginGoogle(): Promise<User> {

    try{

      const { user } = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.updateUserData(user);

      //----------- variable de sesion del ID del usuario ------------------
      localStorage.setItem('idUsuario',user.uid);
      localStorage.setItem('emailUser',user.email);
      localStorage.setItem('imagenUser',user.photoURL);

      return user;
    
    }catch(error){
      console.log('Error->', error);
    }

  }

  async register( name:string, lastname :string, carnet:string, seccion:string, email: string, password: string ): Promise<User> {

    try{

      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      this.updateRegistro(user, name, lastname, seccion, carnet);
      this.agregarProgreso(user);
      await this.sendVerificationEmail();

      return user;
    
    }catch(error){
      console.log('Error->', error)
    }

  }

  async login( email: string, password: string ): Promise<User> {

    try{

      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      localStorage.setItem('idUsuario',user.uid);
      
      return user;
    
    }catch (error) {
      
      console.log('Error->', error)
    
    }

  }

  async sendVerificationEmail(): Promise<void> {

    try{
      return (await this.afAuth.currentUser).sendEmailVerification();
    }catch(error){
      console.log('Error->', error)
    }

  }

  isEmailVerified(user: User): boolean{
    return user.emailVerified === true ? true : false
  }

  async logout(): Promise<void> {

    try{
      await this.afAuth.signOut();
      await this.googlePlus.disconnect();
    }catch (error){
      console.log('Error -> ', error)
    }

  }

  public updateUserData(user: User){

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL:user.photoURL
    };
    return userRef.set(data, { merge: true })

  }

  //---------------- ACTULIZAR USUARIO ---------------------

  public getIdInfoUsuario<tipo>(){
    const id = localStorage.getItem('idUsuario');
    const path = `users/${id}/informacion`;
    let infoCollection:AngularFirestoreCollection<tipo>;
    infoCollection = this.afs.collection<tipo>(path, ref=>{
      return ref;
    })
    return infoCollection.valueChanges({idField:'customId'})
  }

  public actulizarUsuario(infoUsuario:usuario,idInfo:string,nombre:string,apellido:string,seccion:string,carnet:string){
    const idUsuario = localStorage.getItem('idUsuario');
    const path = `users/${idUsuario}/informacion/${idInfo}`;
    const infoRef:AngularFirestoreDocument<usuario> = this.afs.doc(path);

    const data:usuario = {
      nombre:nombre,
      apellido:apellido,
      seccion:seccion,
      carnet:carnet,
      correo:infoUsuario.correo,
      id:infoUsuario.id,

      //----------- Modificacion
      imagen:infoUsuario.imagen,
      tipo:infoUsuario.tipo

    }
    return infoRef.set(data,{ merge:true});
  }





//--------------------- ACTULIZAR PROGRESO ---------------------

  public actualizarProgreso(auxProgreso:progreso,idProgreso:string,auxPuntuacion:number,auxEstrellas:number,auxPorcentaje:number,auxEstado:boolean){

    const idUsuario = localStorage.getItem('idUsuario');
    const path = `users/${idUsuario}/progreso/${idProgreso}`
    const progRef: AngularFirestoreDocument<progreso> = this.afs.doc(path);
    let puntuacionActual:number=0;
    let estrellaActual:number=0;
    let porcentajeActual:number=0;


    if( auxPuntuacion > auxProgreso.puntuacion){
      puntuacionActual = auxPuntuacion;
  }else{
    puntuacionActual = auxProgreso.puntuacion;
  }

    if( auxEstrellas > auxProgreso.estrellas){
        estrellaActual = auxEstrellas;
    }else{
      estrellaActual = auxProgreso.estrellas
    }

    if( auxPorcentaje > auxProgreso.porcentaje){
      porcentajeActual = auxPorcentaje;
  }else{
      porcentajeActual = auxProgreso.porcentaje;
  }
    
    const data:progreso = {
    nivel: auxProgreso.nivel,
    estado:auxEstado,
    puntuacion:puntuacionActual,
    estrellas:estrellaActual,
    porcentaje:porcentajeActual,
    informacion:auxProgreso.informacion
    }

    return progRef.set(data,{ merge:true })

  }

  //--------------------------- ACTUALIZAR NIVEL SIGUENTE ---------

  public actualizarProgresoSiguente(auxProgreso:progreso,idProgreso:string,auxEstado:boolean){

    const idUsuario = localStorage.getItem('idUsuario');
    const path = `users/${idUsuario}/progreso/${idProgreso}`
    const progRef: AngularFirestoreDocument<progreso> = this.afs.doc(path);

    if(!auxProgreso.estado){
      
    const data:progreso = {
    nivel: auxProgreso.nivel,
    estado:auxEstado,
    puntuacion:auxProgreso.puntuacion,
    estrellas:auxProgreso.estrellas,
    porcentaje:auxProgreso.porcentaje,
    informacion:auxProgreso.informacion
    }

    return progRef.set(data,{ merge:true })
  }

  }



  getIdProgreso<tipo>(){
    const id = localStorage.getItem('idUsuario');
    const idNivel = localStorage.getItem('nivel');
    const path =  `users/${id}/progreso`;

    //--------------- obtener coleccion ---------------
    let userCollection: AngularFirestoreCollection<tipo>;
     userCollection = this.afs.collection<tipo>(path,ref =>{
       return ref.where('nivel','==', Number(idNivel));
     });
     return userCollection.valueChanges({idField:'customId'});
  }

  getIdProgresoSiguente<tipo>(){
    const id = localStorage.getItem('idUsuario');
    const idNivel = localStorage.getItem('nivel');
    const path =  `users/${id}/progreso`;
    let idsiguente = Number(idNivel)+1;
    
    //--------------- obtener coleccion ---------------
    let userCollection: AngularFirestoreCollection<tipo>;
     userCollection = this.afs.collection<tipo>(path,ref =>{
       return ref.where('nivel','==', idsiguente);
     });
     return userCollection.valueChanges({idField:'customId'});
  }



  //------------- Metodo para crear informacion ----------

  public crearInfo(){
    const id = localStorage.getItem('idUsuario');
    const path = `users/${id}/informacion`;

    const dataaux: usuario= {
      id,
      nombre:"default",
      apellido:"default",
      seccion:"default",
      carnet:"default",
      correo:localStorage.getItem('emailUser'),
      imagen:localStorage.getItem('imagenUser'),
      tipo:0
    };

    this.createDocument(dataaux,path).then(res =>{
      console.log("respuesta de firebase en nuevo registro",res)
    });

  }

  

  private updateRegistro(user: User,nombre:string, apellido:string, seccion:string, carnet:string){

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const path = `users/${user.uid}/informacion`;

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL  
    };

    const dataaux: usuario= {
      id:user.uid,
      nombre:nombre,
      apellido:apellido,
      seccion:seccion,
      carnet:carnet,
      correo:user.email,

      //------------ modificacion 
      imagen:user.photoURL,
      tipo:0

    };

    this.createDocument(dataaux,path).then(res =>{
      console.log("respuesta de firebase en nuevo registro",res)
    });

    return userRef.set(data, { merge: true })

  }

 private createDocument<tipo>(data:tipo, enlace:string){
   const userCollection: AngularFirestoreCollection<tipo> = this.afs.collection<tipo>(enlace);
   return userCollection.add(data);
}

//-------------- Obtener usuarios ------------------

getUsuarios<tipo>(){
  const path = `users/`;
  const usuarioCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>(path);
  return usuarioCollection.valueChanges();

  //const usuarioCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>('users').doc('SRl8X0WVHNSA60s999hB6OqNEPG3').collection<tipo>('informacion');
  //return usuarioCollection.valueChanges();
}

//------------- Obtener usuario por medio de id -----------

getUsuarioId<tipo>(id:string){
  const usuarioCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>('users').doc(id).collection<tipo>('informacion');


  return usuarioCollection.valueChanges();
}

//-------------- Obtener progreso por id -------------------

getUsuarioProgreso<tipo>(id:string){
  //const usuarioCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>('users').doc(id).collection<tipo>('progreso');
  //return usuarioCollection.valueChanges();

  const path = `users/${id}/progreso`;
  let userCollection: AngularFirestoreCollection<tipo>;
   userCollection = this.afs.collection<tipo>(path,ref =>{
     return ref.orderBy('nivel','asc');
   });
  return userCollection.valueChanges();
}


getDocument<tipo>(id:string){
  /*const identificador = localStorage.getItem('idUsuario');
  const path = `users/${identificador}/informacion`;
  const userCollection: AngularFirestoreCollection<tipo> = this.afs.collection<tipo>(path);
  return userCollection.valueChanges();*/

  const usuarioCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>('users').doc(id).collection<tipo>('informacion');
  return usuarioCollection.valueChanges();

}

getlecciones<tipo>(){
  const path = `lecciones/`;
  const userCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>(path);
  return userCollection.valueChanges()
}

//----------------- OBTENER TARJETAS ORDENADAS ------------------
getTarjeta<tipo>(){
  const idNivel = localStorage.getItem('nivel');
  const path = `lecciones/`;
  let userCollection: AngularFirestoreCollection<tipo>;
   userCollection = this.afs.collection<tipo>(path,ref =>{
     return ref.where("nivel","==",Number(idNivel));
   });
  return userCollection.valueChanges();
}

/*getPreguntas<tipo>(){
  const path = `preguntas/`
  const userCollection:AngularFirestoreCollection<tipo> = this.afs.collection<tipo>(path);
  return userCollection.valueChanges()
}*/

//--------- modificacion para obtener preguntas ------------

getPreguntas<tipo>(){
const idNivel = localStorage.getItem('nivel');
const path = `preguntas/`;
let prCollection: AngularFirestoreCollection<tipo>;
prCollection = this.afs.collection<tipo>(path,ref =>{
  return ref.where("nivel","==",Number(idNivel));
})
return prCollection.valueChanges()
}


//---------- obtener todas las preguntas --------------

getAllPreguntas<tipo>(){
  const path = `preguntas/`
  let prCollection: AngularFirestoreCollection<tipo>;
  prCollection = this.afs.collection<tipo>(path, ref => {
    return ref.orderBy('nivel','asc');
  })
  return prCollection.valueChanges()
}


getProgreso<tipo>(id:string){

  //const id = localStorage.getItem('idUsuario');
  const path = `users/${id}/progreso`;
  let userCollection: AngularFirestoreCollection<tipo>;
   userCollection = this.afs.collection<tipo>(path,ref =>{
     return ref.orderBy('nivel','asc');
   });
  return userCollection.valueChanges();
}

agregarProgreso(user:User){

  const path = `users/${user.uid}/progreso`;
  let auxinfo:string;
  let auxestado:boolean;


  for(let i=1;i<11;i++){

    auxestado = false;

    if(i==1){ 
      auxinfo = "Uso correcto de los acentos";
      auxestado = true;
      
  }else if(i == 2){
      auxinfo = "Uso de signos de puntuacion";
    }
    else if( i== 3){
      auxinfo = "Uso correcto de la coma";
      
    }else if( i== 4){
      auxinfo = "Uso correcto del punto y coma";

    }else if(i == 5){
      auxinfo = "Uso correcto de dos puntos";
      
    }else if(i == 6){
      auxinfo = "Uso correcto de puntos suspensivos";
      
    }else if(i == 7){
      auxinfo = "Uso correcto del gión";
      
    }else if(i == 8){
      auxinfo = "Uso de los signos de interrogacion y exclamaión";
      
    }else if(i == 9){
      auxinfo = "Uso de las mayusculas";
    }else if(i == 10){
      auxinfo = "Vicios del lenguaje";
    }

    const auxProgreso:progreso = {
      nivel: i,
      estado: auxestado,
      puntuacion:0,
      estrellas:0,
      porcentaje:0,
      informacion: auxinfo
    }
    this.createDocument(auxProgreso,path).then(res =>{
      console.log("respuesta de firebase en nuevo registro",res)
    });
  }
}


//---------- Creacion de progreso -------------

creacionProgreso(){

  const id = localStorage.getItem('idUsuario');
  const path = `users/${id}/progreso`;
  let auxinfo:string;
  let auxestado:boolean;


  for(let i=1;i<11;i++){

    auxestado = false;

    if(i==1){ 
      auxinfo = "Uso correcto de los acentos";
      auxestado = true;
      
  }else if(i == 2){
      auxinfo = "Uso de signos de puntuacion";
    }
    else if( i== 3){
      auxinfo = "Uso correcto de la coma";
      
    }else if( i== 4){
      auxinfo = "Uso correcto del punto y coma";

    }else if(i == 5){
      auxinfo = "Uso correcto de dos puntos";
      
    }else if(i == 6){
      auxinfo = "Uso correcto de puntos suspensivos";
      
    }else if(i == 7){
      auxinfo = "Uso correcto del gión";
      
    }else if(i == 8){
      auxinfo = "Uso de los signos de interrogacion y exclamaión";
      
    }else if(i == 9){
      auxinfo = "Uso de las mayusculas";
    }else if(i == 10){
      auxinfo = "Vicios del lenguaje";
    }

    const auxProgreso:progreso = {
      nivel: i,
      estado: auxestado,
      puntuacion:0,
      estrellas:0,
      porcentaje:0,
      informacion: auxinfo
    }
    this.createDocument(auxProgreso,path).then(res =>{
      console.log("respuesta de firebase en nuevo registro",res)
    });
  }
}


async loginGoolgeV2(){
  
  return this.googlePlus.login({}).then((result)=>{
    const user_data = result;
    
    return this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(null, user_data.accessToken));
})
}


}
