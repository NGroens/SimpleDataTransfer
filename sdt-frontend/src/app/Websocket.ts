import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppConfig } from './core/config/app.config';

@Injectable()
export class Websocket extends Socket {
  constructor() {
    super({ url: AppConfig.settings.env.socketIOEndpoint, options: {} });
  }

}
