import { Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers, ViewChild } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { Globals } from 'src/app/shared/globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { QuyetDinhBtcTcdtService } from 'src/app/services/quyetDinhBtcTcdt.service';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { KeHoachNhapXuatLtComponent } from './ke-hoach-nhap-xuat-lt/ke-hoach-nhap-xuat-lt.component';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-tcdt',
  templateUrl: './them-quyet-dinh-btc-giao-tcdt.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-tcdt.component.scss'],
})
export class ThemQuyetDinhBtcGiaoTcdtComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  @ViewChild('nhapXuatLt') keHoachNhapXuatLtComponent: KeHoachNhapXuatLtComponent;


  userInfo: UserLogin;
  formData: FormGroup;
  maQd: string = '/QĐ-BTC'

  keHoachNhapXuat: any = {
    soLuongMuaThoc: 0,
    donGiaMuaThoc: 0,
    soLuongMuaGaoLpdh: 0,
    donGiaMuaGaoLqdh: 0,
    soLuongMuaGaoXcht: 0,
    donGiaMuaGaoXcht: 0,
    soLuongBanThoc: 0,
    donGiaBanThoc: 0,
    soLuongBanGao: 0,
    donGiaBanGao: 0,
    soLuongGaoCtro: 0,
    donGiaGaoCtro: 0,
    tongTienVonNsnn: 0,
    tongTienVonTx: 0,
  }

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];

  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any = []

  dataTable: any[] = [];
  dsHangHoa: any[] = [];
  iterableDiffer: any;
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhBtcTcdtService: QuyetDinhBtcTcdtService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private danhMucService: DanhMucService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.maQd = '/' + this.userInfo.MA_QD,
      this.getDataDetail(this.idInput),
      this.loadDanhMucHang()
    ])
    this.spinner.hide();
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        this.dsHangHoa = dataVatTu[0].child;
      }
    })
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcTcdtService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu
      })
      this.taiLieuDinhKemList = data.fileDinhkems;
      this.keHoachNhapXuat = data.keHoachNhapXuat;
      this.muaTangList = data.muaTangList;
      this.xuatGiamList = data.xuatGiamList;
      this.xuatBanList = data.xuatBanList;
      this.luanPhienList = data.luanPhienList;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) { }

  quayLai() {
    this.onClose.emit();
  }

  pheDuyet() {
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
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '11',
          };
          let res =
            await this.quyetDinhBtcTcdtService.approve(
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

  async save() {
    this.keHoachNhapXuatLtComponent.emitData();

    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.soQd = body.soQd + this.maQd;
    body.muaTangList = this.muaTangList;
    body.xuatGiamList = this.xuatGiamList;
    body.xuatBanList = this.xuatBanList;
    body.luanPhienList = this.luanPhienList;
    body.keHoachNhapXuat = this.keHoachNhapXuat;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhBtcTcdtService.update(body);
    } else {
      res = await this.quyetDinhBtcTcdtService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  exportData() { }

  xoaKeHoach() { }

  themKeHoach() { }
}


