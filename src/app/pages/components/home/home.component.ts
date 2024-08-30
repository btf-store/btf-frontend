
import { Component, ElementRef, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { SliderComponent } from "./slider/slider.component";
import { ProductComponent } from "../products/product/product.component";
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterProductComponent } from "../products/filter-product/filter-product.component";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { ProductService } from '../../../core/services/product/product.service';
import { Response } from '../../../core/models/generic/Response';
import { Product } from '../../../core/models/interface/Product';
import { PaginationResponse } from '../../../core/models/generic/PaginationResponse';
import { RequestParams } from '../../../core/models/interface/request/RequestParams';
import { HttpHeaders } from '@angular/common/http';



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
  sortBy: string = 'salePercent'
  nzSize: NzSizeDSType = "default";
  productName: string = ''
  productLineId: number = 0
  priceFrom: number = 0;
  priceTo: number = 0;
  categoryId: number = 0;

  isAscending: boolean = true;
  pageNumber = 1;
  pageSize = 16;
  totalElement = 0;
  totalPages = 0;
  products: Product[] = []
  pageSizeOption: number[] = [16, 32]

  constructor(
    private router: Router,
    private productService: ProductService
  ) { }

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

  getFilteredProduct() {
    const requestParam: RequestParams = {
      page: this.pageNumber - 1,
      pageSize: this.pageSize,
      productName: this.productName,
      productLineId: this.productLineId,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
      categoryId: this.categoryId,
      sortBy: this.sortBy,
      isAscending: this.isAscending

    }
    this.productService.getFilteredProduct(requestParam).subscribe({
      next: (response: Response<Product>) => {
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

  onPageIndexChange(pageChange: number) {
    this.pageNumber = pageChange;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  changeScroll(element: ElementRef) {
    element.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  selectedChange(value: string) {
    this.sortBy = JSON.parse(value).sortBy
    this.isAscending = JSON.parse(value).isAsceding
    this.getFilteredProduct();
  }

  priceChange(value: [number, number]){
    this.priceFrom = value[0]
    this.priceTo = value[1]
    this.getFilteredProduct()
  }
}
