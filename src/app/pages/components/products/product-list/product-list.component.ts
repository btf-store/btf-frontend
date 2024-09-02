import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EditProductComponent } from "../edit-product/edit-product.component";
import { ProductService } from '../../../../core/services/product/product.service';
import { RequestParams } from '../../../../core/models/interface/request/RequestParams';
import { Product } from '../../../../core/models/interface/Product';
import { Response } from '../../../../core/models/generic/Response';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Router } from '@angular/router';
import { EditImageComponent } from "../../image/edit-image/edit-image.component";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, Observable } from 'rxjs';
import { Constants } from '../../../../core/constants/Constants';
import { SalePercentPipe } from '../../../../shared/pipes/sale-percent.pipe';

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
export class ProductListComponent{
  isEdit:boolean = false;
  visibleEditProduct: boolean = false;
  visibleEditImage: boolean = false;
  selectedProvince = 'Zhejiang'
  provinceData = ['Zhejiang', 'Jiangsu']

  listOfData = [ ];
  products: Product[] = []
  productDetail: Product = {
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

  constructor(
    private productService: ProductService,
    private router:  Router,
    private nzMessageService: NzMessageService
  ){}

  ngOnInit() {
    this.getAllProduct()
  }

  viewProductDetail(product: Product){
    this.isEdit = true;
    this.visibleEditProduct = true;
    this.productDetail = product
  }

  togglePopupEdit(){
    this.visibleEditProduct = !this.visibleEditProduct
  }

  togglePopupEditImage(){
    this.visibleEditImage = !this.visibleEditImage
  }

  togglePopupCreate() {
    this.isEdit = false;
    this.visibleEditProduct = !this.visibleEditProduct
    this.productDetail = {
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
  }

  getAllProduct(){
    const param: RequestParams = {
    }
    this.productService.searchProduct("keySearch").subscribe({
      next: (response: Response<Product>) => {
        this.products = response.data as Product[]
      }
    })
  }

  getProductById(productId: string){
    this.productService.adminGetProductById(productId).subscribe({
      next: (response: Response<Product>) => {
        this.productDetail = response.data as Product
      }
    })
  }

  scrollTopPage(){
    window.scrollTo(0, 0);
  }

  editImage(product: Product) {
    this.visibleEditImage = true;
    this.productDetail = product
  }

  onSubmited(productCreated: Product) {
    this.viewProductDetail(productCreated)
    this.getAllProduct()
  }

  onSubmitedEditImage(productId: number){
    this.getProductById(productId.toString())
    this.editImage(this.productDetail)
    this.getAllProduct()
  }

  inActiveProduct(product: Product){
    let param: RequestParams = {
      productId: product.productId
    }
    const id = this.nzMessageService.loading(Constants.UPDATED_MSG).messageId
    this.productService.inActiveProduct(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(error => {
        console.log(error)
        return new Observable();
      })
    ).subscribe({
      next:  () => {
        this.getAllProduct()
        this.nzMessageService.success(Constants.UPDATED_MSG)
      }
    })
  }

  activeProduct(product: Product){
    let param: RequestParams = {
      productId: product.productId
    }
    const id = this.nzMessageService.loading(Constants.UPDATED_MSG).messageId
    this.productService.activeProduct(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(error => {
        console.log(error)
        return new Observable();
      })
    ).subscribe({
      next:  () => {
        this.getAllProduct()
        this.nzMessageService.success(Constants.UPDATED_MSG)
      }
    })
  }
}
