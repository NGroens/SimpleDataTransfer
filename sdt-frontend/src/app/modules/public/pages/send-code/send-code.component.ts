import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code');
    this.registerEvents();
    this.websocketService.getSocket().emit('code/check', { code: this.code });
  }

  registerEvents() {
    this.checkCodeSubscription = this.websocketService.getSocket().fromEvent('code/check').subscribe((event: any) => {
      this.loading = false;
      if(!event.success){
        this.error = this.translateService.instant('PAGES.SEND.MESSAGES.CODE_NOT_VALID');
      }
      console.log(event);
    });
  }

  ngOnDestroy(): void {
    this.checkCodeSubscription.unsubscribe();
  }
}
