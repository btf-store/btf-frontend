import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EditProductComponent } from "../edit-product/edit-product.component";
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/interface/Product';
import { Response } from '../../../../core/models/generic/Response';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { EditImageComponent } from "../../image/edit-image/edit-image.component";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, Observable } from 'rxjs';
import { Constants } from '../../../../core/constants/Constants';
import { SalePercentPipe } from '../../../../shared/pipes/sale-percent.pipe';
import { RequestParams } from '../../../../core/models/generic/Request';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    EditProductComponent,
    MoneyPipe,
    EditImageComponent,
    NzPopconfirmModule,
    SalePercentPipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  isEdit: boolean
  visibleEditProduct: boolean
  visibleEditImage: boolean
  productDetail: Product
  products: Product[]

  constructor(
    private productService: ProductService,
    private nzMessageService: NzMessageService
  ) {
    this.isEdit = false
    this.visibleEditProduct = false
    this.visibleEditImage = false
    this.products = []
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
  }

  ngOnInit() {
    this.getAllProduct()
  }

  scrollTopPage() {
    window.scrollTo(0, 0);
  }

  onViewProductDetail(product: Product) {
    this.isEdit = true;
    this.visibleEditProduct = true;
    this.productDetail = product
  }

  onPopupCreate() {
    this.isEdit = false;
    this.visibleEditProduct = true
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
  }

  onPopupEditImage(product: Product) {
    this.visibleEditImage = true;
    this.productDetail = product
  }

  closePopupEditProduct() {
    this.visibleEditProduct = false;
  }

  closePopupEditImage() {
    this.visibleEditImage = false;
  }


  onSubmitedEditProduct(productCreated: Product) {
    this.onViewProductDetail(productCreated)
    this.getAllProduct()
  }

  onSubmitedEditImage(productId: string) {
    this.getProductById(productId.toString())
    this.onPopupEditImage(this.productDetail)
    this.getAllProduct()
  }

  getAllProduct() {
    const param: RequestParams = {
    }
    this.productService.searchProduct("keySearch").subscribe({
      next: (response: Response<Product>) => {
        this.products = response.data as Product[]
      }
    })
  }

  getProductById(productId: string) {
    this.productService.adminGetProductById(productId).subscribe({
      next: (response: Response<Product>) => {
        this.productDetail = response.data as Product
      }
    })
  }

  onInActiveProduct(product: Product) {
    let param: RequestParams = {
      productId: product.productId
    }
    const msg_id = this.nzMessageService.loading(Constants.UPDATED_MSG).messageId
    this.productService.inActiveProduct(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(msg_id)
      }),
      catchError(error => {
        console.log(error)
        return new Observable();
      })
    ).subscribe({
      next: () => {
        this.getAllProduct()
        this.nzMessageService.success(Constants.UPDATED_MSG)
      }
    })
  }

  onActiveProduct(product: Product) {
    let param: RequestParams = {
      productId: product.productId
    }
    const msg_id = this.nzMessageService.loading(Constants.UPDATED_MSG).messageId
    this.productService.activeProduct(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(msg_id)
      }),
      catchError(error => {
        console.log(error)
        return new Observable();
      })
    ).subscribe({
      next: () => {
        this.getAllProduct()
        this.nzMessageService.success(Constants.UPDATED_MSG)
      }
    })
  }
}
