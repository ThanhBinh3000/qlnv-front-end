import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThongTinQuyetDinh } from '../../../../../../models/DeXuatKeHoachuaChonNhaThau';
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
import { KtQdXdHangNamService } from '../../../../../../services/kt-qd-xd-hang-nam.service';
import { KtTongHopXdHnService } from '../../../../../../services/kt-tong-hop-xd-hn.service';
import {
  DialogThemMoiDxkhthComponent,
} from '../../../ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component';


@Component({
  selector: 'app-them-moi-qd-pd-dx-nhu-cau',
  templateUrl: './them-moi-qd-pd-dx-nhu-cau.component.html',
  styleUrls: ['./them-moi-qd-pd-dx-nhu-cau.component.scss'],
})
export class ThemMoiQdPdDxNhuCauComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input() idTongHop: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  maQd: string;
  listDx: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  expandSet = new Set<number>();
  listToTrinh: any[] = [];
  listQdBtc: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  fileDinhKems: any[] = [];
  canCuPhapLys: any[] = [];
  listNam: any[] = [];
  userInfo: UserLogin;

  STATUS = STATUS;
  isEdit: string = '';
  vonDauTu: number;


  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxXdTh: KtTongHopXdHnService,
    private quyetDinhService: KtQdXdHangNamService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      loaiLan: ['1'],
      soLanDieuChinh: [],
      soQdCanDieuChinh: [],
      qdCanDieuChinhId: [],
      namKeHoach: [dayjs().get('year')],
      soQuyetDinh: [null],
      ngayTrinhBtc: [null],
      ngayKyBtc: [null],
      ngayHieuLuc: [null],
      noiDung: [null],
      phuongAnTc: [null, Validators.required],
      namBatDau: [null],
      namKetThuc: [null],
      loaiDuAn: [null],
      trichYeu: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['ĐANG NHẬP DỮ LIỆU'],
    });
  }

  async getListTt() {
    let result = await this.quyetDinhService.getListToTrinh();
    if (result.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = result.data;
    }
  }
  async getListQdBtc() {
    let body ={
      trangThai:"29",
      maDvi: this.userInfo.MA_DVI,
      namKeHoach: this.formData.value.namKeHoach
    };
    let result = await this.quyetDinhService.danhSach(body);
    if (result.msg == MESSAGE.SUCCESS) {
      this.listQdBtc = result.data;
    }
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC';
    this.loadDsNam();
    await this.getDetail(this.idInput);
    if (this.idTongHop && this.idTongHop > 0) {
      await this.loadDsChiTiet(this.idTongHop);
    }
  }

  async getDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        loaiLan: data.loaiLan,
        soLanDieuChinh: data.soLanDieuChinh,
        soQdCanDieuChinh: data.soQdCanDieuChinh,
        qdCanDieuChinhId: data.qdCanDieuChinhId,
        phuongAnTc: data.phuongAnTc,
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split('/')[0] : null,
        ngayTrinhBtc: data.ngayTrinhBtc,
        ngayKyBtc: data.ngayKyBtc,
        ngayHieuLuc: data.ngayKyBtc,
        trichYeu: data.trichYeu,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        loaiDuAn: data.loaiDuAn,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
        noiDung: data.noiDung
      });
      this.fileDinhKems = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
      let listDx = data.ctRes;
      if (listDx) {
        this.dataTableReq = listDx.ctietList;
        this.dataTable = this.convertListData(this.dataTableReq);
        this.expandAll(this.dataTable);
        // this.listDx = listDx.dtlList;
        // if (this.listDx && this.listDx.length > 0) {
        //   this.selectRow(this.listDx[0]);
        // }
      }
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
    this.formData.controls['soQuyetDinh'].setValidators([Validators.required]);
    this.formData.controls['phuongAnTc'].setValidators([Validators.required]);
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
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.ctiets = this.dataTableReq;
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
    this.formData.controls['ngayKyBtc'].setValidators([Validators.required]);
    this.formData.controls['namKeHoach'].setValidators([Validators.required]);
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

  async openDialogToTrinh() {
    if (!this.isViewDetail) {
      await this.getListTt();
      const modal = this.modal.create({
        nzTitle: 'Danh sách Phương án của Tổng cục',
        nzContent: DialogQdXdTrungHanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          type: 'QDTH',
          dsPhuongAn: this.listToTrinh,
        },
      });
      modal.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            phuongAnTc: data.soQuyetDinh,
          });
          await this.loadDsChiTiet(data.id);
        }
      });
    }
  }

  async loadDsChiTiet(id: number) {
    let res = await this.tongHopDxXdTh.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      let detailTh = res.data;
      // this.listDx = detailTh.listDx.dtlList;
      this.dataTableReq = detailTh.listDx.ctietList;
      this.dataTable = this.convertListData(this.dataTableReq);
      this.expandAll(this.dataTable);
      // if (this.listDx.length > 0) {
      //   this.selectRow(this.listDx[0]);
      // }
    }
    if (this.idTongHop && this.idTongHop > 0) {
      this.formData.patchValue({
        phuongAnTc: res.data.soQuyetDinh,
      });
    }
  }
  async loadDsChiTietQdCanDieuChinh(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        phuongAnTc: data.phuongAnTc,
        soQdCanDieuChinh: data.soQuyetDinh ? data.soQuyetDinh.split('/')[0] : null,
        qdCanDieuChinhId: id,
        soLanDieuChinh: data.soLanDieuChinh ? data.soLanDieuChinh + 1 : 1,
        trichYeu: data.trichYeu,
        loaiDuAn: data.loaiDuAn,
        noiDung: data.noiDung
      });
      this.fileDinhKems = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
      let listDx = data.ctRes;
      if (listDx) {
        listDx.ctietList.forEach(item =>{
          item.id = undefined;
          item.isDieuChinh = false;
        });
        this.dataTableReq = listDx.ctietList;
        this.dataTable = this.convertListData(this.dataTableReq);
        this.expandAll(this.dataTable);
        // this.listDx = listDx.dtlList;
        // if (this.listDx && this.listDx.length > 0) {
        //   this.selectRow(this.listDx[0]);
        // }
      }
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
      this.dataTable = this.dataTableReq.filter(data => data.soCv == item.soCongVan);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => {
          item.tgKcHt = item.tgKhoiCong + " - " + item.tgHoanThanh;
        });
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
                  .groupBy('tenKhoi')
                  .map((v1, k1) => {
                      return {
                        idVirtual: uuidv4(),
                        tenKhoi: k1,
                        dataChild: v1,
                        khoi: v1 && v1[0] && v1[0].khoi ? v1[0].khoi : null,
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
    // if (table && table.length > 0) {
    //   table = chain(table)
    //     .groupBy('tenChiCuc')
    //     .map((value, key) => {
    //       let rs = chain(value)
    //         .groupBy('tenKhoi')
    //         .map((v, k) => {
    //             return {
    //               idVirtual: uuidv4(),
    //               tenKhoi: k,
    //               dataChild: v,
    //               khoi: v && v[0] && v[0].khoi ? v[0].khoi : null,
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
    return table;
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

  themMoiItem(type: string, data: any, idx : number, list: any) {
    let modalQD = this.modal.create({
      nzTitle: 'Chỉnh sửa chi tiết kế hoạch',
      nzContent: DialogThemMoiDxkhthComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzStyle: { top: '200px' },
      nzFooter: null,
      nzComponentParams: {
        dataInput: data,
        type: type,
        page: 'DXTH',
      },
    });
    modalQD.afterClose.subscribe(async (detail) => {
      if (detail && list) {
        if(this.formData.value.loaiLan == '2'){
          detail.isDieuChinh = true;
        }
        Object.assign(list[idx], detail);
      }
    });
  }

  checkDisableLoaiLan() {
    if(this.formData.value.soQdCanDieuChinh || this.formData.value.id){
      return true;
    }
    return false;
  }

  changeLoaiLan($event: any) {

  }

  async openDialogQdCanDieuChinh() {
    if (!this.isViewDetail) {
      await this.getListQdBtc();
      const modal = this.modal.create({
        nzTitle: 'Danh sách Quyết định BTC',
        nzContent: DialogQdXdTrungHanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          type: 'QDBTC',
          dsPhuongAn: this.listQdBtc,
        },
      });
      modal.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            phuongAnTc: data.soQuyetDinh,
          });
          await this.loadDsChiTietQdCanDieuChinh(data.id);
        }
      });
    }
  }
}



