import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LudogameComponent } from './_components/ludogame/ludogame.component';
import { HomeComponent } from './_components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LudogameComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
