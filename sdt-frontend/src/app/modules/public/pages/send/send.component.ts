import { Component, OnInit } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  chooseOption;
  scanner: ZXingScannerComponent;
  scannerLoading = true;
  scannerState = 'Loading...';
  scannerError = false;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  private hasDevices: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.scanner = new ZXingScannerComponent();
    this.scannerState = this.translateService.instant('PAGES.SEND.SCAN.STATE_MESSAGES.START');

  }

  onCodeCompleted(event: string) {
    console.log(event);
    this.snackBar.open(this.translateService.instant('PAGES.SEND.SCAN.MESSAGES.CODE_SCANNED'), this.translateService.instant('OK_BUTTON'), {
      duration: 5000
    });
    this.router.navigate(['/public/send/' + event]);
  }

  showQRCodeReader() {
    this.scannerState = this.translateService.instant('PAGES.SEND.SCAN.STATE_MESSAGES.ASK_PERMISSION');

    this.scanner.askForPermission().then(r => {
      console.log(r);
      if (r) {
        this.scannerLoading = false;
      } else {
        console.log('hey');
        this.scannerLoading = false;
        this.scannerError = true;
        this.scannerState = this.translateService.instant('PAGES.SEND.SCAN.STATE_MESSAGES.NO_PERMISSIONS');
      }
    }).catch(error => {
      console.log(error);
      this.scannerLoading = false;
      this.scannerError = true;
      this.scannerState = this.translateService.instant('PAGES.SEND.SCAN.STATE_MESSAGES.NO_PERMISSIONS');
    });


  }

  onCodeResult(event) {
    this.snackBar.open(this.translateService.instant('PAGES.SEND.SCAN.MESSAGES.CODE_SCANNED'), this.translateService.instant('OK_BUTTON'), {
      duration: 5000
    });
    this.router.navigate(['/public/send/' + event]);
  }


  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }
}
