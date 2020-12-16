import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  constructor() {
  }

  update() {
    console.log('hey');
    console.log(window.screen.height - document.getElementById('footer').getBoundingClientRect().height - document.getElementById('navbar').getBoundingClientRect().height + 'px');
    // tslint:disable-next-line:max-line-length
    document.getElementById('content').style.height = window.screen.height - document.getElementById('footer').getBoundingClientRect().height - document.getElementById('navbar').getBoundingClientRect().height + 'px';
  }

}
