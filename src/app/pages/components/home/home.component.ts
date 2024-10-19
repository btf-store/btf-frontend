
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SliderComponent } from "./slider/slider.component";
import { ProductComponent } from "../products/product/product.component";
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterProductComponent } from "../products/filter-product/filter-product.component";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { ProductService } from '../../../core/services/product/product.service';
import { PaginationResponse, Response } from '../../../core/models/generic/Response';
import { Product, ProductFilter } from '../../../core/models/interface/Product';
import { RequestParams } from '../../../core/models/generic/Request';
import { Pageable } from '../../../core/models/generic/Page';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Constants } from '../../../core/constants/Constants';
import { catchError, finalize, Observable } from 'rxjs';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SliderComponent,
    ProductComponent,
    CommonModule,
    FilterProductComponent,
    NzDividerModule,
    NzPaginationModule,
    NzSkeletonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild("allProduct") elementProducts!: ElementRef
  nzSize: NzSizeDSType = "default";
  filterProduct: ProductFilter
  pageable: Pageable
  products: Product[] = []
  pageSizeOption: number[] = [16, 32]
  listLoading = [0, 1, 2, 3]
  isLoading: boolean = true

  constructor(
    private router: Router,
    private productService: ProductService,
    private nzMessageService: NzMessageService,
  ) {
    this.filterProduct = {
      productName: '',
      productLineId: 0,
      priceFrom: 0,
      priceTo: 0,
      categoryId: 0,
      sortBy: 'salePercent',
      isAscending: true
    }

    this.pageable = {
      pageNumber: 1,
      pageSize: 16,
      totalElements: 0,
      totalPages: 0
    }
  }

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
      page: this.pageable.pageNumber - 1,
      pageSize: this.pageable.pageSize,
      productName: this.filterProduct.productName,
      productLineId: this.filterProduct.productLineId,
      priceFrom: this.filterProduct.priceFrom,
      priceTo: this.filterProduct.priceTo,
      categoryId: this.filterProduct.categoryId,
      sortBy: this.filterProduct.sortBy,
      isAscending: this.filterProduct.isAscending
    }
    this.isLoading = true
    this.productService.getFilteredProduct(requestParam).subscribe({
      next: (response: Response<Product>) => {
        const pageResponse: PaginationResponse<Product> = response.data as PaginationResponse<Product>
        this.products = pageResponse.content
        this.pageable.totalElements = pageResponse.totalElements
        this.pageable.totalPages = pageResponse.totalPages
        this.isLoading = false
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onPageIndexChange(pageChange: number) {
    this.pageable.pageNumber = pageChange;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  onPageSizeChange(pageSize: number) {
    this.pageable.pageSize = pageSize;
    this.getFilteredProduct()
    this.changeScroll(this.elementProducts);
  }

  changeScroll(element: ElementRef) {
    element.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  selectedChange(value: string) {
    this.filterProduct.sortBy = JSON.parse(value).sortBy
    this.filterProduct.isAscending = JSON.parse(value).isAsceding
    this.getFilteredProduct();
  }

  priceChange(value: [number, number]) {
    this.filterProduct.priceFrom = value[0]
    this.filterProduct.priceTo = value[1]
    this.pageable.pageNumber = 1
    this.getFilteredProduct()
  }
}
