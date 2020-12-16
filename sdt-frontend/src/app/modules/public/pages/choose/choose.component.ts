import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ResponsiveService } from '../../../../core/services/responsive.service';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.scss']
})
export class ChooseComponent implements OnInit, AfterContentInit {

  constructor(
    public responsiveService: ResponsiveService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.responsiveService.update();
    setTimeout(() => {
      this.responsiveService.update();

    }, 4000);
  }

}
