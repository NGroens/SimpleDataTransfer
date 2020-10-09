import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public/public.component';
import { ChooseComponent } from './pages/choose/choose.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { SendComponent } from './pages/send/send.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [PublicComponent, ChooseComponent, SendComponent, ReceiveComponent],
  imports: [
    PublicRoutingModule,
    TranslateModule,
    MatGridListModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    QRCodeModule
  ],
  providers: []
})
export class PublicModule {
}
