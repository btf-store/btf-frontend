import { Routes } from '@angular/router';
import { UserComponent } from './pages/layouts/user/user.component';
import { HomeComponent } from './pages/components/home/home.component';
import { ProductDetailComponent } from './pages/components/products/product-detail/product-detail.component';
import { CartComponent } from './pages/components/cart/cart.component';
import { AdminComponent } from './pages/layouts/admin/admin.component';
import { ProductListComponent } from './pages/components/products/product-list/product-list.component';
import { ProductLineListComponent } from './pages/components/productLines/product-line-list/product-line-list.component';
import { BranchListComponent } from './pages/components/branch/branch-list/branch-list.component';
import { LoginComponent } from './pages/components/auth/login/login.component';
import { RegisterComponent } from './pages/components/auth/register/register.component';
import { AdminAuthComponent } from './pages/components/auth/admin-auth/admin-auth.component';
import { authGuard } from './core/guard/auth.guard';

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
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'admin/login',
    component: AdminAuthComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' },
    children: [
      // {
      //   path: '',
      //   component:
      // },
      {
        path: 'product-management',
        component: ProductListComponent
      },
      {
        path: 'product-line-management',
        component: ProductLineListComponent
      },
      {
        path: 'branch-management',
        component: BranchListComponent
      }
    ]
  }

];
