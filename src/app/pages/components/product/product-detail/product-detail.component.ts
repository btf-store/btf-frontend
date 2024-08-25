import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ProductComponent } from "../product.component";
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzRadioModule,
    NzIconModule,
    NzDividerModule,
    NzTabsModule,
    ProductComponent
],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  currentIndexImage: number = 0;
  sizeValue: string = ''
  quantity: number = 1;
  listProduct = [1,2,3,4]

  constructor(private router: Router){
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Cuộn về đầu trang
      }
    });
  }

  products = [
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-1_693fbb1c976b495da90c85ffb5f249cf.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-2_c09d15cc18ba459e9e699391b6c4bc97.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-3_f591847cf18d41d099ddde438ef19349.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-4_765cc2e39bbe4f04829be73346f3be9b.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-5_e88f8f5543734612adb82c9ea9a55666.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-1_693fbb1c976b495da90c85ffb5f249cf.jpg',
    'https://product.hstatic.net/200000278317/product/iay-da-bong-nike-zoom-mercurial-vapor-15-pro-tf-dj5606-700-trang-kem-1_693fbb1c976b495da90c85ffb5f249cf.jpg',
  ]

  selectImage(index: number) {
    if(index >= 0 && index < this.products.length){
      this.currentIndexImage = index
    }
  }

  changeQuantity(value: number) {
    if(value < 0){
      if(this.quantity === 1){
        return
      }
    }
    this.quantity = this.quantity + value
  }
}
