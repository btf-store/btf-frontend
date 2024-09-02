import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ProductComponent } from "../product/product.component";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ProductService } from '../../../../core/services/product/product.service';
import { Response } from '../../../../core/models/generic/Response';
import { Product } from '../../../../core/models/interface/Product';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { RequestParams } from '../../../../core/models/interface/request/RequestParams';
import { NzImageService } from 'ng-zorro-antd/image';

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
    ProductComponent,
    MoneyPipe,
    NgClass
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
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  providers: [
    NzImageService
  ]
})
export class ProductDetailComponent {
  product: Product = {
    productId: 0,
    productName: '',
    color: '',
    category: {
      categoryId: 0,
      categoryName: ''
    },
    salePercent: 0,
    imageList: [],
    priceList: [{
      value: 0
    }],
    listSize: [],
    status: ''
  }
  productsRelate: Product[] = []
  countImageLoad = 0;
  imageLoaded: boolean = false;
  currentIndexImage: number = 0;
  sizeValue: string = ''
  quantity: number = 1;
  isShowMore: boolean = false;

  constructor(
    private router: Router,
    private acRouter: ActivatedRoute,
    private productService: ProductService,
    private nzImageService: NzImageService,
  ) {
  }

  ngOnInit(): void {
    this.scrollTopPage();
    this.acRouter.paramMap.subscribe((params) => {
      const id = (params.get('id'));
      if(id){
        this.getProductById(id)
        this.countImageLoad = 0
        this.imageLoaded = false;
      }
    })

  }

  scrollTopPage(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  getProductById(id: string){
    this.productService.getProductById(id).subscribe({
      next: (response: Response<Product>) => {
          this.product = response.data as Product
          if(this.product.productLine !== undefined){
            this.getProductRelate(this.product.productLine?.branch.branchId, this.product.productId)
          }
      },
      error: () => this.router.navigateByUrl('')
    })
  }

  getProductRelate(branchId: number, productColorId: number){
    const param: RequestParams = {
      branchId: branchId,
      productColorId: productColorId
    }
    this.productService.getRelateProducts(param).subscribe({
      next: (response: Response<Product>) => {
          const allProducts = response.data as Product[]
          this.productsRelate = allProducts.slice(0,4)
      },
      error: () => this.router.navigateByUrl('')
    })
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.product.imageList.length) {
      this.currentIndexImage = index
    }
  }

  changeQuantity(value: number) {
    if (value < 0) {
      if (this.quantity === 1) {
        return
      }
    }
    this.quantity = this.quantity + value
  }

  showMore() {
    this.isShowMore = true;
  }

  onImageLoad(){
    ++this.countImageLoad
    if(this.countImageLoad === this.product.imageList.length + 1){
      this.imageLoaded = true;
    }
  }

  zoomImage(url: string): void {
    {
      const images = [
        {
          src: url,
          alt: 'product image'
        }
      ];
      this.nzImageService.preview(images, { nzZoom: 1, nzRotate: 0, nzScaleStep: 0.5 });
    }
  }
}
