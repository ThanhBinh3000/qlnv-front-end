import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import {API_STATUS_CODE, LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {STATUS} from "../../../../../../constants/status";
import {QuyetDinhGiaTCDTNNService} from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import {DanhSachPhanLo} from 'src/app/models/KeHoachBanDauGia';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DatePipe} from '@angular/common';
import {PREVIEW} from "../../../../../../constants/fileType";
import {saveAs} from 'file-saver';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {QuyetDinhGiaCuaBtcService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})

export class ThemDeXuatKeHoachBanDauGiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() showFromTH: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listPhuongThucThanhToan: any[] = [];
  dataChiTieu: any;
  listVatTuCha: any[] = [];
  listVatTu = [];
  maHauTo: any;
  giaToiDa: any;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  dataDonGiaDuocDuyet: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChi: [],
      namKh: [],
      soDxuat: [''],
      trichYeu: [''],
      idSoQdCtieu: [],
      soQdCtieu: [''],
      ngayTao: [''],
      ngayPduyet: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      thoiGianDuKien: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBao: [''],
      khoanTienDatTruoc: [],
      tongSoLuong: [0],
      tongTienKhoiDiemDx: [0],
      tongTienGiaKdTheoDgiaDd: [0],
      tongTienDatTruocDx: [0],
      tongKhoanTienDtTheoDgiaDd: [0],
      ghiChu: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tongDonGiaDx: [],
      donViTinh: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_TR;
      if (this.idInput > 0) {
      } else {
        await this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async onChangeNamKh() {
    if (this.userService.isCuc()) {
      await this.getDataChiTieu();
    } else {
      if (this.idInput == null) {
        await this.getDataChiTieu();
      }
    }
  }

  async initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_PHONG_BAN,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
      namKh: dayjs().get('year'),
      ngayTao: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      loaiVthh: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' : this.loaiVthh
    })
    await this.getDataChiTieu()
    await this.loadDsVthh()
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.getDetail(this.idInput);
    }
  }

  async getDetail(id: number) {
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.formData.patchValue({
          soDxuat: data.soDxuat?.split('/')[0],
          thoiGianDuKien: (data.tgianDkienTu && data.tgianDkienDen) ? [data.tgianDkienTu, data.tgianDkienDen] : null
        })
        this.dataTable = data.children;
        await this.getDataChiTieu()
        if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
          await this.onChangeLoaiVthh(data.loaiVthh, );
        }
        await this.getGiaToiThieu();
        await this.donGiaDuocDuyet();
      }
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        res.data.forEach((item) => {
          this.formData.patchValue({
            tenLoaiVthh: item.children?.find(s => s.ma == this.loaiVthh)?.ten,
          })
        })
      }
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
        this.formData.patchValue({
          tenLoaiVthh: res.data?.find(s => s.ma == this.loaiVthh)?.ten,
        })
      }
    }
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    this.listPhuongThucThanhToan = [];
    let resPtTt = await this.danhMucService.danhMucChungGetAll("PHUONG_THUC_TT");
    if (resPtTt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucThanhToan = resPtTt.data
    }
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  selectHangHoa() {
    this.dataTable = [];
    const modalTuChoi = this.modal.create({
      nzTitle: 'DANH SÁCH HÀNG HÓA',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: this.loaiVthh
      }
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.ma.startsWith(LOAI_HANG_DTQG.MUOI)) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
            donViTinh: data.parent.maDviTinh
          });
        } else {
          this.formData.patchValue({
            cloaiVthh: data.cap == 3 ? data.ma : null,
            tenCloaiVthh: data.cap == 3 ? data.ten : null,
            loaiVthh: data.cap == 3 ? data.parent.ma : data.ma,
            tenLoaiVthh: data.cap == 3 ? data.parent.ten : data.ten,
            donViTinh: data.cap == 3 ? data.parent.maDviTinh : null,
          });
        }
        await this.getGiaToiThieu();
        await this.donGiaDuocDuyet();
      }
    });
  }

  async onChangeLoaiVthh(event, isCloai?) {
    if (isCloai) {
      this.formData.patchValue({
        cloaiVthh: null,
        tenCloaiVthh: null,
      })
    }
    this.listVatTu = this.dataChiTieu?.khVatTuXuat.filter(s => s.maVatTuCha == event)
    this.listVatTu = this.listVatTu?.map(item => {
      return {maVatTu: item.maVatTu, tenVatTu: item.tenVatTu}
    })
      .filter((value, index, self) => index === self.findIndex(item => item.maVatTu === value.maVatTu && item.maVatTu != null));
    let vatTu = this.dataChiTieu?.khVatTuXuat.find(s => s.maVatTuCha === event)
    if (isCloai) {
      this.formData.patchValue({
        donViTinh: vatTu?.donViTinh,
        tenCloaiVthh: vatTu?.tenVatTu
      })
    }
  }

  async onChangeCloaiVthh(event) {
    await this.getGiaToiThieu(event);
    await this.donGiaDuocDuyet();
  }

  async getGiaToiThieu(event?) {
    let body = {
      namKeHoach: this.formData.get('namKh').value,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      loaiGia: "LG02",
      maDvi: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '0101' : this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH
    }
    let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data) {
        let giaToiDa = 0;
        res.data.forEach((item) => {
          let giaQdBtc = 0;
          if (item.giaQdBtc != null && item.giaQdBtc > 0) {
            giaQdBtc = item.giaQdBtc
          } else {
            giaQdBtc = item.giaQdDcBtc
          }
          if (giaQdBtc > giaToiDa) {
            giaToiDa = giaQdBtc;
          }
        })
        this.giaToiDa = giaToiDa;
      }
    }
    let resTC = await this.dmTieuChuanService.getDetailByMaHh(
      this.formData.get('cloaiVthh').value,
    );
    if (resTC.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: resTC.data ? resTC.data.tenQchuan : null,
      });
    }
  }

  async donGiaDuocDuyet() {
    let bodyPag = {
      namKeHoach: this.formData.get('namKh').value,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      trangThai: STATUS.BAN_HANH,
      maDvi: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' :this.userInfo.MA_DVI,
      loaiGia: 'LG04'
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
    if (pag.msg == MESSAGE.SUCCESS) {
      if (pag.data) {
        this.dataDonGiaDuocDuyet = pag.data;
      } else {
        this.dataDonGiaDuocDuyet = null;
      }
    }
    await this.calculatorTable();
  }

  themMoiBangPhanLoTaiSan($event, data?: DanhSachPhanLo, index?: number) {
    $event.stopPropagation();
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      if (!this.formData.get('loaiVthh').value) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
        return;
      }
    } else {
      if (!this.formData.get('loaiVthh').value || !this.formData.get('cloaiVthh').value) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa và chủng loại hàng hóa');
        return;
      }
    }
    if (!this.formData.get('khoanTienDatTruoc').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      return;
    }
    if (this.validateGiaGiaToiDa()) {
      const modalGT = this.modal.create({
        nzTitle: 'THÊM ĐỊA ĐIỂM GIAO NHẬN HÀNG',
        nzContent: DialogThemDiaDiemPhanLoComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '2500px',
        nzFooter: null,
        nzComponentParams: {
          dataEdit: data,
          dataChiTieu: this.dataChiTieu,
          dataDonGiaDuocDuyet: this.dataDonGiaDuocDuyet,
          loaiVthh: this.formData.get('loaiVthh').value,
          cloaiVthh: this.formData.get('cloaiVthh').value,
          tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
          khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
          namKh: this.formData.get('namKh').value,
          donViTinh: this.formData.get('donViTinh').value,
          giaToiDa: this.giaToiDa,
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (!data) {
          return;
        }
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          if (!this.validateAddDiaDiem(data)) {
            return
          }
          this.dataTable.push(data);
        }
        this.calculatorTable();
      });
    }
  }

  validateGiaGiaToiDa() {
    if (this.giaToiDa == null) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá bán tối thiểu bạn mới thêm được danh mục đơn vị tài sản BDG vì giá bán đề xuất ở đây nhập vào phải >= giá bán tối thiểu');
      return false;
    } else {
      return true;
    }
    return true;
  }

  validateAddDiaDiem(dataAdd): boolean {
    let data = this.dataTable.filter(item => item.maDvi == dataAdd.maDvi);
    if (data.length > 0) {
      this.notification.error(MESSAGE.ERROR, "Chi cục " + data[0].tenDvi + " đã tồn tại. Vui lòng thêm chi cục khác");
      return false;
    }
    return true;
  }

  calculatorTable() {
    this.dataTable.forEach((item) => {
      item.tongGiaKdiemDx = 0;
      item.tongGiaKdiemDd = 0;
      item.tongTienDtruocDd = 0;
      item.children.forEach((child) => {
        if (this.dataDonGiaDuocDuyet && this.dataDonGiaDuocDuyet.length > 0){
          if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
            this.dataDonGiaDuocDuyet?.forEach(s => {
              child.donGiaDuocDuyet = s.giaQdTcdt
            })
          } else {
            child.donGiaDuocDuyet = this.dataDonGiaDuocDuyet?.find(s => s.maChiCuc === item.maDvi).giaQdTcdt;
          }
        }
        child.giaKhoiDiemDd = child.soLuongDeXuat * child.donGiaDuocDuyet;
        child.soTienDtruocDd = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        item.tongGiaKdiemDx += child.giaKhoiDiemDx;
        item.tongGiaKdiemDd += child.giaKhoiDiemDd;
        item.tongTienDtruocDd += child.soTienDtruocDd;
      })
    })
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.tongSlXuatBanDx, 0),
      tongTienKhoiDiemDx: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDx, 0),
      tongTienGiaKdTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDd, 0),
      tongTienDatTruocDx: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDatTruocDx, 0),
      tongKhoanTienDtTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDtruocDd, 0),
    });
  }

  deleteRow(i: number) {
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
          this.dataTable = this.dataTable.filter((item, index) => index != i);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save() {
    if (this.validateNgay()) {
      await this.helperService.ignoreRequiredForm(this.formData);
      let body = {
        ...this.formData.value,
        soDxuat: this.formData.value.soDxuat ? this.formData.value.soDxuat + this.maHauTo : null
      }
      if (this.formData.get('thoiGianDuKien').value) {
        body.tgianDkienTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
        body.tgianDkienDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
      }
      body.children = this.dataTable;
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidator(true);
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách danh mục tài sản bán đấu giá không được để trống',
      );
      return;
    } else {
      if (this.validatemaDviTsan()) {
        let body = {
          ...this.formData.value,
          soDxuat: this.formData.value.soDxuat ? this.formData.value.soDxuat + this.maHauTo : null
        }
        if (this.formData.get('thoiGianDuKien').value) {
          body.tgianDkienTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
          body.tgianDkienDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
        }
        body.children = this.dataTable;
        await super.saveAndSend(body, trangThai, msg, msgSuccess);
      }
    }
  }

  async getDataChiTieu() {
    let res2 = null;
    res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
      +this.formData.get('namKh').value,
    );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQdCtieu: res2.data.soQuyetDinh,
        idSoQdCtieu: res2.data.id
      });
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        this.listVatTuCha = res2.data.khVatTuXuat.map(item => {
          return {maVatTuCha: item.maVatTuCha, tenVatTuCha: item.tenVatTuCha}
        })
          .filter((value, index, self) => index === self.findIndex(item => item.maVatTuCha === value.maVatTuCha && item.maVatTuCha != null));
      }
    } else {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQdCtieu: null,
        idSoQdCtieu: null
      });
    }
  }

  validatemaDviTsan(): boolean {
    if (this.dataTable && this.dataTable.length > 0) {
      let data = this.dataTable.flatMap(s => s.children)
      const checkMaDviTsan = {};
      data.forEach((item) => {
        const maDviTsan = item.maDviTsan;
        if (checkMaDviTsan[maDviTsan]) {
          checkMaDviTsan[maDviTsan]++;
        } else {
          checkMaDviTsan[maDviTsan] = 1;
        }
      });
      let result = '';
      for (let prop in checkMaDviTsan) {
        if (checkMaDviTsan[prop] > 1) {
          result += `${prop} ( hiện đang bị lặp lại ${checkMaDviTsan[prop]} lần), `;
        }
      }
      let rs = Object.values(checkMaDviTsan).some(value => +value > 1);
      if (rs == true) {
        this.notification.error(MESSAGE.ERROR, "Mã đơn vị tài sản " + result.slice(0, -2) + " vui lòng nhập lại");
        return false;
      }
    }
    return true;
  }

  validateNgay() {
    let pipe = new DatePipe('en-US');
    let ngayTao = new Date(pipe.transform(this.formData.value.ngayTao, 'yyyy-MM-dd'));
    let ngayPduyet = new Date(pipe.transform(this.formData.value.ngayPduyet, 'yyyy-MM-dd'));
    if (this.formData.value.ngayPduyet) {
      if (ngayTao > ngayPduyet) {
        this.notification.error(MESSAGE.ERROR, "Ngày tạo không được vượt quá ngày phê duyệt");
        return false
      }
    }
    return true;
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  setValidator(isGuiDuyet: boolean) {
    if (isGuiDuyet) {
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["diaChi"].setValidators([Validators.required]);
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["ngayTao"].setValidators([Validators.required]);
      this.formData.controls["soQdCtieu"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
      this.formData.controls["tgianTtoan"].setValidators([Validators.required]);
      this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
      this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
      this.formData.controls["pthucGnhan"].setValidators([Validators.required]);
      this.formData.controls["khoanTienDatTruoc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["diaChi"].clearValidators();
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["soDxuat"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["ngayTao"].clearValidators();
      this.formData.controls["soQdCtieu"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["thoiGianDuKien"].clearValidators();
      this.formData.controls["tgianTtoan"].clearValidators();
      this.formData.controls["pthucTtoan"].clearValidators();
      this.formData.controls["tgianGnhan"].clearValidators();
      this.formData.controls["pthucGnhan"].clearValidators();
      this.formData.controls["khoanTienDatTruoc"].clearValidators();
    }
  }

  async preview(id) {
    await this.deXuatKhBanDauGiaService.preview({
      "tenBaoCao": "de-xuat-ke-hoach-ban-dau-gia",
      "id": id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "De-xuat-ke-hoach-ban-dau-gia.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "De-xuat-ke-hoach-ban-dau-gia.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
}
