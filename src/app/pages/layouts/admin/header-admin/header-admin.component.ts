import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [
    NzMenuModule,
    AvatarModule,
    RouterLink
  ],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {

}
