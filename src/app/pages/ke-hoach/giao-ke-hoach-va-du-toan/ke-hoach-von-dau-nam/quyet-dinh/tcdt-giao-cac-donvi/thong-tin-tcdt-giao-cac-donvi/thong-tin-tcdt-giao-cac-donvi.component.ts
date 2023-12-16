import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Base2Component } from '../../../../../../../components/base2/base2.component';
import {
  KeHoachNhapXuatLtComponent
} from '../../btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt/ke-hoach-nhap-xuat-lt/ke-hoach-nhap-xuat-lt.component';
import { UserLogin } from '../../../../../../../models/userlogin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { chain, cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Globals } from '../../../../../../../shared/globals';
import { QuyetDinhBtcTcdtService } from '../../../../../../../services/quyetDinhBtcTcdt.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../../../../../../services/user.service';
import { HelperService } from '../../../../../../../services/helper.service';
import { DanhMucService } from '../../../../../../../services/danhmuc.service';
import { QuyetDinhTtcpService } from '../../../../../../../services/quyetDinhTtcp.service';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../services/storage.service';
import { QuyetDinhTCDTGiaoDonviService } from '../../../../../../../services/quyetDinhTCDTGiaoDonvi.service';
import { MESSAGE } from '../../../../../../../constants/message';
import { STATUS } from '../../../../../../../constants/status';
import { FILETYPE, PREVIEW } from '../../../../../../../constants/fileType';
import printJS from 'print-js';
import { KhVatTu } from '../../../../../../../models/KeHoachVatTu';
import { DonviService } from '../../../../../../../services/donvi.service';

@Component({
  selector: 'app-thong-tin-tcdt-giao-cac-donvi',
  templateUrl: './thong-tin-tcdt-giao-cac-donvi.component.html',
  styleUrls: ['./thong-tin-tcdt-giao-cac-donvi.component.scss']
})
export class ThongTinTcdtGiaoCacDonviComponent extends Base2Component implements OnInit {

  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  @ViewChild('nhapXuatLt') keHoachNhapXuatLtComponent: KeHoachNhapXuatLtComponent;
  userInfo: UserLogin;
  formData: FormGroup;
  maQd: string = '/QĐ-BTC';

