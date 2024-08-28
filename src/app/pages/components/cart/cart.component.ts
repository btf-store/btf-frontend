import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NzIconModule,
    CommonModule,
    NzEmptyComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems = [1,2,3,4]
  checkCart: boolean = true;

  constructor(
    private router: Router
  ){}

  ngOnInit(){
    this.router.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd){
          scroll(0,0)
        }
      }
    )
  }

  navigator(url: string){
    this.router.navigateByUrl(url)
  }
}
