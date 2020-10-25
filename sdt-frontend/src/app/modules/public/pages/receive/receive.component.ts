import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['originalName', 'show', 'date', 'type'];
  dataSource: MatTableDataSource<DataElement>;

  generateCode: Subscription;
  loginCode: Subscription;
  textCode: Subscription;
  fileCode: Subscription;

  localSavedText: IHashmap[] = [];

  loading = true;
  error = null;
  code = null;
  yourCodeParam;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private websocketService: WebsocketService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<DataElement>(ELEMENT_DATA);

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


  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    setTimeout(() => this.dataSource.paginator = this.paginator, 300);
    this.dataSource.sort = this.sort;
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
      const uCode = this.generateUCode(32);
      this.localSavedText[uCode] = event.text;
      const newDataSource = [];
      newDataSource.push({
        originalName: event.title,
        show: this.translateService.instant('PAGES.RECEIVE.INCOMING_TEXT.SHOW'),
        date: event.date,
        type: this.translateService.instant('PAGES.RECEIVE.INCOMING_TEXT.TYPE_TEXT'),
        id: uCode,
        typeRaw: 'text'

      });
      this.dataSource.data.forEach((data) => {
        newDataSource.push(data);
      });
      this.dataSource.data = newDataSource;
      this.changeDetectorRefs.detectChanges();
    });
    this.fileCode = this.websocketService.getSocket().fromEvent('code/files').subscribe((event: any) => {
      console.log(event);
      const newDataSource = [];

      event.files.forEach((file) => {
        newDataSource.push({
          originalName: file.originalName,
          show: this.translateService.instant('PAGES.RECEIVE.INCOMING_FILE.SHOW'),
          date: file.date,
          type: this.translateService.instant('PAGES.RECEIVE.INCOMING_FILE.TYPE_FILE'),
          previewUrl: file.domain + '/' + file.fileUrl,
          typeRaw: 'file'
        });
      });

      this.dataSource.data.forEach((data) => {
        newDataSource.push(data);
      });
      this.dataSource.data = newDataSource;
      console.log(newDataSource);
      this.changeDetectorRefs.detectChanges();

    });
  }

  ngOnDestroy(): void {
    this.generateCode.unsubscribe();
    this.loginCode.unsubscribe();
  }

  openModal(id) {
    console.log(id);

    const dialogRef = this.dialog.open(ModalComponent, {
      data: { text: this.localSavedText[id] },
      height: '80%'
    });

  }

  generateUCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  copyCode() {
    this.clipboard.copy(this.code);
    this.snackBar.open(this.translateService.instant('PAGES.RECEIVE.CODE_COPIED'), null, {duration: 5000});
  }
}

export interface DataElement {
  originalName: string;
  type: string;
  show: string;
  date: number;
}

export interface IHashmap {
  [key: string]: string;
}


const ELEMENT_DATA: DataElement[] = [];
