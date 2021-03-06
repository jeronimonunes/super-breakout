import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { GameOverComponent } from './dialogs/game-over.component';
import { WelcomeComponent } from './dialogs/welcome.component';
import { YouWinComponent } from './dialogs/you-win.component';



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GameOverComponent,
    YouWinComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
