import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../../../../services/helper.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { HttpClient } from '@angular/common/http';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import { UserService } from '../../../../../../../../services/user.service';
import { Globals } from '../../../../../../../../shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { MESSAGE } from '../../../../../../../../constants/message';
import { ThongTinQuyetDinh } from '../../../../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL } from '../../../../../../../../Utility/utils';
import { chain } from 'lodash';
import {
  ThemSuaMuaTangComponent
} from '../../../btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/them-sua-mua-tang/them-sua-mua-tang.component';
import { STATUS } from '../../../../../../../../constants/status';
import { LEVEL } from '../../../../../../../../constants/config';

@Component({
  selector: 'app-them-sua-vat-tu-chi-tiet',
  templateUrl: './them-sua-vat-tu-chi-tiet.component.html',
  styleUrls: ['./them-sua-vat-tu-chi-tiet.component.scss']
})
export class ThemSuaVatTuChiTietComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() dataVatTu = [];
  @Output()
  dataVatTuChange = new EventEmitter<any[]>();
  dataVatTuTree: any[] = [];
  expandSetVatTu = new Set<string>();

  constructor(
    private modal: NzModalService,
    public globals: Globals,
    private notification: NzNotificationService,
  ) {
  }

  async ngOnInit(): Promise<void> {

  }
  //vat tu moi
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetVatTu.add(id);
    } else {
      this.expandSetVatTu.delete(id);
    }
  }

  sumSoLuong(data: any, col: string) {
    let sl = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      const sum = data.dataChild.reduce((prev, cur) => {
        prev += Number(cur[col]);
        return prev;
      }, 0);
      sl = sum;
    }
    return sl;
  }

  convertListDataVatTuNhap(data) {
    this.dataVatTuTree = [];
    if (data && data.length > 0) {
      this.dataVatTuTree = chain(data).groupBy('tenDvi').map((value, key) => {
        let rs = chain(value)
          .groupBy('maVatTuCha')
          .map((v, k) => {
              return {
                tenDvi: key,
                maDvi: value[0]?.maDvi,
                idVirtual: uuidv4(),
                maVatTuCha: k,
                tenVatTuCha: v[0]?.tenVatTuCha,
                kyHieu: v[0]?.kyHieu,
                dataChild: v,
              };
            },
          ).value();
        return {
          tenDvi: key,
          maDvi: value[0].maDvi,
          donViId: value[0].donViId,
          dataChild: rs,
          idVirtual: uuidv4(),
        };
      }).value();
      this.dataVatTuTree.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0 && (!item.dataChild[0].maVatTuCha || item.dataChild[0].maVatTuCha == 'null')) {
          item.dataChild.shift();
        }
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(child => {
            if (child && child.dataChild && child.dataChild.length > 0 && (!child.dataChild[0].maVatTu || child.dataChild[0].maVatTu == 'null')) {
              child.soLuongNhap = child.dataChild[0].soLuongNhap;
              child.soLuongChuyenSang = child.dataChild[0].soLuongChuyenSang;
              child.donViTinh = child.dataChild[0].donViTinh;
              child.dataChild.shift();
            }
          });
        }
      });
    }
  }


}
