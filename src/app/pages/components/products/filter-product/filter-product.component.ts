import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzSliderComponent } from 'ng-zorro-antd/slider';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-filter-product',
  standalone: true,
  imports: [
    NzSliderComponent,
    FormsModule,
    NzInputNumberComponent,
    MoneyPipe,
    NzIconModule,
    NzMenuModule,
    NgClass,
    CommonModule
  ],
  templateUrl: './filter-product.component.html',
  styleUrl: './filter-product.component.css',
  providers: [
    MoneyPipe
  ]
})
export class FilterProductComponent {
  currentMinPrice: number
  currentMaxPrice: number
  stepPrice: number
  rangePrice: number[]
  isCheckedBoxBranch: boolean
  isCheckedBoxSize: boolean

  @Input() selectedValue: string = ""
  @Output() onPriceChange = new EventEmitter<[number, number]>()
  @Output() onSelectedChange = new EventEmitter<string>()

  constructor(private moneyPipe: MoneyPipe) {
    this.currentMinPrice = 0;
    this.currentMaxPrice = 5000000;
    this.stepPrice = 500000;
    this.rangePrice = [this.currentMinPrice, this.currentMaxPrice];
    this.isCheckedBoxBranch = false;
    this.isCheckedBoxSize = false;
  }

  changeValue() {
    this.rangePrice = [this.currentMinPrice, this.currentMaxPrice]
  }

  onValueChange(): ((value: number) => string) {
    return (newValue: number): string => {
      return this.moneyPipe.transform(newValue)
    };
  }

  onAfterChange(minValue: number, maxValue: number) {
    this.onPriceChange.emit([minValue, maxValue])
  }

  toggleBoxBranch() {
    this.isCheckedBoxBranch = !this.isCheckedBoxBranch
  }

  toggleBoxSize() {
    this.isCheckedBoxSize = !this.isCheckedBoxSize
  }

  onSortSelected(selectedValue: string) {
    this.onSelectedChange.emit(selectedValue)
  }

  onSelectedBranch(branchId: number) {

  }
}
