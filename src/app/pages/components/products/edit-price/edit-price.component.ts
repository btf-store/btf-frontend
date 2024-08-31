import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Constants } from '../../../../core/constants/Constants';
import { NzFormControlComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Product } from '../../../../core/models/interface/Product';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MessageService } from 'primeng/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-edit-price',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzSelectModule,
    FormsModule,
    CommonModule,
    NzInputModule,
    MoneyPipe,
    NzPopconfirmModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './edit-price.component.html',
  styleUrl: './edit-price.component.css'
})
export class EditPriceComponent {
  priceType = Constants.PRICE_TYPE
  priceSelected = Constants.PRICE_TYPE[0]
  isVisiblePercent: boolean = false;
  percentValue: number = 0;
  priceValue: string = '';

  @Input() visible: boolean = false;
  @Input() product!: Product;
  @Output() onClosePopup = new EventEmitter<boolean>

  constructor(
    private nzMessageService: NzMessageService
  ) { }

  onSelectChange(value: string) {
    if (value === Constants.PRICE_TYPE[1]) {
      this.isVisiblePercent = true;
    } else {
      this.isVisiblePercent = false
    }
  }

  onPercentChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.valueAsNumber;
    if (value < 0) {
      input.value = '0';
      value = 0;
    } else if (value > 100) {
      input.value = '100';
      value = 100;
    }
    if (!isNaN(value)) {
      let index = 0;
      if (this.product.priceList[1] !== undefined) {
        index = 1;
      }
      let priceOrigin = this.getPriceOrigin()
      let finalValue = priceOrigin - ((value / 100) * priceOrigin)
      this.priceValue = this.formatPriceString(finalValue.toString())
    }
  }

  getPriceOrigin(): number {
    let index = 0;
    if (this.product.priceList[1] !== undefined) {
      index = 1;
    }
    return this.product.priceList[index].value
  }

  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const priceNum = this.formatPriceNumber(value)
    input.value = this.formatPriceString(value)

    let priceOrigin = this.getPriceOrigin()
    this.percentValue = Math.floor(100 - ((priceNum / priceOrigin) * 100))
  }

  formatPriceString(value: string): string {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      return parseInt(numericValue, 10).toLocaleString('en-US');
    } else {
      return ' '
    }
  }

  formatPriceNumber(value: string) {
    const cleanedValue = value.replace(/,/g, '');
    return parseFloat(cleanedValue);
  }

  onClose() {
    this.visible = false;
    this.resetValue()
    this.onClosePopup.emit(this.visible)
  }

  onSubmit() {
    this.nzMessageService
      .loading('Đang cập nhật', { nzDuration: 2500 })
      .onClose!.pipe(
        concatMap(() => this.nzMessageService.success('Cập nhật thành công', { nzDuration: 500 }).onClose!)
      )
      .subscribe(() => {
        this.onClose()
      });
  }

  resetValue() {
    this.priceValue = '';
    this.percentValue = 0;
  }
}
