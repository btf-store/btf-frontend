import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem } from '../../../core/models/interface/Cart';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NzIconModule,
    CommonModule,
    NzEmptyComponent,
    MoneyPipe
  ],
  animations: [
    trigger('imageState', [
      state('loading', style({
        opacity: 0,
        transform: 'scale(0.9)'
      })),
      state('loaded', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('loading => loaded', [
        animate('0.5s ease-in-out')
      ])
    ])
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  checkCart: boolean = true;
  cartItems: CartItem[] = [];
  imageLoaded: boolean = false;

  constructor(
    private router: Router,
    private cartService: CartService
  ){}

  ngOnInit(){
    this.router.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd){
          scroll(0,0)
        }
      }
    )
    this.getCart()
  }

  navigator(url: string){
    this.router.navigateByUrl(url)
  }

  onImageLoad(){
    this.imageLoaded = true;
  }

  getCart(){
    this.cartItems = this.cartService.getCart();
  }

  removeCartItem(productId: string){
    this.cartService.removeCartItem(productId)
    this.getCart()
  }
}
