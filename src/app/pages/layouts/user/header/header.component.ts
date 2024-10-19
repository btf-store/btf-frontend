import { Component, HostListener, Input } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModeType } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NavigationEnd, Router } from '@angular/router';
import { FilterHeaderComponent } from './filter-header/filter-header.component';
import { CartService } from '../../../../core/services/cart/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FilterHeaderComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MenuModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    NzGridModule,
    NzIconModule,
    NzBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isNavbar: boolean = true;
  isCollapsed = true;
  maxWidth = window.innerWidth;
  nzMode: NzMenuModeType = 'horizontal';
  @Input() sizeCart!: number

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  toggleNavbar() {
    this.isNavbar = !this.isNavbar;
    this.isCollapsed = !this.isCollapsed
  }

  ngOnInit() {
    this.checkScreenSize();
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.checkScreenSize()
        }
      }
    )
    this.getSizeCart()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 1024) {
      this.nzMode = 'inline'
      this.isNavbar = false
    } else {
      this.nzMode = 'horizontal'
      this.isNavbar = true
    }
  }

  navigator(url: string){
    this.router.navigateByUrl(url)
  }

  getSizeCart(){
    this.sizeCart = this.cartService.getSizeCart()
    this.cartService.cartItemOb.subscribe((cart) => {
      this.sizeCart = cart.length
    })
  }
}
