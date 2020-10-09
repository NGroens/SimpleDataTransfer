import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class WebsocketService {

  constructor(private socket: Socket) {
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
}
