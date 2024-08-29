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
  minValue: number = 0;
  maxValue: number = 5000000;
  value = [this.minValue,  this.maxValue]
  value2 = []
  checkedBoxBranch = true;
  checkedBoxSize = true;
  @Input() selectedValue: string = ""
  @Output() onPriceChange = new EventEmitter<[number, number]>()
  @Output() onSelectedChange = new EventEmitter<string>()



  constructor(private moneyPipe: MoneyPipe){}

  changeValue(){
    this.value = [this.minValue, this.maxValue]
  }

  onValueChange(): ((value: number) => string)  {
    return (newValue: number): string => {
      return this.moneyPipe.transform(newValue)
    };
  }

  onAfterChange(minValue:number, maxValue:number) {
      //  this.moneyPipe.transform(newValue)
       this.onPriceChange.emit([minValue, maxValue])
  }

  toggleBoxBranch(){
    this.checkedBoxBranch = !this.checkedBoxBranch
  }

  toggleBoxSize(){
    this.checkedBoxSize = !this.checkedBoxSize
  }

  onSortSelected(selectedValue: string){
    this.onSelectedChange.emit(selectedValue)
  }

  onSelectedBranch(branchId: number){

  }
}
