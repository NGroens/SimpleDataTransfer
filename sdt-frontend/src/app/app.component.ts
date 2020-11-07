import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColorSchemeService } from './core/services/color-scheme.service';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { AppConfig } from './core/config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'sdt-frontend';
  usersLanguage = 'de';
  constructor(
    public translate: TranslateService,
    public colorSchemeService: ColorSchemeService,
    public cookieService: CookieService,
    public titleService: Title

  ) {
    // Load Color Scheme
    this.colorSchemeService.load();
  }

  ngOnInit(): void {
    console.log("hey");
    this.titleService.setTitle(AppConfig.settings.header.appName);
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('de');
    this.translate.use('de');

    if (!this.cookieService.get('lang')) {
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/de|en/) ? browserLang : 'en');
      this.usersLanguage = browserLang.match(/de|en/) ? browserLang : 'en';

      return;
    }

    this.translate.use(this.cookieService.get('lang'));
    this.usersLanguage = this.cookieService.get('lang');


  }

  changeLanguage(event) {
    document.cookie = 'lang=' + event.value;

    this.translate.use(event.value);
    this.usersLanguage = event.value;
  }
}
