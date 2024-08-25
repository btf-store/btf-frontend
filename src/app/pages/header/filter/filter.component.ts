import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { HeaderItemsService } from '../../../core/services/utils/header-items.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-filter',
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
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  url: string = ""
  @Input() nzMode: NzMenuModeType = 'horizontal';
  @Input() isCollapsed = true;
}
