import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { Validators } from "@angular/forms";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { MESSAGE } from "../../../../../constants/message";
import { STATUS } from "../../../../../constants/status";
import dayjs from "dayjs";
import { DialogMmMuaSamComponent } from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import { QuyetDinhMuaSamService } from "../../../../../services/quyet-dinh-mua-sam.service";
import { chain } from 'lodash';
import * as uuid from "uuid";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { HopDongMmTbcdService } from "../../../../../services/hop-dong-mm-tbcd.service";

@Component({
  selector: 'app-mm-thong-tin-hop-dong',
  templateUrl: './mm-thong-tin-hop-dong.component.html',
  styleUrls: ['./mm-thong-tin-hop-dong.component.scss']
})
export class MmThongTinHopDongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  idPhuLuc: number;
  isViewPl: boolean
  isViewHd: boolean = false;
  listTongHop: any[] = [];
  listTongHopCopy: any[] = [];
  listLoaiHd: any[] = [];
  listHangHoa: any[] = [];
  listPhuLuc: any[] = [];
  listDiaDiem: any[] = [];
  maQd: string
  rowItem: MmHopDongCt = new MmHopDongCt();
  dataEdit: { [key: string]: { edit: boolean; data: MmHopDongCt } } = {};
  expandSetString = new Set<string>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongService: HopDongMmTbcdService,
    private qdMuaSamService: QuyetDinhMuaSamService,
    private dmService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      // hdr
      id: [null],
      maDvi: [null],
      capDvi: [null],
      namHopDong: [dayjs().get('year'), Validators.required],
      soQdpdKhMuaSam: [null, Validators.required],
      soHopDong: [null, Validators.required],
      tenHopDong: [null, Validators.required],
      ngayKy: [null, Validators.required],
      loaiHopDong: [null, Validators.required],
      thoiGianThucHien: [null, Validators.required],
      giaTri: [null],
      // ben mua
      muaTenDvi: [null],
      muaDiaChi: [null],
      muaMst: [null],
      muaTenNguoiDaiDien: [null],
      muaChucVu: [null],
      muaSdt: [null],
      muaStk: [null],
      // ben ban
      banTenDvi: [null, Validators.required],
      banDiaChi: [null],
      banMst: [null],
      banTenNguoiDaiDien: [null],
      banChucVu: [null],
      banSdt: [null],
      banStk: [null],
      //
      ghiChu: [null],
      // phu luc
      hdHdrId: [null],
      veViec: [null],
      soPhuLuc: [null],
      listFileDinhKems: [null],
      listQlDinhMucHdLoaiHh: [null],
      listPhuLuc: [null],
      listQlDinhMucHdDiaDiemNh: [null],
      trangThai: ['00'],
      loai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
  }

  goBackPl(event) {
    this.isViewHd = false;
    if (event) {
      this.detail(this.id)
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      let namHd = this.formData.value.namHopDong;
      this.maQd = `/${namHd}/VP-BĐ-NM`;
      this.loadDsDxCc();
      this.loadDsLoaiHd();
      if (this.id > 0) {
        this.detail(this.id);
      } else {
        this.initForm()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsLoaiHd() {
    let res = await this.dmService.danhMucChungGetAll("HINH_THUC_HOP_DONG");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHd = res.data
    }
  }

  initForm() {
    this.formData.patchValue({
      muaTenDvi: this.userInfo.TEN_DVI,
      muaDiaChi: this.userInfo.DON_VI.diaChi
    })
  }


  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "loai": "00",
        "paggingReq": {
          "limit": 10,
          "page": 0
        },
        "capDvi": this.userInfo.CAP_DVI,
        "maDvi": this.userInfo.MA_DVI,
      }
      let res = await this.qdMuaSamService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.content && data.content.length > 0) {
          this.listTongHop = data.content.filter(item => item.trangThai == this.STATUS.BAN_HANH);
          this.listTongHopCopy = data.content.filter(item => item.trangThai == this.STATUS.BAN_HANH);
        }
      } else {
        this.listTongHop = [];
        this.listTongHopCopy = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.convertListDiaDiem()
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.listFileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucHdLoaiHh = this.dataTable;
    this.formData.value.giaTri = this.calcTong();
    this.formData.value.maDvi = this.userInfo.MA_DVI
    this.formData.value.capDvi = this.userInfo.CAP_DVI
    this.formData.value.soHopDong = this.formData.value.soHopDong + this.maQd
    this.formData.value.listQlDinhMucHdDiaDiemNh = this.listDiaDiem
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    if (data) {
      this.goBack()
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.hopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.changeSoQdMs(data.soQdpdKhMuaSam);
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soHopDong: this.formData.value.soHopDong ? this.formData.value.soHopDong.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucHdLoaiHh;
          this.listPhuLuc = data.listPhuLuc
          this.listDiaDiem = data.listQlDinhMucHdDiaDiemNh;
          this.buildDiaDiemTc()
          this.updateEditCache()
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
        this.spinner.hide();
        return;
      }
      this.convertListDiaDiem()
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.listFileDinhKems = this.fileDinhKem;
      }
      this.formData.value.listQlDinhMucHdLoaiHh = this.dataTable;
      this.formData.value.giaTri = this.calcTong();
      this.formData.value.maDvi = this.userInfo.MA_DVI
      this.formData.value.capDvi = this.userInfo.CAP_DVI
      this.formData.value.soHopDong = this.formData.value.soHopDong + this.maQd
      this.formData.value.listQlDinhMucHdDiaDiemNh = this.listDiaDiem
      let body = this.formData.value;
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }


  async daKy() {
    await this.approve(this.id, STATUS.DA_KY, 'Bạn có chắc chắn muốn ký?')
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    let arr = [...this.dataTable, this.rowItem].map(value => value.maHangHoa)
    let res = await this.loadDsHangHoa(this.formData.value.soQdpdKhMuaSam, arr)
    if (res) {
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = new MmHopDongCt();
      this.updateEditCache();
    } else {
      this.notification.error(MESSAGE.ERROR, "Không tìm thấy thông tin phân bổ của hàng hóa! ");
      this.spinner.hide();
      return;
    }
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maHangHoa == item.maHangHoa) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmHopDongCt) {
    let msgRequired = '';
    //validator
    if (!item.maHangHoa) {
      msgRequired = "Mục loại hàng hóa không được để trống";
    } else if (!item.soLuong) {
      msgRequired = "Mục số lượng không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmHopDongCt();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.thanhTien = this.dataEdit[idx].data.donGia * this.dataEdit[idx].data.soLuong
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async chonMaTongHop() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH MUA SẮM',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listTongHopCopy,
          type: "01"
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.listDiaDiem = [];
          this.listHangHoa = [];
          this.dataTable = [];
          this.formData.patchValue({
            soQdpdKhMuaSam: data.soQd
          })
          await this.changeSoQdMs(data.soQd)
        }
      })
    }
  }

  async changeSoQdMs(soQd: string) {
    let res = this.listTongHop.filter(item => item.soQd == soQd)
    if (res && res.length > 0) {
      let detailMs = await this.qdMuaSamService.getDetail(res[0].id)
      if (detailMs.msg == MESSAGE.SUCCESS) {
        let datams = detailMs.data
        if (datams && datams.listQlDinhMucQdMuaSamDtl) {
          this.listHangHoa = datams.listQlDinhMucQdMuaSamDtl
          this.convertListData()
        }
      }
    }
  }

  async loadDsHangHoa(soQdMs: string, tableHangHoa: any[]): Promise<boolean> {
    let check = true
    let body = {
      soQdMs: soQdMs,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      loai: '01',
      trangThai: STATUS.DA_KY
    }
    let res = await this.qdMuaSamService.listTtPbo(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.listDiaDiem = res.data
        if (this.userService.isCuc()) {
          this.listDiaDiem = this.listDiaDiem.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI))
        }
        this.listDiaDiem = res.data.filter(item => tableHangHoa.includes(item.maTaiSan))
        this.buildDiaDiemTc()
        return check
      } else {
        if (!this.listDiaDiem) {
          check = false
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy thông tin phân bổ!')
          return check;
        }
      }
    } else {
      check = false
      this.notification.error(MESSAGE.ERROR, 'Vui lòng phân bổ hàng hóa trước!!!!')
      return check;
    }
  }

  redirectToPhuLuc(isView: boolean, id: number) {
    this.idPhuLuc = id;
    this.isViewHd = true;
    this.isViewPl = isView;
  }

  convertListData() {
    if (this.listHangHoa && this.listHangHoa.length > 0) {
      this.listHangHoa = chain(this.listHangHoa).groupBy('tenTaiSan').map((value, key) => ({
        tenTaiSan: key,
        dataChild: value
      })
      ).value()
    }
    if (this.listHangHoa && this.listHangHoa.length > 0) {
      this.listHangHoa.forEach(item => {
        item.soLuong = 0
        item.thanhTien = 0
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            item.tenHangHoa = item.tenTaiSan
            item.donViTinh = data.donViTinh
            item.donGia = data.donGiaTd
            item.soLuong = item.soLuong + data.soLuongTc
            item.maHangHoa = data.maTaiSan
          })
        }
      })
    }
  }

  convertListDiaDiem() {
    let arr = [];
    if (this.listDiaDiem && this.listDiaDiem.length > 0) {
      this.listDiaDiem.forEach(item => {
        if (item.childData && item.childData.length > 0) {
          item.childData.forEach(data => {
            if (data.childData && data.childData.length > 0) {
              data.childData.forEach(dtl => {
                arr.push(dtl)
              })
            }
          })
        }
      })
      this.listDiaDiem = arr
    }
  }

  buildDiaDiemTc() {
    if (this.listDiaDiem && this.listDiaDiem.length > 0) {
      this.listDiaDiem = chain(this.listDiaDiem)
        .groupBy("tenTaiSan")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenDviCha")
            .map((v, k) => {
              return {
                idVirtual: uuid.v4(),
                tenDviCha: k,
                childData: v
              }
            }
            ).value();
          return {
            idVirtual: uuid.v4(),
            tenTaiSan: key,
            childData: rs
          };
        }).value();
    }
    this.expandAll()
  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong * cur.donGia;
        return prev;
      }, 0);
      return sum;
    }
  }

  changHangHoa(event) {
    let result = this.listHangHoa.filter(item => item.maHangHoa === event)
    if (result && result.length > 0) {
      this.rowItem.tenHangHoa = result[0].tenHangHoa;
      this.rowItem.donViTinh = result[0].donViTinh;
      this.rowItem.soLuong = result[0].soLuong;
      this.rowItem.donGia = result[0].donGia;
    }
  }

  deleteDetail(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopDongService.delete(body).then(async () => {
            await this.detail(this.id);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  expandAll() {
    this.listDiaDiem.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      if (s.childData && s.childData.length > 0) {
        s.childData.forEach(item => {
          this.expandSetString.add(item.idVirtual);
        })
      }
    })
  }
}

export class MmHopDongCt {
  id: number;
  maHangHoa: string;
  tenHangHoa: string;
  soLuong: number = 0;
  donViTinh: string;
  donGia: number = 0;
  slMetQuyCuon?: number;
  slCuon?: number;
  thanhTien: number = 0;
}

export class MmHopDongDiaDiemCt {
  id: number;
  maTaiSan: string;
  tenTaiSan: string;
  maDvi: string;
  tenDvi: string;
  soLuong: number = 0;
  soLuongHoanThanh: number = 0;
  donViTinh: string;
  diaDiemGiaoNhan: string;
}
