
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
    NzIconModule

],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{
  isNavbar: boolean = true;
  isCollapsed = true;
  maxWidth = window.innerWidth;
  nzMode: NzMenuModeType = 'horizontal';

  toggleNavbar(){
    this.isNavbar = !this.isNavbar;
  }

  ngOnInit(){
    console.log(this.isNavbar)
    if(this.maxWidth < 1024){
      this.nzMode = 'inline'
      this.isNavbar = false
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log(this.isNavbar)
    this.maxWidth = window.innerWidth;
    this.checkScreenSize();
  }

  checkScreenSize(){
    if(this.maxWidth < 1024){
      this.nzMode = 'inline'
      this.isNavbar = false
    }else{
      this.isNavbar = true
    }

    if(this.maxWidth >= 1024){
      this.nzMode = 'horizontal'
    }
  }
}
