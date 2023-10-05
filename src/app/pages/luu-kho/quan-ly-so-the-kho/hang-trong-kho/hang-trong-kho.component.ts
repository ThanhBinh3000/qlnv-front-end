import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-hang-trong-kho',
  templateUrl: './hang-trong-kho.component.html',
  styleUrls: ['./hang-trong-kho.component.scss']
})
export class HangTrongKhoComponent implements OnInit {
  tabs: ITab[] = [];
  constructor(
    private readonly danhMucService: DanhMucService
  ) {
  }

  async ngOnInit() {
    await this.loaiVTHHGetAll();

  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = res.data.map((loai, index) => {
        return {
          id: loai.id,
          ma: loai.ma,
          giaTri: loai.giaTri,
          total: 10,
          isSelected: index === 0
        }
      });
    }
  }

}

interface ITab {
  id: number;
  ma: string;
  giaTri: string;
  total: number;
  isSelected: boolean;
}
