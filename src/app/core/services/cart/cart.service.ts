import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartItem } from '../../models/interface/Cart';
import { Constants } from '../../constants/Constants';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, empty, isEmpty, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  secretKey: string = Constants.CART_SCRET_KEY;
  cartName: string = Constants.CART_NAME;
  cartItemOb: Observable<CartItem[]>
  private cartItemBe

  constructor(
    private cookieService: CookieService
  ) {
    this.cartItemBe = new BehaviorSubject<CartItem[]>(this.getCart());
    this.cartItemOb = this.cartItemBe.asObservable();
   }

  encryptCartItem(cart: CartItem[]) {
    return CryptoJS.AES.encrypt(JSON.stringify(cart), this.secretKey).toString();
  }

  decryptCartItem(encryptCart: string): CartItem[] {
    const bytes = CryptoJS.AES.decrypt(encryptCart, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedData);
  }

  addCart(cartItem: CartItem) {
    const cartExistedEncrypt = this.cookieService.get(this.cartName);
    let cart = []
    if(cartExistedEncrypt !== ""){
      cart = this.decryptCartItem(cartExistedEncrypt);
      let itemExisted = cart.find((item) => item.productId === cartItem.productId && item.size.sizeId === cartItem.size.sizeId)
      if(itemExisted){
        itemExisted.quantity += cartItem.quantity
      } else {
        cart.push(cartItem)
      }
    }else{
      cart.push(cartItem)
    }
    this.addCarts(cart)
  }

  addCarts(cart: CartItem[]){
    this.cookieService.set(this.cartName, this.encryptCartItem(cart), {expires: 7})
    this.cartItemBe.next(cart)
    console.log(cart)
  }

  getCart(): CartItem[] {
    const cartEncrypt = this.cookieService.get(this.cartName);
    return cartEncrypt !== "" ? this.decryptCartItem(cartEncrypt) : [];
  }

  getSizeCart(){
    return this.getCart().length
  }

  removeCartItem(productId: string){
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId)
    this.addCarts(cart)
  }
}
