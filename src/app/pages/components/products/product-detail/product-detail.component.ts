import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NzImageService } from 'ng-zorro-antd/image';
import { RequestParams } from '../../../../core/models/generic/Request';
import { CartService } from '../../../../core/services/cart/cart.service';
import { CartItem } from '../../../../core/models/interface/Cart';
import { Size } from '../../../../core/models/interface/Size';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';

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
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NzButtonComponent,
    NzSkeletonComponent

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
  formCartItem: FormGroup
  listProductRelate: Product[]
  productDetail: Product
  isImageLoaded: boolean
  isShowMore: boolean
  currentIndexImage: number
  countImageLoad: number
  quantityProduct: number
  msgId: string = ""
  isLoadingDetail = true
  isLoadingRelate = true
  listLoadingRelate = [0,1,2,3]

  @ViewChild('notificationContent', { static: true }) notificationContent!: TemplateRef<any>;

  constructor(
    private router: Router,
    private acRouter: ActivatedRoute,
    private productService: ProductService,
    private nzImageService: NzImageService,
    private formBuilder: FormBuilder,
    private cartSerice: CartService,
    private notification: NzNotificationService
  ) {
    this.listProductRelate = []
    this.productDetail = {
      productId: "",
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
    this.isImageLoaded = false;
    this.isShowMore = false;
    this.currentIndexImage  = 0;
    this.countImageLoad =  0;
    this.quantityProduct = 1;
    this.formCartItem = this.formBuilder.group({
      productSize: [''],
      quantity: [1, [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    this.scrollTopPage();
    this.acRouter.paramMap.subscribe((params) => {
      const id = (params.get('id'));
      if(id){
        this.getProductById(id)
        this.countImageLoad = 0
        this.isImageLoaded = false;
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
    this.isLoadingDetail = true
    this.productService.getProductById(id).subscribe({
      next: (response: Response<Product>) => {
          this.productDetail = response.data as Product
          if(this.productDetail.productLine !== undefined){
            this.getProductRelate(this.productDetail.productLine?.branch.branchId, this.productDetail.productId)
          }
          this.formCartItem.get("productSize")?.setValue(this.productDetail.listSize[0].sizeId)
          this.isLoadingDetail = false
      },
      error: () => this.router.navigateByUrl('')
    })
  }

  getProductRelate(branchId: number, productId: string){
    this.isLoadingRelate = true
    const param: RequestParams = {
      branchId: branchId,
      productId: productId
    }
    this.productService.getRelateProducts(param).subscribe({
      next: (response: Response<Product>) => {
          const allProducts = response.data as Product[]
          this.listProductRelate = allProducts.slice(0,4)
          this.isLoadingRelate = false
      },
      error: () => this.router.navigateByUrl('')
    })
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.productDetail.imageList.length) {
      this.currentIndexImage = index
    }
  }

  changeQuantityProduct(value: number) {
    if (value < 0) {
      if (this.formCartItem.get("quantity")?.value === 1) {
        return
      }
    }
    this.formCartItem.get("quantity")?.setValue(this.formCartItem.get("quantity")?.value + value)
  }

  onShowMore() {
    this.isShowMore = true;
  }

  onImageLoad(){
    ++this.countImageLoad
    if(this.countImageLoad === this.productDetail.imageList.length + 1){
      this.isImageLoaded = true;
    }
  }

  zoomImage(url: string): void {
    {
      this.nzImageService.preview([{src: url}], { nzZoom: 1, nzRotate: 0, nzScaleStep: 0.5 });
    }
  }

  addToCart() {
    const sizeId = this.formCartItem.get("productSize")?.value
    let size = this.productDetail.listSize.find((size) => size.sizeId == sizeId)
    if(size === undefined){
      size = this.productDetail.listSize[0]
    }
    const quantity = this.formCartItem.get("quantity")?.value
    let cartItem: CartItem = {
      productId: this.productDetail.productId,
      color: this.productDetail.color,
      imageUrl: this.productDetail.imageList[0].imageUrl,
      priceList: this.productDetail.priceList,
      productName: this.productDetail.productName,
      quantity: quantity,
      size: size
    }
    this.cartSerice.addCart(cartItem)
    this.addCartSuccessNoti(cartItem)
  }

  addCartSuccessNoti(cartItem: CartItem): void {
    this.msgId = this.notification.create(
      'success',
      'Thêm vào giỏ hàng thành công',
      this.notificationContent,
      {
        nzDuration: 2000,
      },
    ).messageId
  }

  viewCart(){
    this.router.navigateByUrl("cart");
    this.notification.remove(this.msgId)
  }
}
