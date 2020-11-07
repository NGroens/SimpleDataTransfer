import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Websocket } from '../../Websocket';


@Injectable()
export class WebsocketService {

  constructor(
    private socket: Websocket,
    private router: Router) {
    this.socket.on('connect_error', err => this.handleConnectError(err));
    this.socket.on('connect_failed', err => this.handleConnectError(err));
  }


  getMessage() {
    // @ts-ignore
    return this.socket
      .fromEvent('message')
      .pipe(map((data) => data));
  }

  getSocket() {
    return this.socket;
  }

  handleConnectError(err: any) {
    this.router.navigate(['/connect-error']);
  }



}
