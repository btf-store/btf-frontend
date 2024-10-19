import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Image, UpdateImageProduct } from '../../../../core/models/interface/Image';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Constants } from '../../../../core/constants/Constants';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { Product } from '../../../../core/models/interface/Product';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImageService } from '../../../../core/services/image/image.service';
import { catchError, finalize, Observable } from 'rxjs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { RequestParams } from '../../../../core/models/generic/Request';
import { Status } from '../../../../core/models/type/Status';

@Component({
  selector: 'app-edit-image',
  standalone: true,
  imports: [
    NzDrawerModule,
    NzRangePickerComponent,
    NzFormControlComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzGridModule,
    NzIconModule,
    NzButtonComponent,
    FileUploadModule,
    ToastModule,
    CommonModule,
    NzSelectModule,
    FormsModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    NzInputModule,
    NzEmptyModule,
    NzIconModule
  ],
  providers: [
    MessageService,
    NzImageService
  ],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.css'
})
export class EditImageComponent {
  formImage: FormGroup
  listFileAdd: File[]
  listImageType = Constants.TYPE_IMAGE
  listStatus = Constants.STATUS
  isEdit: boolean
  isDoing: boolean
  title: string
  statusSelected: Status

  @Input() product!: Product;
  @Input() visible = false;
  @Output() onClosePopup = new EventEmitter<boolean>
  @Output() onSubmit = new EventEmitter<string>

  constructor(
    private nzImageService: NzImageService,
    private formBuilder: FormBuilder,
    private nzMessageService: NzMessageService,
    private imageService: ImageService,

  ) {
    this.title = "Thông tin hình ảnh"
    this.statusSelected = "ACTIVE"
    this.listFileAdd = []
    this.formImage = this.formBuilder.group({
      imageList: this.formBuilder.array([])
    })
    this.isEdit = true
    this.isDoing = false
  }

  ngOnChanges() {
    this.resetData()
    if (this.isEdit && this.product.imageList !== null) {
      this.patchValueImage()
    }
    this.resetStatus()
  }

  get imageList(): FormArray {
    return this.formImage.get("imageList") as FormArray
  }

  resetData() {
    this.listFileAdd = []
    this.formImage = this.formBuilder.group({
      imageList: this.formBuilder.array([])
    })
  }

  resetStatus() {
    this.isEdit = true;
    this.isDoing = false;
  }

  patchValueImage() {
    this.product.imageList.forEach((image: Image) => {
      this.addImageToList(image)
    })
  }

  close(): void {
    if (this.isDoing) {
      this.title = "Thông tin hình ảnh"
      this.resetData()
      this.patchValueImage()
    } else {
      this.visible = false;
      this.onClosePopup.emit(this.visible)
    }
    this.resetStatus()
  }

  submit() {
    if (this.isEdit) {
      this.onUpdateImageSubmit()
    } else {
      this.onUploadImageSubmit()
    }
  }

  onUploadImageSubmit(){
    if (this.listFileAdd.length == 0) {
      this.nzMessageService.error("Vui lòng thêm hình ảnh", {nzDuration: 2500});
    } else {
      const imagesFile = new FormData();
      this.listFileAdd.forEach(file => {
        imagesFile.append("listImageFile", file);
      })
      this.uploadImageProduct(this.product.productId, imagesFile)
    }
  }

  onUpdateImageSubmit(){
    const listImage = this.getImageListData() as Image[]
    let listImageUpdate: UpdateImageProduct[] = listImage.map(image => {
      return {
        imageId: image.imageId,
        typeImage: image.typeImage,
        status: image.status
      }
    })
    this.updateImageProduct(listImageUpdate)
  }

  removeImageFile(index: number) {
    this.listFileAdd.splice(index, 1);
    this.removeImageInList(index)
  }

  uploadImageProduct(productId: string, imagesFile: FormData) {
    let param: RequestParams = {
      productId: productId
    }
    const msgId = this.nzMessageService.loading(Constants.UPLOADING_MSG, { nzDuration: 0 }).messageId
    this.imageService.uploadImageProduct(param, imagesFile).pipe(
      finalize(() => {
        this.nzMessageService.remove(msgId)
      }),
      catchError(() => {
        this.nzMessageService.error(Constants.FAILED_MSG)
        return new Observable();
      })
    ).subscribe(() => {
      this.nzMessageService.success(Constants.UPLOADED_MSG)
      this.onSubmit.emit(productId);
      this.resetStatus()
    })
  }

  updateImageProduct(body: UpdateImageProduct[]) {
    const msgId = this.nzMessageService.loading(Constants.UPDATING_MSG, { nzDuration: 0 }).messageId
    this.imageService.updateImageProduct(body).pipe(
      finalize(() => {
        this.nzMessageService.remove(msgId)
      }),
      catchError(() => {
        this.nzMessageService.error(Constants.FAILED_MSG)
        return new Observable();
      })
    ).subscribe(() => {
      this.nzMessageService.success(Constants.UPDATED_MSG)
      this.onSubmit.emit(this.product.productId);
      this.resetStatus()
    })
  }

  onAddingImage() {
    this.title = "Thêm hình ảnh"
    this.isDoing = true;
    this.isEdit = false;
    this.resetData()
  }

  onUpdatingImage() {
    this.title = "Chỉnh sửa hình ảnh"
    this.isDoing = true;
    this.isEdit = true;
  }

  addImageToList(image: Image) {
    this.imageList.push(this.formBuilder.group({
      imageId: [image.imageId || 0,],
      imageUrl: [image.imageUrl,],
      typeImage: [image.typeImage, [Validators.required]],
      status: [image.status,]
    }))
  }

  removeImageInList(index: number) {
    this.imageList.removeAt(index)
  }

  getImageUrlFromGroup(imageGroup: AbstractControl<any, any>): string {
    return imageGroup.get('imageUrl')?.value
  }

  getImageListData() {
    return this.imageList.value
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement
    if (fileInput.files) {
      Array.from(fileInput.files).forEach(file => {
        //add to file list
        this.listFileAdd.push(file)
        //read file
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string
          this.addImageToList({
            imageId: 0,
            imageUrl: imageUrl,
            typeImage: this.listImageType[0],
            status: this.listStatus[0]
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  zoomImage(url: string): void {
    {
      this.nzImageService.preview([{ src: url, }], { nzZoom: 1, nzRotate: 0, nzScaleStep: 0.5 });
    }
  }
}
