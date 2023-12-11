import { Component, OnInit } from '@angular/core';
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {MESSAGE} from "../../../../../../../constants/message";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../../constants/status";
import { cloneDeep } from 'lodash';
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {Validators} from "@angular/forms";
import {
  BienBanLayMauThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanLayMauThanhLy.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";

@Component({
  selector: 'app-xtl-them-bb-lm',
  templateUrl: './xtl-them-bb-lm.component.html',
  styleUrls: ['./xtl-them-bb-lm.component.scss']
})
export class XtlThemBbLmComponent extends Base3Component implements OnInit {

  listBienBan : any[]

  itemRow :any = {}

  listDaiDien : any[];

  ppLayMau : any[];

  chiTieuChatLuong : any[];

  fileCanCu : any[]
  phanLoai : string;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: BienBanLayMauThanhLyService,
    private danhMucService : DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private quyetDinhGiaoNhiemVuThanhLyService : QuyetDinhGiaoNhiemVuThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: ['LBGM'],
      nam: [dayjs().get('year')],
      tenDvi: ['',[Validators.required]],
      maQhns: [''],
      soBienBan: ['',[Validators.required]],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      idQdXh: ['',[Validators.required]],
      soQdXh: ['',[Validators.required]],
      dviKnghiem: ['',[Validators.required]],
      diaDiemLayMau: ['',[Validators.required]],
      idDsHdr : ['',[Validators.required]],
      maDiaDiem : ['',[Validators.required]],
      tenDiemKho: ['',[Validators.required]],
      tenNhaKho: ['',[Validators.required]],
      tenNganKho: ['',[Validators.required]],
      tenLoKho: ['',],
      loaiVthh: ['',[Validators.required]],
      tenLoaiVthh: ['',[Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      idThuKho : [],
      tenThuKho : [],
      tenKtv : [],
      truongBpKtbq : ['',[Validators.required]],
      tenLdcc : [],
      soLuongMau : ['',[Validators.required]],
      ketQuaNiemPhong : [],
      ghiChu : [],
    });
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.phanLoai = urlList[4] == 'kiem-tra-lt' ? 'LT' : 'VT'
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bb-lm';
    });
    this.listDaiDien =
      [
        {
          value : 'CUC',
          label : 'Đại diện Cục DTNN KV'
        },
        {
          value : 'CHI_CUC',
          label : 'Đại diện Chi cục DTNN KV'
        }
      ]
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.loadDanhMuc(),
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm(){
    if(this.id){
      const data = await this.detail(this.id);
      console.log(data)
      this.dataTable = data.children;
    }else{
      await this.userService.getId("XH_TL_BB_LAY_MAU_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBienBan: res + '/' + this.formData.value.nam + '/BBNĐK',
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          tenKtv: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  async loadDanhMuc() {
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
    await this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.ppLayMau = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  openDialogSoQd(){
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    let body = {
      trangThai : STATUS.BAN_HANH,
      nam : this.formData.value.nam,
      phanLoai : this.phanLoai
    }
    this.quyetDinhGiaoNhiemVuThanhLyService.getAll(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng'],
            dataColumn: ['soBbQd']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.formData.patchValue({
              idQdXh : data.id,
              soQdXh : data.soBbQd,
            })
          }
        });
      }
    })
  }

  openDialogDdiemNhapHang(){
    if (this.disabled()) {
      return;
    }
    if(!this.formData.value.idQdXh){
      this.notification.info(MESSAGE.NOTIFICATION,"Vui lòng chọn Số QĐ giao nhiệm vụ xuất hàng");
      return;
    }
    this.spinner.show();
    let dataDiemKho = [];
    this.quyetDinhGiaoNhiemVuThanhLyService.getDetail(this.formData.value.idQdXh).then((res) => {
      this.spinner.hide();
      if (res.data) {
        console.log(res.data);
        res.data.children.forEach( item => {
          if(item.phanLoai == this.phanLoai){
             dataDiemKho.push(item.xhTlDanhSachHdr);
          }
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: dataDiemKho,
            dataHeader: ['Lô kho','Ngăn kho','Nhà kho','Điểm kho','Loại hàng DTQG','Chủng loại hàng DTQG'],
            dataColumn: ['tenLoKho','tenNganKho','tenNhaKho','tenDiemKho','tenLoaiVthh','tenCloaiVthh']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            console.log(data);
            this.formData.patchValue({
              maDiaDiem : data.maDiaDiem,
              tenDiemKho : data.tenDiemKho,
              tenNhaKho : data.tenNhaKho,
              tenNganKho : data.tenNganKho,
              maLoKho : data.maLoKho,
              tenLoKho : data.tenLoKho,
              idDsHdr : data.id,
              loaiVthh : data.loaiVthh,
              tenLoaiVthh : data.tenLoaiVthh,
              cloaiVthh : data.cloaiVthh,
              tenCloaiVthh : data.tenCloaiVthh
            });
            this.loadChiTieuChatLuong(data.loaiVthh);
          }
        });
      }
    })
  }

  async loadChiTieuChatLuong(cloaiVthh: string) {
    // if (cloaiVthh) {
    //   const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
    //   if (res?.msg === MESSAGE.SUCCESS) {
    //     this.chiTieuChatLuong = Array.isArray(res.data) ? res.data.map((f) => ({
    //       id: f.id, giaTri: (f.tenChiTieu || "") + " " + (f.mucYeuCauNhap || ""), checked: true
    //     })) : []
    //   }
    // }
  }

  addRow(){
    let item = cloneDeep(this.itemRow);
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.clearRow()
  }

  clearRow(){
    this.itemRow = {};
  }

  deleteRow(i){
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable = this.dataTable.filter((x, index) => index != i);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  disabled(){
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC);
  }

  showPheDuyetTuChoi(){
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isChiCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDCC )
    }
    return false
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.children = this.dataTable;
    body.dat = this.formData.value.dat == true || this.formData.value.dat == '1' ? 1 : 0;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    let msgConfirm;
    let msgSuceess;
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        msgConfirm = 'Bạn có muốn gửi duyệt ?'
        msgSuceess = 'Thao tác thành công'
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC:
        msgConfirm = 'Bạn có muốn phê duyệt ?'
        msgSuceess = 'Phê duyệt thành công'
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, msgConfirm, null,msgSuceess);
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

}
