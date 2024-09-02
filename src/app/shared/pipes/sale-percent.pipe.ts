import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salePercent',
  standalone: true
})
export class SalePercentPipe implements PipeTransform {

  transform(value: number): string {
    return `${value}%`;
  }

}
