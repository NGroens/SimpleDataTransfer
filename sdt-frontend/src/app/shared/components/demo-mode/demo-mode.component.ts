import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../modal/modal.component';

@Component({
  selector: 'app-demo-mode',
  templateUrl: './demo-mode.component.html',
  styleUrls: ['./demo-mode.component.scss']
})
export class DemoModeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DemoModeComponent>
  ) {
  }


  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
