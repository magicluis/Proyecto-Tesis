import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUsuarioPageRoutingModule } from './modal-usuario-routing.module';

import { ModalUsuarioPage } from './modal-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalUsuarioPageRoutingModule
  ],
  declarations: [],
})
export class ModalUsuarioPageModule {}
