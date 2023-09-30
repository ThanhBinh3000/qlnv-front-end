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
      idDiaDiemXh : ['',[Validators.required]],
      maDiaDiem : ['',[Validators.required]],
      maDiemKho: ['',[Validators.required]],
      tenDiemKho: ['',[Validators.required]],
      maNhaKho: ['',[Validators.required]],
      tenNhaKho: ['',[Validators.required]],
      maNganKho: ['',[Validators.required]],
      tenNganKho: ['',[Validators.required]],
      maLoKho: ['',[Validators.required]],
      tenLoKho: ['',[Validators.required]],
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
      console.log(this.phanLoai)
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
      this.formData.patchValue({
        idQdXh : '1',
        soQdXh : '1/QD',
        maDiemKho : '0101020101',
        tenDiemKho : 'Điểm kho Phủ Đức',
        maNhaKho : '010102010101',
        tenNhaKho : 'Nhà kho A1',
        maNganKho : '01010201010101',
        tenNganKho : 'Ngăn kho A1/1',
        maLoKho : '0101020101010104',
        tenLoKho : 'Lô kho mới 01',
        maDiaDiem : '0101020101010104',
        idDiaDiemXh : '1',
        loaiVthh : '0101',
        tenLoaiVthh : 'Thóc tẻ',
        cloaiVthh : '010101',
        tenCloaiVthh : 'Thóc tẻ hạt rất dài'
      })
    }else{
      await this.userService.getId("XH_TL_BB_LAY_MAU_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBienBan: res + '/' + this.formData.value.nam + '/BBNĐK',
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          tenKtv: this.userInfo.TEN_DAY_DU
        })
        this.formData.patchValue({
          idQdXh : '1',
          soQdXh : '1/QD',
          maDiemKho : '0101020101',
          tenDiemKho : 'Điểm kho Phủ Đức',
          maNhaKho : '010102010101',
          tenNhaKho : 'Nhà kho A1',
          maNganKho : '01010201010101',
          tenNganKho : 'Ngăn kho A1/1',
          maLoKho : '0101020101010104',
          tenLoKho : 'Lô kho mới 01',
          maDiaDiem : '0101020101010104',
          idDiaDiemXh : '1',
          loaiVthh : '0101',
          tenLoaiVthh : 'Thóc tẻ',
          cloaiVthh : '010101',
          tenCloaiVthh : 'Thóc tẻ hạt rất dài'
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

  }

  openDialogDdiemNhapHang(){

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
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC) && this.userService.isAccessPermisson('SCHDTQG_KTCL_THEM');
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
        msgSuceess = 'Gửi duyệt thành công'
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
