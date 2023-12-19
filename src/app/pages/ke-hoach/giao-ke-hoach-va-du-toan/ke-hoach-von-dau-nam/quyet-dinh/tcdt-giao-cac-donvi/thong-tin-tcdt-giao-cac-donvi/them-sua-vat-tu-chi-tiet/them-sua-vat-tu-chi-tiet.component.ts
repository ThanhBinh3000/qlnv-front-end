import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { chain, cloneDeep } from 'lodash';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import { Globals } from '../../../../../../../../shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from '../../../../../../../../constants/message';
import {
  PopThemSuaVatTuCacDonViComponent
} from '../pop-them-sua-vat-tu-cac-don-vi/pop-them-sua-vat-tu-cac-don-vi.component';

@Component({
  selector: 'app-them-sua-vat-tu-chi-tiet',
  templateUrl: './them-sua-vat-tu-chi-tiet.component.html',
  styleUrls: ['./them-sua-vat-tu-chi-tiet.component.scss']
})
export class ThemSuaVatTuChiTietComponent implements OnInit,OnChanges {
  @Input() isViewDetail: boolean;
  @Input() dataVatTu = [];
  @Output()
  dataVatTuChange = new EventEmitter<any[]>();

  dataVatTuTree: any[] = [];
  expandSetVatTu = new Set<string>();
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  dataVatTuCha: any[] = [];

  constructor(
    private modal: NzModalService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadDanhMucHang(),
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataVatTu && this.dataVatTu.length > 0) {
      this.convertListDataVatTu(this.dataVatTu);
      this.expandAll(this.dataVatTuTree);
    }
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

  convertListDataVatTu(data) {
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
              child.soLuong = child.dataChild[0].soLuong;
              child.donGia = child.dataChild[0].donGia;
              child.duToan = child.dataChild[0].duToan;
              child.donViTinh = child.dataChild[0].donViTinh;
              child.dataChild.shift();
            }
          });
        }
      });
    }
  }

  emitDataTable() {
    this.dataVatTuChange.emit(this.dataVatTu);
  }

  async themSuaVatTu(data: any, type: string, isRoot, sttDonVi: any, donViId?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'CHỈ TIÊU TCDT GIAO CÁC ĐƠN VỊ',
      nzContent: PopThemSuaVatTuCacDonViComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '500px',
      nzFooter: null,
      nzComponentParams: {
        isRoot: isRoot,
        itemInput: data,
        donViId: donViId,
        dataVatTuChaShow: this.dataVatTuChaShow,
        dataVatTuConClone: this.dataVatTuConClone,
        dataVatTuCha: this.dataVatTuCha,
        dataVatTuCon: this.dataVatTuCon,
        actionType: type,
      },
    });
    modalGT.afterClose.subscribe((item) => {
      if (item) {
        item.sttDonVi = sttDonVi + 1;
          if (type == 'them') {
            let countByDv = this.dataVatTu.filter(it => it.maDvi == item.maDvi).length;
            if (countByDv > 0) {
              this.dataVatTu.push(item);
            } else {
              let indexOldItem = this.dataVatTu.findIndex(it => it.maDvi == item.maDvi);
              this.dataVatTu.splice(indexOldItem, 1, item);
            }
            // this.dataVatTuNhap.push(item);
          } else {
            let index = -1;
            if (isRoot) {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTu.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha);
              if (uniqueRecord && item.maVatTuCha != data.maVatTuCha) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTuCha + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTu.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha);
            } else {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTu.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == data.maVatTu);
              if (uniqueRecord && item.maVatTu != data.maVatTu) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTu + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTu.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha && it.maVatTu == data.maVatTu);
            }
            if (index >= 0) {
              this.dataVatTu.splice(index, 1, item);
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi cần sửa.');
              return;
            }
          }
          this.convertListDataVatTu(this.dataVatTu);
          this.expandAll(this.dataVatTuTree);
          this.emitDataTable();
      }
    });
  }

  xoaKeHoachVatTu(item: any, isRoot?: boolean) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          let index = -1;
          if (isRoot) {
            let arrayAfterRemove = this.dataVatTu.filter(it => (it.maDvi != item.maDvi) || (it.maDvi == item.maDvi && it.maVatTuCha != item.maVatTuCha));
            this.dataVatTu = arrayAfterRemove;
          } else {
            index = this.dataVatTu.findIndex(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == item.maVatTu);
          }
          if (index >= 0) {
            this.dataVatTu.splice(index, 1);
          }
          this.convertListDataVatTu(this.dataVatTu);
          this.expandAll(this.dataVatTuTree);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSetVatTu.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSetVatTu.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSetVatTu.add(item1.idVirtual);
              });
            }
          });
        }
      });
    }
  }

  async loadDanhMucHang() {
    let res = await this.danhMucService.loadDanhMucHangGiaoChiTieu();
    let data = res.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cap == 2) {
        let child = [];
        if (data[i].child && data[i].child.length > 0) {
          for (let j = 0; j < data[i].child.length; j++) {
            let itemChild = {
              id: data[i].child[j].id,
              ten: data[i].child[j].ten,
              idParent: data[i].id,
              tenParent: data[i].ten,
              donViTinh: data[i].child[j].maDviTinh,
              maHang: data[i].child[j].ma,
              kyHieu: data[i].kyHieu,
            };
            child.push(itemChild);
            this.dataVatTuCon.push(itemChild);
          }
        }
        let item = {
          id: data[i].id,
          ten: data[i].ten,
          child: child,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
          donViTinh: data[i].maDviTinh,
        };
        this.dataVatTuCha.push(item);
      } else if (data[i].cap == 3) {
        let itemCon = {
          id: data[i].id,
          ten: data[i].ten,
          idParent: 0,
          tenParent: '',
          donViTinh: data[i].maDviTinh,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
        };
        this.dataVatTuCon.push(itemCon);
      }
    }
    this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
    this.dataVatTuChaShow = this.dataVatTuCha;
  }

}
