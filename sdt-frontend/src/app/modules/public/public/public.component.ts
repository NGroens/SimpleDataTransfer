import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../core/services/websocket.service';
import { AppComponent } from '../../../app.component';
import { ColorSchemeService } from '../../../core/services/color-scheme.service';
import { AppConfig } from '../../../core/config/app.config';
import { environment } from '../../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { DemoModeComponent } from '../../../shared/components/demo-mode/demo-mode.component';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  versionParams = {
    version: environment.version + '-' + environment.version_state
  };


  constructor(
    private websocketService: WebsocketService,
    public app: AppComponent,
    public colorSchemeService: ColorSchemeService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.websocketService.getSocket().connect();

    if (AppConfig.settings.env.demo) {
      console.log('Application started in demo mode');
      const dialogRef = this.dialog.open(DemoModeComponent, {
        height: '80%'
      });
    }
  }

  ngAfterViewInit(): void {
    this.onResize();
  }


  getAppConfig() {
    return AppConfig;
  }

  getEnv() {
    return environment;
  }

  getFormattedCopyrightText() {
    if (new Date().getFullYear() === 2020) {
      return this.getAppConfig().settings.footer.copyrightString.replace('%year%', '');

    } else {
      return this.getAppConfig().settings.footer.copyrightString.replace('%year%', '-' + new Date().getFullYear());

    }

  }


  close(reason: string) {
    this.sidenav.close();
  }

  onResize() {
    // tslint:disable-next-line:max-line-length
    document.getElementById('content').style.height = window.screen.height - document.getElementById('footer').getBoundingClientRect().height - document.getElementById('navbar').getBoundingClientRect().height + 'px';
  }

}
