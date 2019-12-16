import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LudogameComponent } from './_components/ludogame/ludogame.component';
import { HomeComponent } from './_components/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play-game', component: LudogameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
