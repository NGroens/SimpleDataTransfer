import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DataElement {
  originalName: string;
  show: string;
  date: number;
}


@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit, OnDestroy {

  generateCode: Subscription;
  loginCode: Subscription;
  textCode: Subscription;
  fileCode: Subscription;

  loading = true;
  error = null;
  code = null;
  yourCodeParam;
  displayedColumns: string[] = ['originalName', 'show', 'date'];

  dataSource = [];

  constructor(
    private websocketService: WebsocketService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef
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

    setTimeout(() => {
      const newDataSource = this.dataSource;

      newDataSource.push({
        originalName: 'test',
        show: '<a>Text zeigen</a>',
        date: 123
      });
      this.dataSource = newDataSource;
      console.log(newDataSource);
      this.changeDetectorRefs.detectChanges();
    }, 1000);

  }

  registerEvents() {
    this.generateCode = this.websocketService.getSocket().fromEvent('code/generate').subscribe((event: any) => {
      console.log(event);
      if (event.success) {
        localStorage.setItem('sdf_token', event.token);
        this.code = event.code;
        this.yourCodeParam = { code: event.code };
      } else {
        this.error = this.translateService.instant('PAGES.RECEIVE.ERROR.GET_TOKEN_FAILED');
      }
      this.loading = false;
    });

    this.loginCode = this.websocketService.getSocket().fromEvent('code/login').subscribe((event: any) => {
      if (event.success) {
        localStorage.setItem('sdf_token', event.token);
        this.code = event.code;
        this.yourCodeParam = { code: event.code };

      } else {
        this.snackBar.open(this.translateService.instant('PAGES.RECEIVE.ERROR.INVALID_TOKEN'), this.translateService.instant('OK_BUTTON'), {
          duration: 6000
        });
        localStorage.removeItem('sdf_token');
        this.websocketService.getSocket().emit('code/generate', { newCode: true });

      }

      this.loading = false;
    });

    this.textCode = this.websocketService.getSocket().fromEvent('code/text').subscribe((event: any) => {
      // console.log(event);
      const newDataSource = this.dataSource;

      newDataSource.push({
        originalName: event.text,
        show: '<a>Text zeigen</a>',
        date: event.date
      });
      this.dataSource = newDataSource;
      console.log(newDataSource);
      this.changeDetectorRefs.detectChanges();
      // console.log(event);
      // // const newData: PeriodicElement = {
      // //   originalName: event.text,
      // //   show: '<a>Text zeigen</a>',
      // //   date: event.date
      // // };
      //
      // const newData = {
      //   originalName: 'moin',
      //   show: '<a>Text zeigen</a>',
      //   date: 12
      // };
      //
      // this.dataSource.push(newData);

    });
  }

  ngOnDestroy(): void {
    this.generateCode.unsubscribe();
    this.loginCode.unsubscribe();
  }

}
