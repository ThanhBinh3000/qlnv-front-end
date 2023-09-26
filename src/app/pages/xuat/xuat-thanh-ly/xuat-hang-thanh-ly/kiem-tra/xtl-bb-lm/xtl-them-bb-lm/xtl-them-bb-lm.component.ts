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
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: KiemTraChatLuongScService,
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
      soBienBan: [''],
      tenDvi: [''],
      maDvi: [''],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemGiaoNvNh: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      soQdGiaoNvNh: [''],
      ngayQdGiaoNvNh: [''],
      idQdGiaoNvNh: [''],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      dviKiemNghiem: [''],
      soBbNhapDayKho: [''],
      idBbNhapDayKho: [''],
      diaDiemLayMau: [''],

      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [''],
      tenNguoiTao: [''],
      soBbGuiHang: [''],
      idBbGuiHang: [''],
      dviCungCap: [''],
      ngayNhapDayKho: [''],
      tenNganLoKho: [''],
      tenNguoiPduyet: [''],
      truongBpKtbq: [''],
      dvt: [''],
    });
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
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

    }else{
      await this.userService.getId("SC_BIEN_BAN_KT_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBienBan: res + '/' + this.formData.value.nam + '/BBNĐK',
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLap: dayjs().format('YYYY-MM-DD'),
          ngayKetThuc: dayjs().format('YYYY-MM-DD'),
          tenThuKho: this.userInfo.TEN_DAY_DU
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

  async getDanhMucTieuChuan(cloaiVthh) {
    let dmTieuChuan = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
    if (dmTieuChuan.data) {
      this.dataTable = dmTieuChuan.data;
      console.log(this.dataTable);
    }
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
      nzContent: 'Bạn có chắc chắn muốn xóa?',
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

}
