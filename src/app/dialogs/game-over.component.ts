import { Component } from '@angular/core';

@Component({
  template: `<h2 mat-dialog-title>Game over!</h2>
<mat-dialog-actions align="center">
  <button mat-button color="warn" [mat-dialog-close]="false" style="margin-right: 1em">Close</button>
  <button mat-button mat-raised-button color="primary" [mat-dialog-close]="true">Restart</button>
</mat-dialog-actions>`})
export class GameOverComponent { }
