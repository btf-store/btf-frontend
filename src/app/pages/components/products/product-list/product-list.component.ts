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
    MoneyPipe
],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent{
  isEdit:boolean = false;
  visible: boolean = false;
  selectedProvince = 'Zhejiang'
  provinceData = ['Zhejiang', 'Jiangsu']

  listOfData = [ ];
  products: Product[] = []
  productDetail: Product = {
    productColorId: 0,
    productName: '',
    color: '',
    category: '',
    imageList: [],
    priceList: [{
      value: 0
    }],
    sizeList: [],
    description: ''
  }

  constructor(
    private productService: ProductService,
    private router:  Router,
  ){}

  ngOnInit() {
    this.getAllProduct()
  }

  viewProductDetail(product: Product){
    this.isEdit = true;
    this.visible = !this.visible
    this.productDetail = product
  }

  togglePopupEdit(){
    this.visible = !this.visible
  }

  togglePopupCreate() {
    this.isEdit = false;
    this.visible = !this.visible
    this.productDetail = {
      productColorId: 0,
      productName: '',
      color: '',
      category: '',
      imageList: [],
      priceList: [{
        value: 0
      }],
      sizeList: [],
      description: ''
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

  scrollTopPage(){
    window.scrollTo(0, 0);
  }

}
