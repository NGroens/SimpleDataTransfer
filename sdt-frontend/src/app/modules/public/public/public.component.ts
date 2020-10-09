import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  constructor(private websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.websocketService.getSocket().connect();
  }


}
