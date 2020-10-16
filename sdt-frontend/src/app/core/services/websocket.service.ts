import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class WebsocketService {

  constructor(
    private socket: Socket,
    private router: Router) {
    socket.on('connect_error', err => this.handleConnectError(err));
    socket.on('connect_failed', err => this.handleConnectError(err));

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
