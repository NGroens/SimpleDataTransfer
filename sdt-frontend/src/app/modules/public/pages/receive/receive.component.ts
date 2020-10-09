import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit, OnDestroy {

  generateCode: Subscription;
  loginCode: Subscription;
  loading = true;
  error = null;
  code = null;
  yourCodeParam;

  constructor(
    private websocketService: WebsocketService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.registerEvents();
    console.log(localStorage.getItem('sdf_token'));
    if (localStorage.getItem('sdf_token')) {
      this.websocketService.getSocket().emit('code/login', { jwt: localStorage.getItem('sdf_token') });

    } else {
      this.websocketService.getSocket().emit('code/generate', { newCode: true });

    }

  }

  registerEvents() {
    this.generateCode = this.websocketService.getSocket().fromEvent('code/generate').subscribe((event: any) => {
      console.log(event);
      if (event.success) {
        localStorage.setItem('sdf_token', event.token);
        this.code = event.code;
        this.yourCodeParam = { code: event.code};
      } else {
        this.error = this.translateService.instant('PAGES.RECEIVE.ERROR.GET_TOKEN_FAILED');
      }
      this.loading = false;
    });

    this.generateCode = this.websocketService.getSocket().fromEvent('code/login').subscribe((event: any) => {
      if (event.success) {
        localStorage.setItem('sdf_token', event.token);
        this.code = event.code;
        this.yourCodeParam = { code: event.code};

      } else {
        this.snackBar.open(this.translateService.instant('PAGES.RECEIVE.ERROR.INVALID_TOKEN'), this.translateService.instant('OK_BUTTON'), {
          duration: 6000
        });
        localStorage.removeItem('sdf_token');
        this.websocketService.getSocket().emit('code/generate', { newCode: true });

      }

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.generateCode.unsubscribe();
  }

}
