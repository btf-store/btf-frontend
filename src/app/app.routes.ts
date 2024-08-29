import { Routes } from '@angular/router';
import { UserComponent } from './pages/layouts/user/user.component';
import { HomeComponent } from './pages/components/home/home.component';
import { ProductDetailComponent } from './pages/components/products/product-detail/product-detail.component';
import { CartComponent } from './pages/components/cart/cart.component';
import { AdminComponent } from './pages/layouts/admin/admin.component';
import { ProductListComponent } from './pages/components/products/product-list/product-list.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent
      },
      {
        path: 'cart',
        component: CartComponent
      }
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: ProductListComponent
      }
    ]
  }

];
