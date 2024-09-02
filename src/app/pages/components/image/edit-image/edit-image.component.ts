import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Image, UpdateImageProduct } from '../../../../core/models/interface/Image';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Constants } from '../../../../core/constants/Constants';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { Product } from '../../../../core/models/interface/Product';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImageService } from '../../../../core/services/image/image.service';
import { RequestParams } from '../../../../core/models/interface/request/RequestParams';
import { catchError, finalize, Observable } from 'rxjs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

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
    NzTableModule,
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
  title = "Thông tin hình ảnh"
  formImage: FormGroup
  statusSelected = "ACTIVE";
  listImageType = Constants.TYPE_IMAGE
  listStatus = Constants.STATUS
  isEdit: boolean = true;
  isDoing: boolean = false;
  listFileAdd: File[] = []

  @Input() product!: Product;
  @Input() visible = false;
  @Output() onClosePopup = new EventEmitter<boolean>
  @Output() onSubmit = new EventEmitter<number>

  constructor(
    private nzImageService: NzImageService,
    private formBuilder: FormBuilder,
    private nzMessageService: NzMessageService,
    private imageService: ImageService
  ) {
    this.formImage = this.formBuilder.group({
      imageList: this.formBuilder.array([])
    })
  }

  get imageList(): FormArray {
    return this.formImage.get("imageList") as FormArray
  }

  ngOnChanges() {
    this.formImage = this.formBuilder.group({
      imageList: this.formBuilder.array([])
    })
    this.listFileAdd = []
    if (this.isEdit) {
      if (this.product.imageList !== null) {
        this.product.imageList.forEach((image: Image) => {
          this.addImageToList(image)
        })
      }
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    if(this.isDoing){
      if(!this.isEdit){
        this.product.imageList.forEach((image: Image) => {
          this.addImageToList(image)
        })
        this.isEdit = true
      }
      this.title = "Thông tin hình ảnh"
    }else{
      this.visible = false;
      this.isEdit = true;
      this.onClosePopup.emit(this.visible)
    }
    this.isDoing = false;
  }

  submit() {
    if (this.isEdit) {
      const listImage: Image[] = this.getImageListData()
      let listImageUpdate: UpdateImageProduct[] = listImage.map(image => {
        return {
          imageId: image.imageId,
          typeImage: image.typeImage,
          status: image.status
        }
      })
      this.updateImageProduct(listImageUpdate)
    } else {
      if (this.listFileAdd.length == 0) {
        this.nzMessageService.error("Vui lòng thêm hình ảnh");
      } else {
        const formData = new FormData();
        this.listFileAdd.forEach(file => {
          formData.append("listImageFile", file);
        })
        this.uploadImageProduct(this.product.productId, formData)
      }
    }
  }

  removeImageFile(index: number) {
    this.listFileAdd.splice(index, 1);
    this.removeImageInList(index)
  }

  uploadImageProduct(productId: number, formData: FormData) {
    let param: RequestParams = {
      productId: productId
    }
    const msgId = this.nzMessageService.loading(Constants.UPLOADING_MSG, { nzDuration: 0 }).messageId
    this.imageService.uploadImageProduct(param, formData).pipe(
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
      this.isEdit = true;
      this.isDoing = false;
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
      this.isDoing = false;
    })
  }

  onAddingImage() {
    this.isDoing = true;
    this.isEdit = false;
    this.formImage = this.formBuilder.group({
      imageList: this.formBuilder.array([])
    })
    this.title = "Thêm hình ảnh"
  }

  onUpdatingImage() {
    this.isDoing = true;
    this.isEdit = true;
    this.title = "Chỉnh sửa hình ảnh"
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

  getImageUrl(imageGroup: AbstractControl<any, any>): string {
    return imageGroup.get('imageUrl')?.value
  }

  getImageListData() {
    return this.imageList.value
  }


  listPreviewUrl: Array<string> = []

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
          // this.listPreviewUrl?.push(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
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
}
