import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule} from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Image } from '../../../../core/models/interface/Image';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { Constants } from '../../../../core/constants/Constants';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { Product } from '../../../../core/models/interface/Product';

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
    NzPopconfirmModule
  ],
  providers: [
    MessageService,
    NzImageService
  ],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.css'
})
export class EditImageComponent {
  statusSelected = "ACTIVE";
  listImageType = Constants.TYPE_IMAGE
  listStatus = Constants.STATUS
  @Input() product!: Product;
  @Input() visible = false;
  @Output() onClosePopup = new EventEmitter<boolean>

  constructor(
    private nzImageService: NzImageService
  ){}

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.onClosePopup.emit(this.visible)
  }


  previewUrl: string | ArrayBuffer | null = null;

  listPreviewUrl: Array<string> = []
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement
    if(fileInput.files){
      Array.from(fileInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.listPreviewUrl?.push(reader.result as string)
        }
        reader.readAsDataURL(file)
      })

    }
  }

  zoomImage(url: string): void {
    console.log(url)
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
