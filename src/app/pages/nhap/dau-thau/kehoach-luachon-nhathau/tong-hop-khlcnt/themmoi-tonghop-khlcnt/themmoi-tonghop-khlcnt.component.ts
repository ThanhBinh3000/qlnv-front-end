import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { StorageService } from 'src/app/services/storage.service';
import {convertIdToLoaiVthh, convertIdToTenLoaiVthh, convertTrangThai} from "../../../../../../shared/commonFunction";
import { saveAs } from "file-saver";
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {DonviService} from "../../../../../../services/donvi.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-themmoi-tonghop-khlcnt',
  templateUrl: './themmoi-tonghop-khlcnt.component.html',
  styleUrls: ['./themmoi-tonghop-khlcnt.component.scss']
})
export class ThemmoiTonghopKhlcntComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string
  @Input() id: number;
  @Input() isViewOnModal: boolean;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  formTraCuu: FormGroup;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachDX: any[] = [];
  isTongHop: boolean = false;
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  isQuyetDinh: boolean = false;
  selected: boolean = false;
  disableTh: boolean = false
  listFileDinhKem: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  dsDonVi: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "tong_hop_kh_lcnt.docx",
    tenBaoCao: "",
    trangThai: ""
  };
  showDlgPreview = false;
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  maTrinh: string = '';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHLCNTService);
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        hthucLcnt: [''],
        pthucLcnt: [''],
        loaiHdong: [''],
        nguonVon: [''],
        listMaDvi: null,
      }
    );
    this.formData = this.fb.group({
      id: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKhoach: [, [Validators.required]],
      ngayTao: [, [Validators.required]],
      noiDung: ['', [Validators.required]],
      // hthucLcnt: ['', [Validators.required]],
      // pthucLcnt: ['', [Validators.required]],
      // loaiHdong: ['', [Validators.required]],
      // nguonVon: ['', [Validators.required]],
      ghiChu: ['',],
      trangThai: [null],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: [''],
      soQdCc: [''],
      kieuNx: [''],
      loaiHinhNx: [''],
      maTh: [],
      ngayTrinh: [, [Validators.required]],
      soTtr: [, [Validators.required]],
      listMaDvi: null,
    })

  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    try {
      await Promise.all([
        this.loadDataComboBox(),
        this.loadChiTiet(),
        this.loadDsDonVi(),
        this.convertTenVthh()
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  convertTenVthh(){
    let data = convertIdToTenLoaiVthh(this.loaiVthh);
    this.formTraCuu.get('tenLoaiVthh').setValue(data)
    this.formTraCuu.get('loaiVthh').setValue(this.loaiVthh)
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.listFileDinhKem = dataDetail.fileDinhKems;
        this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, dataDetail)
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.isTongHop = true;
      }
      else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.showFirstRow(event, this.dataTableDanhSachDX[0].idDxHdr);
    }
  }

  async showFirstRow($event, data: any) {
    await this.showDetail($event, data);
  }
  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.userService.isTongCuc()) {
        this.dsDonVi = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_DT");
      this.formData.get("loaiHinhNx").setValue(this.listLoaiHinhNx[0].ma);
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
  }

  async tongHopDeXuatTuCuc() {
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      let res = await this.tongHopDeXuatKHLCNTService.deXuatCuc(body);
      if (res.msg == MESSAGE.SUCCESS && res.data && res.data.hhDxKhLcntThopDtlList.length > 0) {
        const dataDetail = res.data
        let maTh = await this.userService.getId("HH_DX_KHLCNT_THOP_HDR_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail)
        this.formData.patchValue({
          maTh: maTh,
          ngayTao: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
        this.isTongHop = true;
        this.showFirstRow(event, this.dataTableDanhSachDX[0].idDxHdr);
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu để tổng hợp.");
        this.isTongHop = false;
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.isTongHop = false;
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async save() {
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    body.listMaDvi = this.formTraCuu.value.listMaDvi
    body.ngayTrinh = pipe.transform(body.ngayTrinh, 'yyyy-MM-dd HH:mm')
    body.fileDinhKems = this.listFileDinhKem;
    let data = await this.createUpdate(body, 'NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP');
    if (data) {
      this.id = data.id;
      // await this.loadChiTiet();
      this.isView = true
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng DTQG',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formTraCuu.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenLoaiVthh: data.parent.ten,
        });
      }
    });
  }

  taoQdinh() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
  }

  idRowSelect: number;
  async showDetail($event, id: number) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.idRowSelect = id;
    await this.spinner.hide();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  thongTinTrangThai(trangThai: string): string {
    if (trangThai === '27') {
      return 'da-du-thao';
    } else if (trangThai === '28') {
      return 'da-ban-hanh';
    }
  }

  async preview() {
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    await this.tongHopDeXuatKHLCNTService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf() {
    saveAs(this.pdfSrc, "tong_hop_kh_lcnt.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "tong_hop_kh_lcnt.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }
}



