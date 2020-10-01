import { Component } from '@angular/core';

@Component({
  template: `<h2 mat-dialog-title>Game over!</h2>
<mat-dialog-actions align="center">
  <button mat-button mat-raised-button color="primary" mat-dialog-close>Restart</button>
</mat-dialog-actions>`})
export class GameOverComponent { }
