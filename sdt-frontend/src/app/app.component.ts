import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColorSchemeService } from './core/services/color-scheme.service';
import { CookieService } from 'ngx-cookie-service';

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

  ) {
    // Load Color Scheme
    this.colorSchemeService.load();
  }

  ngOnInit(): void {
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
