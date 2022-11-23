import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorPageRoutingModule } from './profesor-routing.module';

import { ProfesorPage } from './profesor.page';

//--------- Modal 
import { ModalUsuarioPage } from '../modal-usuario/modal-usuario.page'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorPageRoutingModule
  ],
  declarations: [ProfesorPage,
    ModalUsuarioPage
  ],
  entryComponents:[
    ModalUsuarioPage
  ]
})
export class ProfesorPageModule {}
