
import { Component, ElementRef, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { SliderComponent } from "./slider/slider.component";
import { ProductComponent } from "../products/product/product.component";
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterProductComponent } from "../products/filter-product/filter-product.component";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { PaginatorModule } from 'primeng/paginator';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { ProductService } from '../../../core/services/product/product.service';
import { Response } from '../../../core/models/generic/Response';
import { Product } from '../../../core/models/interface/Product';
import { PaginationResponse } from '../../../core/models/generic/PaginationResponse';
import { RequestParams } from '../../../core/models/interface/request/RequestParams';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SliderComponent,
    ProductComponent,
    CommonModule,
    FilterProductComponent,
    NzDividerModule,
    NzPaginationModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild("allProduct") elementProducts!: ElementRef
  totalTemplate = 10
  listProduct = [1,2,3,4,5,6,7,8,9]
  nzSize: NzSizeDSType = "default";
  productName: string = ''
  branchTypeId: number = 0
  priceFrom: number =  0;
  priceTo: number = 0;
  categoryId: number = 0;
  sortBy = 'on_sales'
  isAscending: boolean = true;
  pageNumber = 1;
  pageSize = 16;
  totalElement = 0;
  totalPages = 0;
  products: Product[] = []
  pageSizeOption: number[] =  [16,32]

  constructor(
    private router: Router,
    private productService: ProductService
  ){}

  ngOnInit() {
    this.checkScreenSize();
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.checkScreenSize()
        }
      }
    )
    this.getFilteredProduct();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth <= 430) {
      this.nzSize = 'small'
    } else {
      this.nzSize = 'default'
    }
  }

  getFilteredProduct(){
    const requestParam: RequestParams = {
      page: this.pageNumber - 1,
      pageSize: this.pageSize,
      productName: this.productName,
      branchTypeId: this.branchTypeId,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
      categoryId: this.categoryId,
      sortBy: this.sortBy,
      isAscending: this.isAscending
    }
    this.productService.getFilteredProduct(requestParam).subscribe({
      next: (response: Response<Product>)  => {
        const pageResponse: PaginationResponse<Product> = response.data as PaginationResponse<Product>
        this.products = pageResponse.content
        this.totalElement = pageResponse.totalElements
        this.totalPages = pageResponse.totalPages
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onPageIndexChange(pageChange: number){
    this.pageNumber = pageChange;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  onPageSizeChange(pageSize: number){
    this.pageSize = pageSize;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  changeScroll(element: ElementRef){
    element.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
