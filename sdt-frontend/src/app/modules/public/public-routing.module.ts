import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { ChooseComponent } from './pages/choose/choose.component';
import { SendComponent } from './pages/send/send.component';
import { ReceiveComponent } from './pages/receive/receive.component';


const routes: Routes = [
  {
    path: 'public',
    component: PublicComponent,
    children: [
      {
        path: '',
        redirectTo: 'choose',
        pathMatch: 'full'
      },
      {
        path: 'choose',
        component: ChooseComponent
      },
      {
        path: 'send',
        component: SendComponent
      },
      {
        path: 'receive',
        component: ReceiveComponent
      },
      {
        path: '**',
        redirectTo: 'choose',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
