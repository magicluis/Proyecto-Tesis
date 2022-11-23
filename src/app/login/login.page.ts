import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authSvc: AuthService, private route: Router, private alertaControl:ToastController) { }

  ngOnInit() {
  }

  async onLogin(email, password){
    try{
      const user = await this.authSvc.login(email.value, password.value)

      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }else{
        this.presentAlert("Contraseña o Correo incorrecto");
      }

    }catch(error){
      console.log("Error-> contraseña o correo incorrecto", error);
      this.presentAlert(error);

    }
  }

  async onLoginGoogle(){
    try{
      const user = await this.authSvc.loginGoogle()

      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }

    }catch(error){
      console.log("Error-> ", error)
    }
  }

  private redirectUser(isVerified: boolean){
    if(isVerified){
      this.route.navigate(['menu']);
    }else{
      this.route.navigate(['verify-email']);
    }
  }


  loginAndroidV1(){
    this.authSvc.loginGoolgeV2().then(res => {

      if(res.user){
        this.authSvc.updateUserData(res.user);
        localStorage.setItem('idUsuario',res.user.uid);
        localStorage.setItem('emailUser',res.user.email);
        localStorage.setItem('imagenUser',res.user.photoURL);
        this.redirectUser(true);
        }
      
    }).catch(err => {
      alert(err);
    })
  }

  //--------------- ALERTA ------------------
async presentAlert(info) {
  const toast = await this.alertaControl.create({
    message: info,
    duration: 3000,
    color: 'danger',
  });
  toast.present();
}



}
