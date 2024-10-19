import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Constants } from '../../../../core/constants/Constants';
import { NzFormControlComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Product } from '../../../../core/models/interface/Product';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MessageService } from 'primeng/api';
import { PriceRequest } from '../../../../core/models/interface/Price';

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
    NzPopconfirmModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './edit-price.component.html',
  styleUrl: './edit-price.component.css'
})
export class EditPriceComponent {

  formPrice: FormGroup
  priceTypeList = Constants.PRICE_TYPE
  isVisiblePercent: boolean = false;
  isContactValue: boolean = false;

  @Input() visible: boolean = false;
  @Input() product!: Product;
  @Output() onClosePopup = new EventEmitter<boolean>
  @Output() onSubmitPopup = new EventEmitter<PriceRequest>

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.formPrice = this.formBuilder.group({
      productId: [0],
      priceType: ['', [Validators.required]],
      value: [0],
      salePercent: [0]
    })
  }

  ngOnChanges() {
    this.priceTypeList = [...Constants.PRICE_TYPE]
    this.formPrice.patchValue({
      productId: this.product.productId,
      priceType: ""
    })
    if (this.product.priceList === null) {
      this.priceTypeList.splice(1, 1)
    } else {
      if (this.product.priceList[0].priceType === 'CONTACT') {
        this.priceTypeList.splice(1, 2)
      }
    }
  }

  onClose() {
    this.visible = false;
    this.onClosePopup.emit(this.visible)
  }

  onSubmit() {
    let priceRequest: PriceRequest = {
      productId: this.formPrice.get("productId")?.value,
      priceType: this.formPrice.get("priceType")?.value,
      value: this.formatPriceNumber(this.formPrice.get("value")?.value),
      salePercent: this.formPrice.get("salePercent")?.value,
    }
    this.onSubmitPopup.emit(priceRequest)
    this.onClose()
  }

  onSelectChange(value: string) {
    this.formPrice.patchValue({
      value: 0,
      salePercent: 0,
    })
    switch (value) {
      case Constants.PRICE_TYPE[0].value:
        this.isVisiblePercent = false;
        this.isContactValue = false;
        break
      case Constants.PRICE_TYPE[1].value:
        this.isVisiblePercent = true;
        this.isContactValue = false;
        this.formPrice.patchValue({
          salePercent: 100,
        })
        break
      case Constants.PRICE_TYPE[2].value:
        this.isVisiblePercent = false;
        this.isContactValue = true;
        break;
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
      let priceOrigin = this.getPriceOrigin()
      let finalValue = priceOrigin - ((value / 100) * priceOrigin)
      // const valueString = this.formatPriceString(finalValue.toString());
      this.formPrice.patchValue({
        value: this.formatPriceString(finalValue.toString())
      })
    }
  }

  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const priceNum = this.formatPriceNumber(value)
    input.value = this.formatPriceString(value)

    let priceOrigin = this.getPriceOrigin()
    if (this.isVisiblePercent) {
      this.formPrice.patchValue({
        salePercent: Math.floor(100 - ((priceNum / priceOrigin) * 100))
      })
    }
  }

  formatPriceString(value: string): string {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      return parseInt(numericValue, 10).toLocaleString('en-US');
    } else {
      return ' '
    }
  }

  formatPriceNumber(value: string): number {
    if (typeof value === "number") {
      return value
    }
    const cleanedValue = value.replace(/,/g, '');
    return parseFloat(cleanedValue);
  }

  getPriceOrigin(): number {
    if (this.product.priceList !== null) {
      let index = 0;
      if (this.product.priceList[1] !== undefined) {
        index = 1;
      }
      return this.product.priceList[index].value
    }
    return 0
  }
}