  dataQdTtcpGiaoBTC: any;
  taiLieuDinhKemList: any[] = [];
  listCcPhapLy: any[] = [];
  dsNam: any[] = [];
  listFile: any[] = [];
  muaTangList: any[] = [];
  xuatGiamList: any[] = [];
  xuatBanList: any[] = [];
  luanPhienList: any = [];
  dataTable: any[] = [];
  dsHangHoa: any[] = [];
  STATUS = STATUS;
  chiTang: number = 0;
  options: any[] = [];
  optionsDonVi: any[] = [];
  xuatGiam: number = 0;
  xuatBan: number = 0;
  yearCurrentView: number = 0;
  dataVatTuXuatGiam :any[] = [];
  dataVatTuXuatBan :any[] = [];
  dataVatTuXuatLpdh :any[] = [];
  showDlgPreview = false;
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  reportTemplate: any = {
    typeFile: '',
    fileName: '',
    tenBaoCao: '',
    trangThai: '',
  };


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhTCDTGiaoDonviService: QuyetDinhTCDTGiaoDonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhTCDTGiaoDonviService);
    super.ngOnInit();
    this.initForm();
    this.filterTable = {};
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin(),
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        await this.loadDonVi(),
        this.loadDsNam(),
        this.getDataDetail(this.idInput),
        this.loadDanhMucHang(),
      ]);
    if (this.idInput) {
      // await this.loadQdTtcpGiaoBoNganh(dayjs().get('year'));
    }else {
      // this.initForm();
    }
    // this.sumAllDataTable();
    await this.spinner.hide();
  }

  initForm (){
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: [STATUS.DANG_NHAP_DU_LIEU],
        ghiChu: [''],
      },
    );
  }

  async loadDanhMucHang() {
    // await this.quyetDinhTCDTGiaoDonviService.loadDanhMucHangHoa().subscribe((hangHoa) => {
    //   if (hangHoa.msg == MESSAGE.SUCCESS) {
    //     const dataVatTu = hangHoa.data.filter(item => (item.ma == '02' || item.ma == '04'));
    //     dataVatTu.forEach(item => {
    //       this.dsHangHoa = [...this.dsHangHoa, ...item.child];
    //     });
    //   }
    // });
  }

  async loadQdTtcpGiaoBoNganh(nam) {
    const res = await this.quyetDinhTCDTGiaoDonviService.chiTietTheoNam(nam);
    if (res.msg == MESSAGE.SUCCESS) {
      // lấy chỉ tiêu ttcp giao bộ tài chính : maBoNganh = 01
      this.dataQdTtcpGiaoBTC = res.data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
      if (!this.yearCurrentView || (this.yearCurrentView && this.yearCurrentView != nam)) {
        this.muaTangList = this.dataQdTtcpGiaoBTC?.muaTangList ? cloneDeep(this.dataQdTtcpGiaoBTC.muaTangList) : [];
        this.xuatGiamList = this.dataQdTtcpGiaoBTC?.xuatGiamList ? cloneDeep(this.dataQdTtcpGiaoBTC.xuatGiamList) : [];
        this.xuatBanList = this.dataQdTtcpGiaoBTC?.xuatBanList ? cloneDeep(this.dataQdTtcpGiaoBTC.xuatBanList) : [];
        this.luanPhienList = this.dataQdTtcpGiaoBTC?.luanPhienList ? cloneDeep(this.dataQdTtcpGiaoBTC.luanPhienList) : [];
      }
      //Chi tăng,xuat giam, xuat ban vật tư ttcp giao bộ tài chính
      this.chiTang = res.data.listChiTangToanBoNganh.find(item => item.maBn == '01' && item.tenBn == 'Vật tư, thiết bị').tongSo;
      this.xuatBan = this.dataQdTtcpGiaoBTC.ttXuatBan;
      this.xuatGiam = this.dataQdTtcpGiaoBTC.ttXuatGiam;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhTCDTGiaoDonviService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.yearCurrentView = data.namQd;
        this.formData.patchValue({
          id: data.id,
          namQd: data.namQd,
          ngayQd: data.ngayQd,
          soQd: data.soQd.split('/')[0],
          trangThai: data.trangThai,
          trichYeu: data.trichYeu,
          ghiChu: data.ghiChu,
        });
        data.fileDinhkems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.taiLieuDinhKemList.push(item);
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCcPhapLy.push(item);
          }
        });
        // this.keHoachNhapXuat = data.keHoachNhapXuat;
        this.muaTangList = data.muaTangList;
        this.xuatGiamList = data.xuatGiamList;
        this.xuatBanList = data.xuatBanList;
        this.luanPhienList = data.luanPhienList;
      }else{
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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

  changeNam($event) {
    this.loadQdTtcpGiaoBoNganh($event);
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
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
            trangThai: STATUS.BAN_HANH,
          };
          let res =
            await this.quyetDinhTCDTGiaoDonviService.approve(
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
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFile.push(element);
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      body.fileDinhKems = this.listFile;
    }
    body.soQd = body.soQd + this.maQd;
    body.muaTangList = this.conVertTreeToList(this.muaTangList);
    body.xuatGiamList = this.conVertTreeToList(this.xuatGiamList);
    body.xuatBanList = this.conVertTreeToList(this.xuatBanList);
    body.luanPhienList = this.conVertTreeToList(this.luanPhienList);
    // body.keHoachNhapXuat = this.keHoachNhapXuat;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhTCDTGiaoDonviService.update(body);
    } else {
      res = await this.quyetDinhTCDTGiaoDonviService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai,
        });
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.idInput = res.data.id;
        this.formData.patchValue({
          id: res.data.id,
        });
        // this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  validKeHoachNhapXuatLT(dataNhapXuatLt) {
    let valid = true;
    let vonChi = 0;
    let vonCo = 0;
    if (dataNhapXuatLt) {
      if (dataNhapXuatLt.nhapCtMua) {
        vonChi = dataNhapXuatLt.tienMuaThoc + dataNhapXuatLt.tienMuaGaoXcht + dataNhapXuatLt.tienMuaGaoLpdh;
      } else {
        vonChi = dataNhapXuatLt.tienMuaThoc + dataNhapXuatLt.tongTienMuaGao;
      }
      if (dataNhapXuatLt.nhapCtBan) {
        vonCo = dataNhapXuatLt.tienBanThoc + dataNhapXuatLt.tienBanGao + dataNhapXuatLt.tienGaoCtro + dataNhapXuatLt.tongTienVonNsnn + dataNhapXuatLt.tongTienVonTx;
      } else {
        vonCo = dataNhapXuatLt.tongTienBan + dataNhapXuatLt.tienGaoCtro + dataNhapXuatLt.tongTienVonNsnn + dataNhapXuatLt.tongTienVonTx;
      }
      if (vonChi != vonCo) {
        valid = false;
      }
    }
    return valid;
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

  receivedData(data: any) {
    this.muaTangList = data;
    this.sumAllDataTable();
  }

  sumAllDataTable() {
    let ttVatTu = 0;
    let ttVatTuCn = 0;
    let ttMuoi = 0;
    this.muaTangList.forEach(item => {
      if (item && item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(child => {
          if (!child.loaiVthh.startsWith('04') && !child.loaiVthh.startsWith('03')) {
            ttVatTu += child.tongTien ? child.tongTien : 0;
          } else if (child.loaiVthh.startsWith('03')) {
            ttVatTu += child.tongTien ? child.tongTien : 0;
          } else {
            ttMuoi += child.tongTien ? child.tongTien : 0;
          }
        });
      } else {
        if (!item.loaiVthh.startsWith('04') && !item.loaiVthh.startsWith('03')) {
          ttVatTu += item.tongTien ? item.tongTien : 0;
        } else if (item.loaiVthh.startsWith('03')) {
          ttVatTuCn += item.tongTien ? item.tongTien : 0;
        } else {
          ttMuoi += item.tongTien ? item.tongTien : 0;
        }
      }
    });
    // this.dtMuaVatTu = ttVatTu;
    // this.dtMuaMuoi = ttMuoi;
    // this.dtMuaVatCn = ttVatTuCn;
    // this.tongTable1 = this.dtMuaVatTu + this.dtMuaMuoi + this.dtMuaVatCn + (this.keHoachNhapXuat.nhapCtMua ? (this.keHoachNhapXuat.tienMuaThoc + this.keHoachNhapXuat.tienMuaGaoXcht + this.keHoachNhapXuat.tienMuaGaoLpdh) : (this.keHoachNhapXuat.tienMuaThoc + this.keHoachNhapXuat.tongTienMuaGao));
  }

  templateName = 'danh-sach-quyet-dinh-cua-bo-tai-chinh-giao-tong-cuc-du-tru';

  async preview(id) {
    this.spinner.show();
    await this.quyetDinhTCDTGiaoDonviService.preview({
      tenBaoCao: this.templateName + '.docx',
      id: id,
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + '.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + '.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async newObjectVatTu() {
    if (this.options && this.options.length > 0) {
      let i = 1;
      this.dataVatTuXuatGiam = [];
      this.dataVatTuXuatBan = [];
      this.dataVatTuXuatLpdh = [];
      for (let donVi of this.options) {
        let khVatTu = new KhVatTu();
        khVatTu.donViId = donVi.id;
        khVatTu.maDvi = donVi.maDvi;
        khVatTu.tenDvi = donVi.tenDvi;
        khVatTu.sttDonVi = i;
        khVatTu.donViTinh = '';
        khVatTu.vatTuId = null;
        khVatTu.vatTuChaId = null;
        khVatTu.maVatTu = '';
        khVatTu.maVatTuCha = '';
        khVatTu.tenVatTu = '';
        khVatTu.tenVatTuCha = '';
        khVatTu.soLuongNhap = 0;
        khVatTu.soLuongXuat = 0;
        khVatTu.namNhap = null;
        khVatTu.soLuongChuyenSang = 0;
        this.dataVatTuXuatGiam.push(khVatTu);
        this.dataVatTuXuatBan.push(khVatTu);
        this.dataVatTuXuatLpdh.push(khVatTu);
        i++;
      }
    }
    // this.convertListDataVatTuNhap(this.dataVatTuNhap);
    // this.convertListDataVatTuXuat(this.dataVatTuXuat);
    // this.expandAll(this.dataVatTuNhapTree);
    // this.expandAllVatTuXuat(this.dataVatTuXuatTree);
  }


  async loadDonVi() {
    try {
      const res = await this.donViService.layDonViCon();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type != 'PB') {
            const item = {
              ...res.data[i],
              labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
            };
            this.optionsDonVi.push(item);
          } else {
            continue;
          }
        }
        this.options = cloneDeep(this.optionsDonVi);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

}
