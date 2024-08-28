import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-header',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    BadgeModule,
    AvatarModule,
    RouterLink,
    RouterOutlet,
    NzMenuModule,
    RouterLink,
    RouterOutlet,
    RouterModule,
    NzMenuModule,
    NzLayoutModule,
    NzIconModule,
    NzToolTipModule
  ],
  templateUrl: './filter-header.component.html',
  styleUrl: './filter-header.component.css'
})
export class FilterHeaderComponent {
  url: string = ""
  @Input() nzMode!: NzMenuModeType
  @Input() isNavbar!:boolean
}
