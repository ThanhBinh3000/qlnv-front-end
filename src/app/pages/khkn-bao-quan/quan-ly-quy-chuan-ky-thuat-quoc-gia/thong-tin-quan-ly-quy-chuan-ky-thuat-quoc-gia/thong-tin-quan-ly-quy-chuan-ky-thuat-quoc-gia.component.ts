import {cloneDeep, includes} from 'lodash';
import {Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewChild, SimpleChanges} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {Validators} from '@angular/forms';
import {KhCnQuyChuanKyThuat} from './../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS, TRANG_THAI_QUY_CHUAN_TIEU_CHUAN} from 'src/app/constants/status';
import {QuyChunKyThuatQuocGia} from 'src/app/models/KhoaHocCongNgheBaoQuan';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DonviService} from 'src/app/services/donvi.service';
import {Base2Component} from './../../../../components/base2/base2.component';
import {TimKiemVanBanComponent} from './tim-kiem-van-ban/tim-kiem-van-ban.component';
import {FILETYPE, PREVIEW} from '../../../../constants/fileType';
import {saveAs} from 'file-saver';
import printJS from 'print-js';
import {FileDinhKem} from "../../../../models/FileDinhKem";


@Component({
  selector: 'app-thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss'],
})
export class ThongTinQuanLyQuyChuanKyThuatQuocGiaComponent extends Base2Component implements OnInit, OnChanges {

  @Input() id: number;
  @Input('isView') isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  hasError: boolean = false;
  tabSelected: number = 0;
  dsNhomCtieu: any[] = [];
  dsToanTu: any[] = [];
  listFile: any[] = [];
  dataTable: any[] = [];
  dataTableView: any[] = [];
  listCapDt: any[] = [];
  listOfOption: any = [];
  listOfTagOptions: any = [];
  listLoaiVthh: any = [];
  taiLieuDinhKemList: any[] = [];
  vanBanHieuLuc: FileDinhKem = new FileDinhKem();
  // vanBanHieuLuc:  any[] = [];
  dsNam: any[] = [];
  listCloaiVthh: any[] = [];
  listAllCloaiVthh: any[] = [];
  listCloaiVthhReq: any[] = [];
  listOfCloaiVthh: any[] = [];
  isEdit: boolean = false;
  rowItem: QuyChunKyThuatQuocGia = new QuyChunKyThuatQuocGia;
  itemQuyChuan: QuyChunKyThuatQuocGia = new QuyChunKyThuatQuocGia;
  dataEdit: { [key: string]: { edit: boolean; data: QuyChunKyThuatQuocGia } } = {};
  listVanBan: any[] = [];
  listVanBanId: any = [];
  dsBoNganh: any[] = [];
  listAll: any[] = [];
  listChiTieu: any[] = [];
  listMaSo: any[] = [
    {maVb: '/' + dayjs().get('year') + '/TT-BTC'},
    {maVb: '/' + dayjs().get('year') + '/QĐ-BTC'},
  ];

