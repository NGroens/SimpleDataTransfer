import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ColorSchemeService } from '../services/color-scheme.service';
import { AppConfig } from '../config/app.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public app: AppComponent,
    public colorSchemeService: ColorSchemeService
  ) {
  }

  ngOnInit(): void {
  }


  getAppConfig() {
    return AppConfig;
  }

  getEnv() {
    return environment;
  }


}
