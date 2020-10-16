import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectErrorComponent } from './shared/components/connect-error/connect-error.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/public/public.module')
      .then(m => m.PublicModule),

  },
  {
    path: 'connect-error',
    component: ConnectErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
