import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onRegister(nombre,apellido,carnet,seccion,email, password){
    
    try{

      const user = await this.authSvc.register( nombre.value,apellido.value,carnet.value,seccion.value,email.value, password.value);

      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }

    }catch(error){
      console.log("Error->", error);
    }

  }

  private redirectUser(isVerified: boolean){
    if(isVerified){
      this.router.navigate(['admin'])
    }else{
      this.router.navigate(['verify-email'])
    }
  }

}