  reportTemplate: any = {
    typeFile: '',
    fileName: 'tieu_chuan_chat_luong_khcnbq.docx',
    tenBaoCao: '',
    trangThai: '',
  };
  showDlgPreview = false;
  pdfSrc: any;
  wordSrc: any;
  printSrc: any;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, khCnQuyChuanKyThuat);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      soVanBan: ['', [Validators.required]],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [null],
      soHieuQuyChuan: [null, [Validators.required]],
      apDungTai: [''],
      idVanBanThayThe: [null],
      soVanBanThayThe: [null],
      soVanBanSuaDoi: [null],
      idVanBanSuaDoi: [null],
      loaiVthh: [],
      trichYeu: ['', [Validators.required]],
      thoiGianLuuKhoToiDa: [null],
      trangThaiHl: [null],
      trangThai: [null],
      tenTrangThai: [null],
      taiLieuDinhKemList: [],
      maDvi: [''],
      ldoTuChoi: [''],
      apDungCloaiVthh: [true],
      listTenLoaiVthh: [''],
      type: [''],
      isMat: [false],
      maBn: [],
      maVb: this.listMaSo[0].maVb,
    });
    this.filterTable = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.loadDsNam();
      this.loadLoaiHangHoa();
      this.getListBoNganh();
      this.getListCapDt();
      this.getListVanBan();
      this.loadDsNhomCtieu();
      this.loadDsToanTu();
      await this.initForm();
      await this.getDetail(this.id),
        this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDsNam() {
    for (let i = 0; i < 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
  }


  async getDetail(id) {
    if (id > 0) {
      await this.spinner.show();
      try {
        let res = await this.khCnQuyChuanKyThuat.getDetail(id);
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          this.listOfTagOptions = data.loaiVthh.split(',');
          this.changeListOfTagOptions(data.loaiVthh, false);
          let lss = [];
          for (let item of this.listOfTagOptions) {
            lss = [...lss, this.listOfOption.find(s => s.maHangHoa == item)?.tenHangHoa];
            this.listLoaiVthh = lss;
            data.listTenLoaiVthh = this.listLoaiVthh.join(',');
          }
          let ds = [];
          ds = this.dsBoNganh.find(s => s.key == data.apDungTai)?.title;
          data.apDungTai = ds;
          this.listVanBanId = String(data.idVanBanThayThe);
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            maBn: data.maBn,
          });
          this.dataTable = data.tieuChuanKyThuat;
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              if (!item.fileDinhKem) {
                item.fileDinhKem = new FileDinhKem();
              }
            })
          }
          this.dataTable.sort((a, b) => {
            if (a.thuTuHt !== b.thuTuHt) {
              return a.thuTuHt - b.thuTuHt;
            } else {
              return a.cloaiVthh && b.cloaiVthh ? a.cloaiVthh.localeCompare(b.cloaiVthh) : this.dataTable;
            }
          });
          let listFile: any[] = data.fileDinhKems;
          if (listFile && listFile.length > 0) {
            this.taiLieuDinhKemList = listFile.filter(item => item.fileType == FILETYPE.FILE_DINH_KEM);
            let vbHieuLuc = listFile.find(item => item.fileType == FILETYPE.CAN_CU_PHAP_LY);
            if (vbHieuLuc) {
              this.vanBanHieuLuc = vbHieuLuc;
            }
          }
          this.dataTableView = cloneDeep(this.dataTable);
          this.updateEditCache();
        }
      } catch (e) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        await this.spinner.hide();
      }
    } else {
      // let id = await this.userService.getId("KHCN_QUY_CHUAN_QG_HDR_SEQ");
      this.formData.patchValue({
        // soVanBan: id + this.maVb,
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChiDvi: this.userInfo.DON_VI.diaChi,
        apDungTai: this.userInfo.TEN_DVI,
        trangThaiHl: TRANG_THAI_QUY_CHUAN_TIEU_CHUAN.CON_HIEU_LUC,
      });
    }
  }

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true;
    } else {
      return false;
    }
  }

  isDisableByBoNganh(): boolean {
    if (this.formData.value.maBn && !this.formData.value.maBn.startsWith('01') && !this.userInfo.MA_DVI.startsWith('01')) {
      return true;
    } else {
      return false;
    }
  }

  isDisableVanBanTT(): boolean {
    if (this.formData.value.soVanBanSuaDoi) {
      return true;
    } else {
      return false;
    }
  }

  isDisableVanBanSD(): boolean {
    if (this.formData.value.soVanBanThayThe) {
      return true;
    } else {
      return false;
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data.filter(s => s.tenDvi);
      let boTaiChinh = res.data.find(s => s.code === 'BTC');
      boTaiChinh.tenDvi = 'TCDT - Bộ Tài Chính';
      Object.assign(this.dsBoNganh, boTaiChinh);
    }
  }


  async initForm() {
    this.formData.patchValue({
      trangThai: '00',
      tenTrangThai: 'Dự Thảo',
      maBn: this.userInfo.MA_DVI.startsWith('01') ? '01' : this.userInfo.MA_DVI,
    });
  }

  async getListCapDt() {
    this.listCapDt = [];
    let res = await this.danhMucService.danhMucChungGetAll('CAP_DE_TAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCapDt = res.data;
    }
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async addAllCloai() {
    let ls = [];
    for (let item of this.listOfTagOptions) {
      let body = {
        'str': item,
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          ls = [...ls, res.data];
        } else {
          let list = this.listOfOption.filter(data => data.maHangHoa == item);
          if (list && list.length > 0) {
            let hangHoa = list[0];
            hangHoa.ma = hangHoa.maHangHoa;
            hangHoa.cap = 2;
            ls = [...ls, hangHoa];
          }
        }
        this.listAllCloaiVthh = ls.flat();
      }
    }
    let arr = [];
    if (this.listAllCloaiVthh && this.listAllCloaiVthh.length > 0) {
      this.listAllCloaiVthh.forEach(item => {
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach(itemQc => {
            this.itemQuyChuan = cloneDeep(itemQc);
            this.itemQuyChuan.cloaiVthh = item.cap == 3 ? item.ma : null;
            this.itemQuyChuan.loaiVthh = item.cap == 3 ? item.ma.substring(0, item.ma.length - 2) : item.ma;
            arr.push(this.itemQuyChuan);
            this.itemQuyChuan = new QuyChunKyThuatQuocGia();
          });
        }
      });
    }
    this.listCloaiVthhReq = arr;
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (this.hasError) {
      this.notification.error(MESSAGE.ERROR, 'Nội dung quy chuẩn kỹ thuật không hợp lệ.');
      this.spinner.hide();
      return;
    }
    if (this.listOfTagOptions.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa.');
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.apDungCloaiVthh == true) {
      await this.addAllCloai();
      body.tieuChuanKyThuat = this.listCloaiVthhReq;
    } else {
      body.tieuChuanKyThuat = this.dataTable;
    }
    this.listFile = [];
    if (this.taiLieuDinhKemList.length > 0 && !this.formData.value.isMat) {
      this.taiLieuDinhKemList.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.vanBanHieuLuc && this.vanBanHieuLuc.fileName) {
      this.listFile.push(this.vanBanHieuLuc);
    }
    if (this.listFile && this.listFile.length > 0) {
      body.fileDinhKems = this.listFile;
    }
    body.loaiVthh = this.listOfTagOptions.join(',');
    let uniquelistLoaiVthh = [...new Map(this.listLoaiVthh.map(item => [item, item])).values()];
    body.listTenLoaiVthh = uniquelistLoaiVthh.join(',');
    body.apDungTai = this.userInfo.MA_DVI.substring(0, 2);
    let res;
    if (this.id > 0) {
      res = await this.khCnQuyChuanKyThuat.update(body);
    } else {
      res = await this.khCnQuyChuanKyThuat.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.id = res.data.id;
      this.formData.patchValue({
        id: res.data.id,
        trangThai: res.data.trangThai,
        loaiVthh: this.listOfTagOptions.join(','),
      });
      if (isGuiDuyet) {
        await this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();

  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: '',
          };
          if (this.formData.value.trangThaiHl == null) {
            this.notification.error(MESSAGE.ERROR, 'Trạng thái hiệu lực không được để trống');
            this.spinner.hide();
            return;
          }
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDV:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.BAN_HANH;
              break;
            }
          }
          let res = await this.khCnQuyChuanKyThuat.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
          }
          const res = await this.khCnQuyChuanKyThuat.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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
      }
    });
  }

  async loadDsNhomCtieu() {
    let res = await this.danhMucService.danhMucChungGetAll("NHOM_CHI_TIEU_CL");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsNhomCtieu = res.data;
      }
    }
  }

  async loadDsToanTu() {
    let res = await this.danhMucService.danhMucChungGetAll("TOAN_TU");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsToanTu = res.data;
      }
    }
  }


  async loadLoaiHangHoa(maBn?) {
    try {
      let hangHoa: any;
      if (this.userInfo.MA_DVI == '0101') {
        hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
          'maDvi': maBn ? (maBn == '01' ? '0101' : maBn) : this.userInfo.MA_DVI,
        }).toPromise();
      } else {
        hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
          'maDvi': maBn ? (maBn == '01' ? '0101' : maBn) : this.userInfo.MA_DVI.substring(0, 2),
        }).toPromise();
      }
      if (hangHoa) {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          let ds = hangHoa.data.filter(element => {
              return element.maHangHoa.length == 4;
            },
          );
          ds = ds.flat();
          this.listOfOption = ds;
        }
        let body = {};
        let res = await this.khCnQuyChuanKyThuat.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
          let list = res.data.content;
          this.listAll = list;
        }
        this.listOfOption = this.listOfOption.filter(f => {
          if (f.maHangHoa === '04' || f.maHangHoa.substring(0, 2) === '01') {
            return !this.listAll.some(s1 => s1.loaiVthh === f.maHangHoa);
          } else {
            return true;
          }
        });
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeListOfTagOptions(cloaiVtt, showPopup: boolean, typeData?) {
    let lss = [];
    let ls = [];
    if (this.listAll.some(s1 => cloaiVtt.includes(s1.loaiVthh)) && showPopup && !typeData) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Loại hàng hóa này đã tồn tại văn bản quy chuẩn/tiêu chuẩn chất lượng, bạn có chắc muốn chọn lại?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          try {

          } catch (e) {
            console.log('error', e);
          }
        },
        nzOnCancel: () => {
          this.listOfTagOptions = this.listOfTagOptions.slice(0, this.listOfTagOptions.length - 1);
        },
      });
    }
    if (this.listOfTagOptions.length > 0) {
      await this.getDsChiTieu(this.listOfTagOptions);
      for (let item of this.listOfTagOptions) {
        let body = {
          'str': item,
        };
        let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
        if (res.msg == MESSAGE.SUCCESS) {
          ls = [...ls, res.data];
          this.listCloaiVthh = ls.flat();
        }
        lss = [...lss, this.listOfOption.find(s => s.maHangHoa == item)?.tenHangHoa];
        this.listLoaiVthh = lss;
        const data = this.listCloaiVthh.filter(d => d.key);
        if (data.length > 0) {
          if (typeData) {
            typeData.tenCloaiVthh = this.listCloaiVthh.find(d => +d.key == cloaiVtt)?.title;
          } else {
            this.rowItem.tenCloaiVthh = this.listCloaiVthh.find(d => +d.key == cloaiVtt)?.title;
          }
        }
      }
      ;
    }
  }

  onChangeLoaiVthh() {
  }

  clearData() {
    this.rowItem = new QuyChunKyThuatQuocGia();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maChiTieu == item.maChiTieu) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  themMoiItem() {
    if (this.dataTable) {
      if (this.formData.value.apDungCloaiVthh == true) {
        if (this.rowItem.tenChiTieu) {
          this.sortTableId();
          let item = cloneDeep(this.rowItem);
          // item.stt = this.dataTable.length + 1;
          item.edit = false;
          if (this.checkExitsData(this.rowItem, this.dataTable)) {
            this.notification.error(MESSAGE.ERROR, 'Vui lòng không nhập trùng tên chỉ tiêu');
            return;
          }
          this.dataTable = [
            ...this.dataTable,
            item,
          ];
          this.dataTableView = cloneDeep(this.dataTable);
          this.rowItem = new QuyChunKyThuatQuocGia();
          this.updateEditCache();
        } else {
          this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập tên chỉ tiêu');
        }
      } else {
        if (this.rowItem.maChiTieu && ((this.listCloaiVthh.length > 0 && this.rowItem.cloaiVthh != null) || this.listCloaiVthh.length == 0)) {
          this.sortTableId();
          let item = cloneDeep(this.rowItem);
          // item.stt = this.dataTable.length + 1;
          item.loaiVthh = item.cloaiVthh ? item.cloaiVthh.substring(0, item.cloaiVthh.length - 2) : null;
          item.edit = false;
          this.dataTable = [
            ...this.dataTable,
            item,
          ];
          this.dataTableView = cloneDeep(this.dataTable);
          this.rowItem = new QuyChunKyThuatQuocGia();
          this.updateEditCache();
        } else {
          this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập tên chỉ tiêu và chủng loại hàng hóa');
        }
      }

    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  editItem(idx: number): void {
    this.dataEdit[idx].edit = true;
  }

  updateEditCache(): void {
    if (this.dataTableView) {
      this.dataTableView.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  huyEdit(idx: number): void {
    const index = this.dataTable.findIndex(item => item.tenChiTieu == this.dataTableView[idx].tenChiTieu);
    this.dataEdit[idx] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  luuEdit(index: number): void {
    this.hasError = (false);
    let listCtEdit = this.dataTable.filter(item => item.maChiTieu == this.dataEdit[index].data.maChiTieu);
    const idx = this.dataTable.findIndex(item => item.maChiTieu == this.dataTableView[index].maChiTieu);
    if (this.formData.value.apDungCloaiVthh == true && !this.formData.value.soVanBanSuaDoi && !this.formData.value.soVanBanThayThe) {
      if (listCtEdit && listCtEdit.length > 0) {
        const idxEdit = this.dataTable.findIndex(item => item.maChiTieu == listCtEdit[0].maChiTieu);
        if (idxEdit != idx) {
          this.notification.error(MESSAGE.ERROR, 'Vui lòng không nhập trùng tên chỉ tiêu');
          return;
        }
      }
    }
    Object.assign(this.dataTable[idx], this.dataEdit[index].data);
    this.dataTableView = cloneDeep(this.dataTable);
    this.dataEdit[index].edit = false;
  }


  xoaItem(idx) {
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
          const index = this.dataTable.findIndex(item => item.tenChiTieu == this.dataTableView[idx].tenChiTieu);
          this.dataTable.splice(index, 1);
          this.dataTableView = cloneDeep(this.dataTable);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async getListVanBan() {
    let ds = [];
    let body = {
      trangThai: STATUS.BAN_HANH,
    };
    let res = await this.khCnQuyChuanKyThuat.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let ds1 = res.data.content;
      this.listVanBan = ds1;
    }
  }

  async changeListVanBan() {
    // this.dataTable = [];
    // this.dataTableView = [];
    if (this.formData.value.idVanBanSuaDoi) {
      let res = await this.khCnQuyChuanKyThuat.getDetail(this.formData.value.idVanBanSuaDoi);
      if (res.msg == MESSAGE.SUCCESS) {
        let itemVanBanSuaDoi = res.data;
        if (itemVanBanSuaDoi) {
          const data = itemVanBanSuaDoi;
          this.formData.patchValue({
            soVanBanSuaDoi: itemVanBanSuaDoi.soVanBan,
          });
          if (itemVanBanSuaDoi.loaiVthh) {
            this.listOfTagOptions = data.loaiVthh.split(',');
          }
          if (itemVanBanSuaDoi.listTenLoaiVthh) {
            this.listLoaiVthh = itemVanBanSuaDoi.listTenLoaiVthh.split(',');
          }
          this.dataTable = itemVanBanSuaDoi.tieuChuanKyThuat;
          this.dataTable.forEach(item => {
            item.id = null;
            if (!item.fileDinhKem) {
              item.fileDinhKem = new FileDinhKem();
            }
          })
          this.dataTableView = cloneDeep(this.dataTable);
          this.updateEditCache();
          await this.getDsChiTieu(this.listOfTagOptions);
        }
      }
    } else {
      this.formData.patchValue({
        soVanBanSuaDoi: null,
      });
    }
  }

  openDialogDsVanBanQuyChuanKyThuat() {
    this.dataTable = [];
    const modalQD = this.modal.create({
      nzTitle: 'Tìm kiếm văn bản thay thế',
      nzContent: TimKiemVanBanComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        listVbThayThe: this.formData.get('soVanBanThayThe').value,
        loaiVthhSearch: this.listOfTagOptions,
        maBn: this.formData.get('maBn').value,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data && data.length > 0) {
        let res = await this.khCnQuyChuanKyThuat.getDetail(data[0].id);
        if (res.msg == MESSAGE.SUCCESS) {
          let detail = [res.data];
          this.listOfTagOptions = [];
          this.listLoaiVthh = [];
          this.dataTable = [];
          this.formData.patchValue({
            soVanBanThayThe: detail.map(o => o.soVanBan).join(', '),
            idVanBanThayThe: detail.map(o => o.id).join(', '),
            apDungCloaiVthh: res.data?.apDungCloaiVthh
          });
          detail.forEach(dt => {
            if (dt.loaiVthh) {
              this.listOfTagOptions = [...this.listOfTagOptions, ...dt.loaiVthh.split(',')];
              this.listOfTagOptions = [...new Map(this.listOfTagOptions.map(item => [item, item])).values()];
            }
            if (dt.listTenLoaiVthh) {
              this.listLoaiVthh = [...this.listLoaiVthh, ...dt.listTenLoaiVthh.split(',')];
            }
            this.dataTable = [...this.dataTable, ...dt.tieuChuanKyThuat];
          });
          this.dataTable.forEach(item => {
            item.id = null;
            if (!item.fileDinhKem) {
              item.fileDinhKem = new FileDinhKem();
            }
          })
          this.dataTableView = cloneDeep(this.dataTable);
          this.getDsChiTieu(this.listOfTagOptions);
          this.updateEditCache();
        }
      } else {
        this.formData.patchValue({
          soVanBanThayThe: null,
          idVanBanThayThe: null
        })
        this.dataTable = [];
        this.dataTableView = [];
      }
    });

  }

  searchInTable(key: string, value: string) {
    if (value != null && value != '') {
      this.dataTableView = [];
      let temp = [];
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
            temp.push(item);
          }
        });
      }
      this.dataTableView = [...this.dataTableView, ...temp];
    } else {
      this.dataTableView = cloneDeep(this.dataTable);
    }
    this.updateEditCache();
  }

  async getDsChiTieu(loaiVthh: any[]) {
    let res = await this.danhMucService.danhMucChungGetAll('CHI_TIEU_CL');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiTieu = res.data.filter(item => loaiVthh.includes(item.phanLoai));
    }
  }

  changeChiTieu(event: any, type?) {
    if (event) {
      let list = this.listChiTieu.filter(item => item.ma == event);
      if (type) {
        type.tenChiTieu = list && list.length > 0 ? list[0].giaTri : '';
      } else {
        this.rowItem.tenChiTieu = list && list.length > 0 ? list[0].giaTri : '';
      }
    }
  }

  changeNhomChiTieu(event: any, type?) {
    if (event) {
      let list = this.dsNhomCtieu.filter(item => item.ma == event);
      if (type) {
        type.tenNhomCtieu = list && list.length > 0 ? list[0].giaTri : '';
      } else {
        this.rowItem.tenNhomCtieu = list && list.length > 0 ? list[0].giaTri : '';
      }
    }
  }

  changeToanTu(event: any, type?) {
    if (event) {
      let list = this.dsToanTu.filter(item => item.ma == event);
      if (type) {
        type.tenToanTu = list && list.length > 0 ? list[0].giaTri : '';
      } else {
        this.rowItem.tenToanTu = list && list.length > 0 ? list[0].giaTri : '';
      }
    }
  }

  async preview() {
    this.spinner.show();
    try {
      let body = {
        reportTemplateRequest: this.reportTemplate,
        tieuChuanKyThuat: this.dataTable,
        maBn: this.formData.value.maBn,
        ngayHieuLuc: this.formData.value.ngayHieuLuc,
        ngayHetHieuLuc: this.formData.value.ngayHetHieuLuc,
        loaiVthh: this.formData.value.loaiVthh,
      };
      await this.khCnQuyChuanKyThuat.preview(body).then(async s => {
        this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
        this.printSrc = s.data.pdfSrc;
        this.showDlgPreview = true;
        this;
      });
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  downloadPdf() {
    saveAs(this.pdfSrc, 'tieu_chuan_chat_luong_khcnbq.pdf');
  }

  async downloadDocx() {
    saveAs(this.wordSrc, 'tieu_chuan_chat_luong_khcnbq.docx');
  }

  doPrint() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true});
  }

  changeBoNganh() {
    this.loadLoaiHangHoa(this.formData.get('maBn').value);
  }

  getNameFile(event: any, loai: string,  dataEdit: FileDinhKem) {
    if (event) {
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList | null = element.files;
      if (fileList) {
        const itemFile = {
          name: fileList[0].name,
          file: event.target.files[0] as File,
        };
        this.uploadFileService
          .uploadFile(itemFile.file, itemFile.name)
          .then((resUpload) => {
            if (loai == '00') {
              if (!this.vanBanHieuLuc) {
                this.vanBanHieuLuc = new FileDinhKem();
              }
              this.vanBanHieuLuc.fileName = resUpload.filename;
              this.vanBanHieuLuc.fileSize = resUpload.size;
              this.vanBanHieuLuc.fileUrl = resUpload.url;
              this.vanBanHieuLuc.idVirtual = new Date().getTime();
              this.vanBanHieuLuc.fileType = FILETYPE.CAN_CU_PHAP_LY;
            } else {
              if (dataEdit) {
                if (!dataEdit) {
                  dataEdit = new FileDinhKem();
                }
                dataEdit.fileName = resUpload.filename;
                dataEdit.fileSize = resUpload.size;
                dataEdit.fileUrl = resUpload.url;
                dataEdit.idVirtual = new Date().getTime();
                dataEdit.fileType = FILETYPE.CAN_CU_PHAP_LY;
              } else {
                if (!this.rowItem.fileDinhKem) {
                  this.rowItem.fileDinhKem = new FileDinhKem();
                }
                this.rowItem.fileDinhKem.fileName = resUpload.filename;
                this.rowItem.fileDinhKem.fileSize = resUpload.size;
                this.rowItem.fileDinhKem.fileUrl = resUpload.url;
                this.rowItem.fileDinhKem.idVirtual = new Date().getTime();
                this.rowItem.fileDinhKem.fileType = FILETYPE.CAN_CU_PHAP_LY;
              }
            }
          });
      }
    }
  }

  downloadFile(item: FileDinhKem) {
    if (item && item.fileName) {
      this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
        saveAs(blob, item.fileName);
      });
    }
  }

  xoaFileVanBan() {
    this.vanBanHieuLuc = new FileDinhKem();
  }
}
