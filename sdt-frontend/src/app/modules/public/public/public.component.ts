import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../core/services/websocket.service';
import { AppComponent } from '../../../app.component';
import { ColorSchemeService } from '../../../core/services/color-scheme.service';
import { AppConfig } from '../../../core/config/app.config';
import { environment } from '../../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;


  constructor(
    private websocketService: WebsocketService,
    public app: AppComponent,
    public colorSchemeService: ColorSchemeService
  ) {
  }

  ngOnInit() {
    this.websocketService.getSocket().connect();
  }


  getAppConfig() {
    return AppConfig;
  }

  getEnv() {
    return environment;
  }


  close(reason: string) {
    this.sidenav.close();
  }

}
