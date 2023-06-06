import {Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers, ViewChild} from '@angular/core';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import * as dayjs from 'dayjs';
import {UserLogin} from 'src/app/models/userlogin';
import {Globals} from 'src/app/shared/globals';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {HelperService} from 'src/app/services/helper.service';
import {UserService} from 'src/app/services/user.service';
import {QuyetDinhBtcTcdtService} from 'src/app/services/quyetDinhBtcTcdt.service';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {KeHoachNhapXuatLtComponent} from './ke-hoach-nhap-xuat-lt/ke-hoach-nhap-xuat-lt.component';
import {STATUS} from "../../../../../../../constants/status";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {QuyetDinhTtcpService} from "../../../../../../../services/quyetDinhTtcp.service";
import {chain, cloneDeep} from 'lodash';

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
  dataQdTtcpGiaoBTC: any;
  taiLieuDinhKemList: any[] = [];
  listCcPhapLy: any[] = [];
  dsNam: any[] = [];
  listFile: any[] = []
  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any = []
  yearSelected: number;
  dataTable: any[] = [];
  dsHangHoa: any[] = [];
  iterableDiffer: any;
  STATUS = STATUS;

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
    private quyetDinhTtcpService: QuyetDinhTtcpService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: [STATUS.DANG_NHAP_DU_LIEU],
        ghiChu: ['']
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin(),
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.loadDsNam(),
        // this.maQd = '/' + this.userInfo.MA_QD,
        this.getDataDetail(this.idInput),
        this.loadDanhMucHang(),
      ])
    if (this.idInput == 0) {
      await this.loadQdTtcpGiaoBoNganh(dayjs().get('year'))
    }
    await this.spinner.hide();
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => (item.ma == "02" || item.ma == "04"));
        dataVatTu.forEach(item => {
          this.dsHangHoa = [...this.dsHangHoa, ...item.child]
        })
      }
    })
  }

  async loadQdTtcpGiaoBoNganh(nam) {
    const res = await this.quyetDinhTtcpService.chiTietTheoNam(nam);
    if (res.msg == MESSAGE.SUCCESS) {
      // lấy chỉ tiêu ttcp giao bộ tài chính : maBoNganh = 01
      this.dataQdTtcpGiaoBTC = res.data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
      this.muaTangList = cloneDeep(this.dataQdTtcpGiaoBTC?.muaTangList ? this.dataQdTtcpGiaoBTC.muaTangList : []);
      this.xuatGiamList = cloneDeep(this.dataQdTtcpGiaoBTC?.xuatGiamList ? this.dataQdTtcpGiaoBTC.xuatGiamList : []);
      this.xuatBanList = cloneDeep(this.dataQdTtcpGiaoBTC?.xuatBanList ? this.dataQdTtcpGiaoBTC.xuatBanList : []);
      this.luanPhienList = cloneDeep(this.dataQdTtcpGiaoBTC?.luanPhienList ? this.dataQdTtcpGiaoBTC.luanPhienList : []);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcTcdtService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
        ghiChu: data.ghiChu
      })
      // this.taiLieuDinhKemList = data.fileDinhkems;
      data.fileDinhkems.forEach(item => {
        if (item.fileType == FILETYPE.FILE_DINH_KEM) {
          this.taiLieuDinhKemList.push(item)
        } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
          this.listCcPhapLy.push(item)
        }
      })
      this.keHoachNhapXuat = data.keHoachNhapXuat;
      this.muaTangList = data.muaTangList;
      this.xuatGiamList = data.xuatGiamList;
      this.xuatBanList = data.xuatBanList;
      this.luanPhienList = data.luanPhienList;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
  }

  changeNam() {
    this.yearSelected = this.formData.get('namQd').value;
    if (!this.idInput) {
      this.loadQdTtcpGiaoBoNganh(this.yearSelected);
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

  downloadFileKeHoach(event) {
  }

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
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
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

  async save(isGuiDuyet?) {
    this.keHoachNhapXuatLtComponent.emitData();
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    this.listFile = [];
    if (this.taiLieuDinhKemList.length > 0) {
      this.taiLieuDinhKemList.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      body.fileDinhKems = this.listFile;
    }
    body.soQd = body.soQd + this.maQd;
    // body.muaTangList = this.muaTangList;
    // body.xuatGiamList = this.xuatGiamList;
    // body.xuatBanList = this.xuatBanList;
    // body.luanPhienList = this.luanPhienList;
    body.muaTangList = this.conVertTreeToList(this.muaTangList);
    body.xuatGiamList = this.conVertTreeToList(this.xuatGiamList);
    body.xuatBanList = this.conVertTreeToList(this.xuatBanList);
    body.luanPhienList = this.conVertTreeToList(this.luanPhienList);
    body.keHoachNhapXuat = this.keHoachNhapXuat;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhBtcTcdtService.update(body);
    } else {
      res = await this.quyetDinhBtcTcdtService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.formData.patchValue({
          id: res.data.id
        })
        // this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  conVertTreeToList(data) {
    let arr = [];
    data.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data);
        });
      } else {
        arr.push(item);
      }
    });
    return arr;
  }

  exportData() {
  }

  xoaKeHoach() {
  }

  themKeHoach() {
  }
}


