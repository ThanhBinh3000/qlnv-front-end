import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { Validators } from '@angular/forms';
import { KhCnQuyChuanKyThuat } from './../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';
import { QuyChunKyThuatQuocGia } from 'src/app/models/KhoaHocCongNgheBaoQuan';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DonviService } from 'src/app/services/donvi.service';
import { Base2Component } from './../../../../components/base2/base2.component';


@Component({
  selector: 'app-thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss']
})
export class ThongTinQuanLyQuyChuanKyThuatQuocGiaComponent extends Base2Component implements OnInit, OnChanges {

  @Input() id: number;
  @Input('isView') isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  hasError: boolean = false;
  formThongTinChung: any = {};
  tabSelected: number = 0;
  dataTableKyThuat: any[] = []
  dataTable: any[] = []
  listCapDt: any[] = []
  listOfOption: any = [];
  listOfTagOptions: any = [];
  listLoaiVthh: any = [];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  maVb: string;
  listCloaiVthh: any[] = [];
  listOfCloaiVthh: any[] = [];
  isEdit: boolean = false;
  rowItem: QuyChunKyThuatQuocGia = new QuyChunKyThuatQuocGia;
  dataEdit: { [key: string]: { edit: boolean; data: QuyChunKyThuatQuocGia } } = {};
  listVanBan: any[] = [];
  listVanBanId: any = [];
  dsBoNganh: any[] = [];
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
      id: [''],
      soVanBan: ['', [Validators.required]],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      soHieuQuyChuan: ['', [Validators.required]],
      apDungTai: [''],
      idVanBanThayThe: [''],
      soVanBanThayThe: [''],
      loaiVthh: [],
      trichYeu: ['', [Validators.required]],
      thoiGianLuuKhoToiDa: [null],
      trangThaiHl: [null],
      trangThai: [null],
      tenTrangThai: [null,],
      taiLieuDinhKemList: [null,],
      maDvi: [''],
      ldoTuChoi: [''],
      apDungCloaiVthh: [false],
      listTenLoaiVthh: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(changes);
    }
  }

  async ngOnInit() {
    this.spinner.show();
    console.log(this.formThongTinChung);
    try {
      this.initForm();
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.loadDsNam(),
        this.maVb = '/QĐ-BTC',
        this.loadLoaiHangHoa(),
        this.getListBoNganh()
      ]);
      this.getListCapDt();
      this.getListVanBan();
      this.getDetail(this.id),
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
      let res = await this.khCnQuyChuanKyThuat.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.listOfTagOptions = data.loaiVthh.split(',');
        this.changeListOfTagOptions(data.loaiVthh);

        let lss = []
        for (let item of this.listOfTagOptions) {
          lss = [...lss, this.listOfOption.find(s => s.maHangHoa == item)?.tenHangHoa];
          this.listLoaiVthh = lss;
          data.listTenLoaiVthh = this.listLoaiVthh.join(',');
        }
        let ds = []
        ds = this.dsBoNganh.find(s => s.key == data.apDungTai)?.title;
        data.apDungTai = ds;
        this.listVanBanId = String(data.idVanBanThayThe);
        this.helperService.bidingDataInFormGroup(this.formData, data);
        this.dataTable = data.tieuChuanKyThuat;
        this.dataTable.forEach((item, index) => {
          this.dataEdit[index] = {
            edit: false,
            data: { ...item },
          };
        });
        this.taiLieuDinhKemList = data.fileDinhKems;
      }
    } else {
      // let id = await this.userService.getId("KHCN_QUY_CHUAN_QG_HDR_SEQ")
      this.formData.patchValue({
        // soVanBan: id + this.maVb,
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChiDvi: this.userInfo.DON_VI.diaChi,
        apDungTai: this.userInfo.TEN_DVI
      })
    }
  }

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data.filter(s => s.tenDvi);
      let boTaiChinh = res.data.find(s => s.code === 'BTC');
      Object.assign(this.dsBoNganh, boTaiChinh)
    }
  }

  async initForm() {
    this.formData.patchValue({
      trangThai: "00",
      tenTrangThai: "Dự Thảo"
    })
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

  async save(isGuiDuyet?) {


    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.hasError) {
      this.notification.error(MESSAGE.ERROR, 'Nội dung quy chuẩn kỹ thuật không hợp lệ.')
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.tieuChuanKyThuat = this.dataTable;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.loaiVthh = this.listOfTagOptions.join(',');
    body.listTenLoaiVthh = this.listLoaiVthh.join(',');
    body.apDungTai = this.userInfo.MA_DVI.substring(0, 2);
    let res = null;
    if (this.id > 0) {
      res = await this.khCnQuyChuanKyThuat.update(body);
    } else {
      res = await this.khCnQuyChuanKyThuat.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        await this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
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
            this.notification.error(MESSAGE.ERROR, 'Trạng thái hiệu lực không được để trống')
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

  async loadLoaiHangHoa() {
    try {
      let hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
        "maDvi": this.userInfo.MA_DVI.substring(0, 2)
      }).toPromise();
      if (hangHoa) {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          let ds = hangHoa.data.filter(element => {
            return element.maHangHoa.length == 4;
          }
          )
          ds = ds.flat();
          this.listOfOption = ds;
        }
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async changeListOfTagOptions(cloaiVtt, typeData?) {
    let lss = [];
    let ls = [];
    if (this.listOfTagOptions.length > 0) {
      for (let item of this.listOfTagOptions) {
        let body = {
          "str": item
        };
        let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
        if (res.msg == MESSAGE.SUCCESS) {
          ls = [...ls, res.data];
          this.listCloaiVthh = ls.flat();
        }
        lss = [...lss, this.listOfOption.find(s => s.maHangHoa == item)?.tenHangHoa]
        this.listLoaiVthh = lss;
        const data = this.listCloaiVthh.filter(d => d.key)
        if (typeData) {
          if (data.length > 0) {
            typeData.tenCloaiVthh = data[0].title;
          }
        }
        if (data.length > 0) {
          this.rowItem.tenCloaiVthh = data[0].title;
        }
        // this.rowItem.tenCloaiVthh = data[0].title;
      };
    }
  }

  onChangeLoaiVthh() {
  }
  onChangeChiTieuCha() {
    if (this.rowItem.chiTieuCha) {
      this.rowItem.chiTieuCha = true

    } else {
      this.rowItem.chiTieuCha = false

    }
  }
  clearData() {
    this.rowItem = new QuyChunKyThuatQuocGia();
  }
  themMoiItem() {
    if (this.dataTable) {
      if (this.rowItem.tenChiTieu && this.rowItem.mucYeuCauNhap && this.rowItem.mucYeuCauNhapToiThieu && this.rowItem.mucYeuCauNhapToiDa &&
        this.rowItem.mucYeuCauXuat && this.rowItem.mucYeuCauNhapToiThieu && this.rowItem.mucYeuCauXuatToiDa != null) {
        this.sortTableId();
        let item = cloneDeep(this.rowItem);
        item.stt = this.dataTable.length + 1;
        item.edit = false;
        this.dataTable = [
          ...this.dataTable,
          item,
        ]

        this.rowItem = new QuyChunKyThuatQuocGia();
        this.updateEditCache();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
      }
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }
  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }
  luuEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }



  xoaItem(index: number) {
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
    }
    let res = await this.khCnQuyChuanKyThuat.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let ds1 = res.data.content;
      this.listVanBan = ds1;
    }
  }
  async changeListVanBan() {
    if (this.listVanBanId) {
      let res = await this.khCnQuyChuanKyThuat.getDetail(this.listVanBanId);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          soVanBanThayThe: data.soVanBan,
          idVanBanThayThe: data.id,
        })
        if (data.loaiVthh) {
          this.listOfTagOptions = data.loaiVthh.split(',');
        }
        if (data.listTenLoaiVthh) {
          this.listLoaiVthh = data.listTenLoaiVthh.split(',');
        }
        this.dataTable = data.tieuChuanKyThuat;
        this.dataTable.forEach((item, index) => {
          this.dataEdit[index] = {
            edit: false,
            data: { ...item },
          };
        });
      }
    }
  }
}
