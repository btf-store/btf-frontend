import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { Product } from '../../../../core/models/interface/Product';
import { EditorModule } from 'primeng/editor';
import { NzImageService } from 'ng-zorro-antd/image';
import { Branch, ProductLine } from '../../../../core/models/interface/Branch';
import { BranchService } from '../../../../core/services/branch/branch.service';
import { Response } from '../../../../core/models/generic/Response';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { EditPriceComponent } from "../edit-price/edit-price.component";
import { ProductLineService } from '../../../../core/services/productLine/product-line.service';

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
    EditPriceComponent
],
  providers: [
    NzImageService,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  isDisable: boolean = true;
  title: string = "Thông tin sản phẩm"
  listBranch: Branch [] = []
  listProductLine: ProductLine [] = []
  listSizeTemplate: number[] = [37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 47]
  cateSelected:number = 1
  branchIdSelected: number = 1;
  productLineIdSelected: number = 1;
  isEditPopupPrice: boolean = false;

  @Input() visible = false;
  @Input() product!: Product;
  @Output() onClosePopup = new EventEmitter<boolean>
  @Input() isEdit: boolean = false;

  constructor(
    private nzImageService: NzImageService,
    private branchService: BranchService,
    private productLineService: ProductLineService
  ){}

  ngOnInit(): void {
    this.getAllBranch()
    this.getBranchesTypeOfBranch(this.branchIdSelected)
  }

  ngOnChanges(){
    this.isDisable = this.isEdit
    if(!this.isEdit){
      this.title = 'Tạo mới sản phẩm'
    } else {
      this.title = 'Thông tin sản phẩm'
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.isDisable = true;
    this.onClosePopup.emit(this.isDisable)
    this.title = "Thông tin sản phẩm"
  }

  confirm() {
    this.close()
  }

  toggleEdit() {
    this.isDisable = false;
    this.title = "Cập nhật sản phẩm"
    if(this.product.productLine){
      if(this.product.category === 'Cỏ nhân tạo'){
        this.cateSelected = 1
      }else if (this.product.category === 'Futsal'){
        this.cateSelected = 2
      }
      this.getBranchesTypeOfBranch(this.product.productLine?.branch.branchId)
      this.branchIdSelected = this.product.productLine?.branch.branchId
      this.productLineIdSelected = this.product.productLine.productLineId
    }
  }


  getAllBranch() {
    this.branchService.getAllBranch().subscribe({
      next: (response: Response<Branch>) => {
        this.listBranch = response.data as Branch[]
      }
    })
  }

  getBranchesTypeOfBranch(branchId: number) {
    this.productLineService.getAllProductLineByBranchId(branchId).subscribe({
      next: (response: Response<ProductLine>) => {
        this.listProductLine = response.data as ProductLine[]
      }
    })
  }

  getProductLineById(productLineId: number){
    this.productLineService.getProductLineById(productLineId).subscribe({
      next: (response: Response<ProductLine>) => {
        this.product.productLine = response.data as ProductLine
      }
    })
  }

  onSelectBranchChange(value: number){
    this.getBranchesTypeOfBranch(value)
    this.productLineIdSelected = 0;
  }

  onSelectProductLineChange(value: number){
    this.getProductLineById(value);
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

  onClosePopupEditPrice(){
    this.isEditPopupPrice = false;
  }
}
