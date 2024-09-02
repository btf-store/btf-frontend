import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { Product, ProductRequest } from '../../../../core/models/interface/Product';
import { EditorModule } from 'primeng/editor';
import { NzImageService } from 'ng-zorro-antd/image';
import { Branch, ProductLine } from '../../../../core/models/interface/Branch';
import { BranchService } from '../../../../core/services/branch/branch.service';
import { Response } from '../../../../core/models/generic/Response';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { EditPriceComponent } from "../edit-price/edit-price.component";
import { ProductLineService } from '../../../../core/services/productLine/product-line.service';
import { Constants } from '../../../../core/constants/Constants';
import { ProductService } from '../../../../core/services/product/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, Observable } from 'rxjs';
import { error } from '@ant-design/icons-angular';
import { Router } from '@angular/router';
import { PriceRequest } from '../../../../core/models/interface/Price';
import { SalePercentPipe } from '../../../../shared/pipes/sale-percent.pipe';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    NzDrawerModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormItemComponent,
    NzInputGroupComponent,
    NzSelectComponent,
    NzRangePickerComponent,
    FormsModule,
    CommonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzButtonComponent,
    NzDatePickerComponent,
    NzOptionComponent,
    NzUploadComponent,
    EditorModule,
    NzPopconfirmModule,
    MoneyPipe,
    EditPriceComponent,
    ReactiveFormsModule,
    SalePercentPipe
  ],
  providers: [
    NzImageService,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  formProduct: FormGroup;
  title: string = "Thông tin sản phẩm"
  isDisable: boolean = true;
  isEditPopupPrice: boolean = false;
  listBranch: Branch[] = []
  listProductLine: ProductLine[] = []
  listSizeTemplate: number[] = Constants.SIZE_TEMPLATE
  listPriceTypeTem = Constants.PRICE_TYPE

  @Input() visible = false;
  @Input() isEdit: boolean = false;
  @Input() product!: Product;
  @Output() onClosePopup = new EventEmitter<boolean>
  @Output() onSubmited = new EventEmitter<Product>

  constructor(
    private nzImageService: NzImageService,
    private branchService: BranchService,
    private productLineService: ProductLineService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private nzMessageService: NzMessageService,
    private router: Router
  ) {
    this.formProduct = this.formBuilder.group({
      productId: [0],
      productName: ['', [Validators.required]],
      productColor: ['', [Validators.required]],
      branchId: [1, [Validators.required, Validators.min(1)]],
      categoryId: [1, [Validators.required, Validators.min(1)]],
      productLineId: [1, [Validators.required, Validators.min(1)]],
      listSize: [[], [Validators.required]],
      description: ''
    });
  }

  ngOnInit(): void {
    this.getAllBranch()
  }

  ngOnChanges() {
    this.isDisable = this.isEdit
    if (!this.isEdit) {
      this.title = 'Tạo mới sản phẩm'
    } else {
      this.title = 'Thông tin sản phẩm'
    }
    this.patchValue(this.product)
  }

  patchValue(product: Product){
    this.formProduct.patchValue({
      productId: product.productId,
      productName: product.productName,
      productColor: product.color,
      branchId: product.productLine?.branch.branchId,
      categoryId: product.category.categoryId,
      productLineId: product.productLine?.productLineId,
      listSize: product.listSize,
      description: product.productLine?.description
    })
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    if(this.isEdit && !this.isDisable){
      this.patchValue(this.product)
    }else{
      this.onClosePopup.emit(this.isDisable)
    }
    this.isDisable = true;
    this.title = "Thông tin sản phẩm"
  }

  confirm() {
    let productRequest: ProductRequest = this.formProduct.value
    if (this.isEdit) {
      this.updateProduct(productRequest)
    } else {
      this.createProduct(productRequest)
    }
  }

  toggleEdit() {
    this.isDisable = false;
    this.title = "Cập nhật sản phẩm"
    if (this.product.productLine) {
      this.getProductLineOfBranch(this.product.productLine?.branch.branchId)
    }
  }



  getAllBranch() {
    this.branchService.getAllBranch().subscribe({
      next: (response: Response<Branch>) => {
        this.listBranch = response.data as Branch[]
      }
    })
  }

  getProductLineOfBranch(branchId: number) {
    this.productLineService.getAllProductLineByBranchId(branchId).subscribe({
      next: (response: Response<ProductLine>) => {
        this.listProductLine = response.data as ProductLine[]
      }
    })
  }

  getProductLineById(productLineId: number) {
    this.productLineService.getProductLineById(productLineId).subscribe({
      next: (response: Response<ProductLine>) => {
        const productLine = response.data as ProductLine
        this.formProduct.patchValue({
          description: productLine.description
        })
      }
    })
  }

  onSelectBranchChange(value: number) {
    if(value != undefined){
      this.getProductLineOfBranch(value)
      this.formProduct.patchValue({
        productLineId: 0,
      })
    }
  }

  onSelectProductLineChange(value: number) {
    if (value !== undefined) {
      if(value != 0){

        this.getProductLineById(value);
      }
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

  togglePopupAddPrice(product: Product) {
    this.product = product
    this.isEditPopupPrice = !this.isEditPopupPrice
  }

  onClosePopupEditPrice() {
    this.isEditPopupPrice = false;
  }

  onSumitPopupEditPrice(priceRequest: PriceRequest){
    const msgId = this.nzMessageService.loading(Constants.CREATING_MSG, {nzDuration: 0}).messageId
    this.productService.createProductPrice(priceRequest).pipe(
      finalize(() => {
        this.nzMessageService.remove(msgId)
      }),
      catchError(() => {
        this.nzMessageService.error(Constants.FAILED_MSG)
        return new Observable<Response<Product>>
      })
    ).subscribe({
      next: (response: Response<Product>) => {
        this.product = response.data as Product
        this.nzMessageService.success(Constants.UPDATED_MSG)
        this.onSubmited.emit(this.product)
      }
    })
  }

  createProduct(productCreate: ProductRequest) {
    const id = this.nzMessageService.loading(Constants.CREATING_MSG, { nzDuration: 0 }).messageId
    this.productService.createProduct(productCreate).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(error => {
        console.log(error)
        this.nzMessageService.error(Constants.FAILED_MSG);
        return new Observable<Response<Product>>;
      })
    ).subscribe(
      (response: Response<Product>) => {
        this.product = response.data as Product
        this.nzMessageService.success(Constants.CREATED_MSG);
        this.onSubmited.emit(this.product)
        // this.close()
      }
    )
  }

  updateProduct(productUpdate: ProductRequest) {
    const id = this.nzMessageService.loading(Constants.UPDATING_MSG, {nzDuration: 0}).messageId
    this.productService.updateProduct(productUpdate).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(error => {
        this.nzMessageService.error(Constants.FAILED_MSG)
        return new Observable<Response<Product>>
      })
    ).subscribe({
      next: (response: Response<Product>) => {
        this.product = response.data as Product
        this.nzMessageService.success(Constants.UPDATED_MSG)
        this.onSubmited.emit(this.product)
      }
    })
  }
}
