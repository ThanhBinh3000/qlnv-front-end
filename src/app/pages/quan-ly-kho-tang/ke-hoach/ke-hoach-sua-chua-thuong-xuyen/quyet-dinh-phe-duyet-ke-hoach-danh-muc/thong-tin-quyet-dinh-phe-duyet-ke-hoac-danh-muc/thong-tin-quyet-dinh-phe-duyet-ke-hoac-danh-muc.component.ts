import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../../../../../services/user.service';
import { Globals } from '../../../../../../shared/globals';
import { DanhMucService } from '../../../../../../services/danhmuc.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HelperService } from '../../../../../../services/helper.service';
import dayjs from 'dayjs';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  DialogQdXdTrungHanComponent,
} from '../../../../../../components/dialog/dialog-qd-xd-trung-han/dialog-qd-xd-trung-han.component';
import { MESSAGE } from '../../../../../../constants/message';
import { STATUS } from '../../../../../../constants/status';
import { UserLogin } from '../../../../../../models/userlogin';
import { TongHopKhTrungHanService } from '../../../../../../services/tong-hop-kh-trung-han.service';
import {
  DialogThemMoiKehoachDanhmucChitietComponent,
} from '../../de-xuat-ke-hoach-sua-chua-thuong-xuyen/thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen/dialog-them-moi-kehoach-danhmuc-chitiet/dialog-them-moi-kehoach-danhmuc-chitiet.component';
import {
  TongHopScThuongXuyenService,
} from '../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/tong-hop-sc-thuong-xuyen.service';

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-ke-hoac-danh-muc',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-ke-hoac-danh-muc.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-ke-hoac-danh-muc.component.scss'],
})
export class ThongTinQuyetDinhPheDuyetKeHoacDanhMucComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input() dataInput: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  maQd: string;
  listDx: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  expandSet = new Set<number>();
  listToTrinh: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  fileDinhKems: any[] = [];
  canCuPhapLys: any[] = [];
  listDmSuaChua: any[] = [];
  listNam: any[] = [];
  userInfo: UserLogin;

  STATUS = STATUS;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxXdTh: TongHopKhTrungHanService,
    private quyetDinhService: TongHopScThuongXuyenService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year')],
      soToTrinh: [null, Validators.required],
      soQuyetDinh: [null],
      trichYeu: [null],
      ngayKy: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['ĐANG NHẬP DỮ LIỆU'],
      loai: ['01', Validators.required],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC';
    this.redirectQd();
    this.loadDsNam();
    await this.getDetail(this.idInput);
  }

  async redirectQd() {
    if (this.dataInput && this.dataInput.soQuyetDinh) {
      this.formData.patchValue({
        phuongAnTc: this.dataInput.soQuyetDinh,
        namBatDau: this.dataInput.namBatDau,
        namKetThuc: this.dataInput.namKetThuc,
        loaiDuAn: this.dataInput.loaiDuAn,
      });
      await this.loadDsChiTiet(this.dataInput.id);
    }
  }

  async getDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKh: data.namKh,
        soToTrinh: data.soToTrinh,
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split('/')[0] : null,
        ngayKy: data.ngayKy,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
      });
      this.fileDinhKems = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
      // this.listDx = data.listDx;
      this.dataTableReq = data.listKtKhThkhScThuongXuyenDtl;
      this.dataTable = this.convertListData(this.dataTableReq);
      this.expandAll(this.dataTable);
      // if (this.listDx && this.listDx.length > 0) {
      //   this.selectRow(this.listDx[0]);
      // }
    }
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    if (isGuiDuyet || this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQuyetDinh = body.soQuyetDinh ? body.soQuyetDinh + this.maQd : null;
    body.listKtKhThkhScThuongXuyenDtl = this.dataTableReq;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLys = this.canCuPhapLys;
    body.maDvi = this.userInfo.MA_DVI;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhService.update(body);
    } else {
      res = await this.quyetDinhService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai,
        });
        this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai,
          });
          this.idInput = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  setValidators() {
    this.formData.controls['soToTrinh'].setValidators([Validators.required]);
    this.formData.controls['ngayKy'].setValidators([Validators.required]);
    this.formData.controls['soQuyetDinh'].setValidators([Validators.required]);
    this.formData.controls['namKh'].setValidators([Validators.required]);
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DANG_NHAP_DU_LIEU : {
              trangThai = STATUS.BAN_HANH;
              break;
            }
          }
          let body = {
            id: this.formData.get('id').value,
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async loadDsToTrinh() {
    let body = {
      'namKh': this.formData.value.namKh,
      'loai': '00',
      'paggingReq': {
        'limit': 1000,
        'page': 0,
      },
    };
    let res = await this.quyetDinhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listToTrinh = data.content;
      if (this.listToTrinh && this.listToTrinh.length > 0) {
        this.listToTrinh = this.listToTrinh.filter(item => item.trangThai == STATUS.DA_DUYET_LDTC && !item.soQdPdKhDm);
      }
    }
  }

  async openDialogToTrinh() {
    await this.loadDsToTrinh();
    if (!this.isViewDetail) {
      console.log(this.listToTrinh, 123)
      const modal = this.modal.create({
        nzTitle: 'Danh sách Phương án của Tổng cục',
        nzContent: DialogQdXdTrungHanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          type: 'QDTX',
          dsPhuongAn: this.listToTrinh,
        },
      });
      modal.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soToTrinh: data.soToTrinh,
          });
          await this.loadDsChiTiet(data.id);
        }
      });
    }
  }

  async loadDsChiTiet(id: number) {
    let res = await this.quyetDinhService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      let detailTh = res.data;
      // this.listDx = detailTh.listDx;
      this.dataTableReq = detailTh.listKtKhThkhScThuongXuyenDtl;
      this.dataTableReq.forEach(item => {
        item.id = null;
        item.idHdr = null;
      });
      this.dataTable = this.convertListData(this.dataTableReq);
      this.expandAll(this.dataTable);
      console.log(this.dataTable)
    }
  }

  selectRow(item: any) {
    if (!item.selected) {
      this.dataTable = [];
      this.listDx.forEach(item => {
        item.selected = false;
      });
      item.selected = true;
      // phg án tổng cục
      this.dataTable = this.dataTableReq.filter(data => data.idHdrDx == item.id);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    }
  }

  convertListData(table: any[]) {
    if (table && table.length > 0) {
      table = chain(table)
        .groupBy('tenDvi')
        .map((value, key) => {
          let rs = chain(value)
            .groupBy('tenChiCuc')
            .map((v, k) => {
                let rs1 = chain(v)
                  .groupBy('khoi')
                  .map((v1, k1) => {
                      return {
                        idVirtual: uuidv4(),
                        khoi: k1,
                        dataChild: v1,
                        tenKhoi: v1 && v1[0] && v1[0].tenKhoi ? v1[0].tenKhoi : null,
                      };
                    },
                  ).value();
                return {
                  idVirtual: uuidv4(),
                  tenChiCuc: k,
                  dataChild: rs1,
                };
              },
            ).value();
          return {
            idVirtual: uuidv4(),
            tenDvi: key,
            dataChild: rs,
          };
        }).value();
    }
    return table;
    // if (table && table.length > 0) {
    //   table = chain(table)
    //     .groupBy('tenChiCuc')
    //     .map((value, key) => {
    //       let rs = chain(value)
    //         .groupBy('khoi')
    //         .map((v, k) => {
    //             return {
    //               idVirtual: uuidv4(),
    //               khoi: k,
    //               tenKhoi: v[0].tenKhoi,
    //               dataChild: v,
    //             };
    //           },
    //         ).value();
    //       return {
    //         idVirtual: uuidv4(),
    //         tenChiCuc: key,
    //         dataChild: rs,
    //       };
    //     }).value();
    // }
    // return table;
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSet.add(item1.idVirtual);
              });
            }
          });
        }
      });
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  sumSoLuong(tenChiCuc: string, row: string, khoi: string) {
    let sl = 0;
    if (tenChiCuc && khoi) {
      let arr = this.dataTableReq.filter(item => item.tenChiCuc == tenChiCuc && item.khoi == khoi);
      if (arr && arr.length > 0) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      const sum = this.dataTableReq.reduce((prev, cur) => {
        prev += cur[row];
        return prev;
      }, 0);
      sl = sum;
    }
    return sl;
  }

  deleteRow(item: any) {
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
          let result = this.dataTableReq.find(data => data.id == item.id);
          if (result) {
            let idx = this.dataTableReq.indexOf(result);
            this.dataTableReq.splice(idx, 1);
            this.dataTable = this.convertListData(this.dataTableReq);
            this.expandAll(this.dataTable);
            // let itemSelected = this.listDx.filter(item => item.selected == true);
            // if (itemSelected && itemSelected.length > 0) {
            //   itemSelected[0].selected = false;
            //   this.selectRow(itemSelected[0]);
            this.notification.success(MESSAGE.SUCCESS, 'Xóa thành công');
            // }
          } else {
            this.notification.error(MESSAGE.ERROR, 'Xóa thất bại');
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateItemDetail(data: any, type: string, idx: number, list?: any) {
    if (!this.isViewDetail) {
      let modalQD = this.modal.create({
        nzTitle: 'Chỉnh sửa kế hoạch, danh mục chi tiết',
        nzContent: DialogThemMoiKehoachDanhmucChitietComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1000px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          listDmSuaChua: this.listDmSuaChua,
          dataHeader: this.formData.value,
        },
      });
      modalQD.afterClose.subscribe(async (detail) => {
        if (detail) {
          if (!data.dataChild) {
            data.dataChild = [];
          }
          if (!data.idVirtual) {
            data.idVirtual = uuidv4();
          }
          if (list) {
            Object.assign(list[idx], detail);
          }
          this.expandAll(this.dataTable);
        }
      });
    }
  }

}
