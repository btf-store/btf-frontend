import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "./header-admin/header-admin.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderAdminComponent,

],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
