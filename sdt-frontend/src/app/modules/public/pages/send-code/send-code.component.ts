import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../../core/http/api.service';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements OnInit, OnDestroy {
  code;
  checkCodeSubscription: Subscription;

  loading = true;
  error = null;
  titleParam = {};

  filesToUpload: File[] = [];

  backendTypeOptions = [
    { name: this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.S3_OPTION'), value: 's3', checked: true },
    { name:  this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.LOCAL_OPTION'), value: 'local', checked: false }
  ];
  selectedBackendType = 's3';

  handleFileInput(files: FileList) {
    // @ts-ignore
    for (const file of files) {
      this.filesToUpload.push(file);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code');
    this.registerEvents();
    this.websocketService.getSocket().emit('code/check', { code: this.code });
    this.titleParam = { code: this.code };
  }

  registerEvents() {
    this.checkCodeSubscription = this.websocketService.getSocket().fromEvent('code/check').subscribe((event: any) => {
      this.loading = false;
      if (!event.success) {
        this.error = this.translateService.instant('PAGES.SEND.MESSAGES.CODE_NOT_VALID');
      }
      console.log(event);
    });
  }

  ngOnDestroy(): void {
    this.checkCodeSubscription.unsubscribe();
  }

  sendText(value, form) {
    this.apiService.sendText(this.code, value).subscribe((response: any) => {
      console.log(response);
      if (response.statusCode === 200) {
        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.SUCCESS_SEND'),
          null,
          {
            duration: 5000
          });
        form.reset();
      } else {
        if (response.statusCode === 400) {
          this.snackBar.open(
            this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.BAD_REQUEST'),
            this.translateService.instant('OK_BUTTON'),
            {
              duration: 5000
            }
          );
        }
        if (response.statusCode === 404) {
          this.snackBar.open(
            this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.ERROR_CODE_NOT_VALID'),
            this.translateService.instant('OK_BUTTON'),
            {
              duration: 5000
            }
          );
        }
        if (response.statusCode === 500) {
          this.snackBar.open(
            this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.INTERNAL_SERVER_ERROR'),
            this.translateService.instant('OK_BUTTON'),
            {
              duration: 5000
            }
          );
        }

      }
    });
  }

  sendFile(formData: any, sendFileForm) {
    if (!formData.backendType) {
      this.snackBar.open(this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.MESSAGES.ENTER_BACKENDTYPE'), this.translateService.instant('OK_BUTTON'), {
        duration: 5000
      });
      return;
    }
    // TODO check error handling when requested code is offline
    this.apiService.uploadFiles(this.code, this.filesToUpload, formData.backendType).subscribe((response: any) => {
      console.log('ERROR ehey');
      console.log(response);
      if (response.statusCode === 200) {
        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.MESSAGES.SUCCESS_SEND'),
          null,
          {
            duration: 5000
          });
        sendFileForm.reset();
      } else {

        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.INTERNAL_SERVER_ERROR'),
          this.translateService.instant('OK_BUTTON'),
          {
            duration: 5000
          }
        );
      }
    }, (error => {
      console.log(error);
      if (error.error.statusCode === 400 || error.error.statusCode === 503) {
        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.MESSAGES.BAD_REQUEST'),
          this.translateService.instant('OK_BUTTON'),
          {
            duration: 5000
          }
        );
      }
      if (error.error.statusCode === 404) {
        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_FILE.MESSAGES.ERROR_CODE_NOT_VALID'),
          this.translateService.instant('OK_BUTTON'),
          {
            duration: 5000
          }
        );
      }
      if (error.error.statusCode === 500) {
        this.snackBar.open(
          this.translateService.instant('PAGES.SEND.SEND_DATA.SEND_TEXT.MESSAGES.INTERNAL_SERVER_ERROR'),
          this.translateService.instant('OK_BUTTON'),
          {
            duration: 5000
          }
        );
      }
    }));

  }
}
