
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FilterComponent } from "./filter/filter.component";
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


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FilterComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MenuModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    NzGridModule,
    NzIconModule,
    NzBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isNavbar: boolean = true;
  isCollapsed = true;
  maxWidth = window.innerWidth;
  nzMode: NzMenuModeType = 'horizontal';

  constructor(
    private router: Router
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
}
