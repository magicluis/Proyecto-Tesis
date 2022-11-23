import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private authSvc: AuthService, private router:Router) { }

  ngOnInit() {
  }

  async onLogOut(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['login']);
    }catch(error){
      console.log("Error->", error)
    }
  }

}
