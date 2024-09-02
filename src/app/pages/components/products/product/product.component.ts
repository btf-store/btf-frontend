import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/interface/Product';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { SalePercentPipe } from '../../../../shared/pipes/sale-percent.pipe';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MoneyPipe,
    FormsModule,
    SalePercentPipe
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
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product
  imageLoaded: boolean = false;

  constructor(
    private router: Router,
  ){}

  navigate(url: string, id: number | string){
    this.router.navigate([url, id]);
  }

  onImageLoad(){
    this.imageLoaded = true;
  }



}
