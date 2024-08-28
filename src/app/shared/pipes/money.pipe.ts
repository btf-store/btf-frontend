import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
  standalone: true
})
export class MoneyPipe implements PipeTransform {

  transform(amount: number): string {
    const formattedAmount: string = amount.toLocaleString('en-US');
    return `${formattedAmount}đ`;
  }

}
