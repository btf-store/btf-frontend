import { Routes } from '@angular/router';
import { HomeComponent } from './pages/components/home/home.component';
import { ProductDetailComponent } from './pages/components/product/product-detail/product-detail.component';
import { CartComponent } from './pages/components/cart/cart.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent
  },
  {
    path: 'cart',
    component: CartComponent
  }
];
