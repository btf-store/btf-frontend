import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Constants } from '../../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class HeaderItemsService {
  items: MenuItem[];
  itemsBranch = Constants.BRANCHS.map(label => ({label}))
  constructor() {
    this.items = [
      {
        label: 'Trang chủ',
        url: ''
      },
      {
        label: 'Tất cả sản phẩm',
      },
      {
        label: 'Giày cỏ nhân tạo',
        items: this.itemsBranch
      },
      {
        label: 'Giày futsal',
        items: this.itemsBranch
      },
      {
        label: 'Thương hiệu',
        items: this.itemsBranch
      },
      {
        label: 'Hệ thống cửa hàng',
        url: ''
      }
    ]
  }

  getItems() {
    return this.items
  }
}
