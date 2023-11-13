import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DxKhNhapKhacService} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/dxKhNhapKhac.service";
import {MESSAGE} from "../../../../../constants/message";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {Validators} from "@angular/forms";
import * as dayjs from "dayjs";
import {DonviService} from "../../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {OldResponseData} from "../../../../../interfaces/response";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";
import {chain, cloneDeep} from "lodash";
import {STATUS} from "../../../../../constants/status";
import {LOAI_HINH_NHAP_XUAT} from "../../../../../constants/config";
import {DialogTuChoiComponent} from "../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: "app-them-moi-ke-hoach-nhap-khac",
  templateUrl: "./them-moi-ke-hoach-nhap-khac.component.html",
  styleUrls: ["./them-moi-ke-hoach-nhap-khac.component.scss"]
})
export class ThemMoiKeHoachNhapKhacComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() showFromTH: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  isEditRowThemMoi: boolean = false;
  listLoaiVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  maTrinh: string = "";
  listOfData: any[] = [];
  listDataGroup: any[] = [];
  isVisible: boolean = false;
  rowThemMoi: any = {};
  listDonVi: any = {};
  listCuc: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  fileDinhKems: any[] = [];
  canCuPhapLy: any[] = [];
  loKho: any = {};
  loaiHinhNhapXuat = LOAI_HINH_NHAP_XUAT;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxKhNhapKhacService: DxKhNhapKhacService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService) {
    super(httpClient, storageService, notification, spinner, modal, dxKhNhapKhacService);
    this.formData = this.fb.group({
      id: [],
      trangThai: ["00"],
      tenTrangThai: ["Dự Thảo"],
      lyDoTuChoi: [],
      maDviDxuat: ["", [Validators.required]],
      tenDvi: [""],
      loaiHinhNx: ["", [Validators.required]],
      tenLoaiHinhNx: [""],
      kieuNx: ["", [Validators.required]],
      namKhoach: [dayjs().get("year"), [Validators.required]],
      soDxuat: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
      loaiVthh: [null, [Validators.required]],
      dvt: [],
      ngayDxuat: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      tongSlNhap: [],
      tongThanhTien: []
    });
  }

  async ngOnInit() {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadData(),
      ]);
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show();
    if (changes) {
      try {
        await Promise.all([
          this.loadDsDonVi()
        ]);
        if (this.idInput > 0) {
          await this.getDetail(this.idInput);
        } else {
          await this.initForm();
        }
      } catch (e) {
        console.log("error: ", e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
    await this.spinner.hide();
  }

  async getDetail(id: number) {
    await this.dxKhNhapKhacService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail.hdr);
          console.log(this.formData, "get detail")
          this.maTrinh = "/" + dataDetail.hdr.soDxuat?.split('/')[1]
          this.formData.patchValue({
            soDxuat: dataDetail.hdr.soDxuat?.split('/')[0]
          })
          this.changeHangHoa(dataDetail.hdr.loaiVthh);
          if (dataDetail) {
            this.fileDinhKems = dataDetail.hdr.fileDinhKems;
            this.canCuPhapLy = dataDetail.hdr.canCuPhapLy;
            this.listOfData = dataDetail.dtl;
            this.convertListData();
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async initForm() {
    this.maTrinh = "/" + this.userInfo.MA_TR;
    if (this.userService.isTongCuc()) {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_PHONG_BAN,
        maDviDxuat: this.userInfo.MA_PHONG_BAN,
        trangThai: this.STATUS.DU_THAO
      });
    } else {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI,
        maDviDxuat: this.userInfo.MA_DVI,
        trangThai: this.STATUS.DU_THAO
      });
    }
  }

  async loadData() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
      this.listCloaiVthh = res.data?.filter((x) => x.ma.length == 6);
    }
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_KHAC");
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.layDonViTheoCapDo(body);
    this.listDonVi = res;
    if (this.userService.isTongCuc()) {
      this.listCuc = res[DANH_MUC_LEVEL.CUC];
      this.listCuc = this.listCuc.filter(item => item.type != "PB");
    } else {
      this.listChiCuc = res[DANH_MUC_LEVEL.CHI_CUC];
      this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB");
    }
  }

  changeHangHoa(event) {
    if (event) {
      this.formData.get("dvt").setValue(this.listLoaiVthh.find((x) => x.ma == event)?.maDviTinh);
    } else {
      this.formData.get("dvt").setValue(null);
    }
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu,
        tenLoaiHinhNx: dataNx[0].giaTri
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    if (!isGuiDuyet && this.formData.get("trangThai").value == this.STATUS.DU_THAO) {
      this.clearValidatorLuuDuThao();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      await this.luuVaGuiDuyet(isGuiDuyet);
    } else {
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.listOfData.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          'Chi tiết đề xuất kế hoạch nhập khác không được để trống.',
        );
        return;
      }
      await this.luuVaGuiDuyet(isGuiDuyet)
    }
  }

  async luuVaGuiDuyet(isGuiDuyet) {
    let body: any = {};
    if (this.formData.get('soDxuat').value) {
      this.formData.get('soDxuat').setValue(this.formData.get('soDxuat').value + this.maTrinh);
    }
    body = this.formData.value;
    if (this.userService.isCuc()) {
      this.listOfData.forEach(item => {
        item.maCuc = this.formData.value.maDviDxuat
      })
    }
    body.details = this.listOfData;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLy = this.canCuPhapLy;
    if(!await this.validateCloaiVthh(body)){
      this.notification.error(
        MESSAGE.ERROR,
        'Loại hàng DTQG không khớp với Ngăn/lô kho.',
      );
      return;
    }
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dxKhNhapKhacService.update(body);
    } else {
      res = await this.dxKhNhapKhacService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get('id').setValue(res.data.id);
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.formData.patchValue({
          soDxuat: this.formData.get("soDxuat").value.split('/')[0]
        })
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async validateCloaiVthh(data){
    let value = true;
    console.log(this.formData.value, "formData")
    data.details.forEach(item =>{
      if(!item.cloaiVthh.includes(this.formData.value.loaiVthh)){
        value = false;
        return value;
      }else{
        return value;
      }
    })
    return value;
  }

  clearValidatorLuuDuThao() {
    this.formData.controls["maDviDxuat"].clearValidators();
    this.formData.controls["loaiHinhNx"].clearValidators();
    this.formData.controls["kieuNx"].clearValidators();
    this.formData.controls["namKhoach"].clearValidators();
    this.formData.controls["soDxuat"].clearValidators();
    this.formData.controls["trichYeu"].clearValidators();
    this.formData.controls["loaiVthh"].clearValidators();
    this.formData.controls["ngayDxuat"].clearValidators();
  }

  setValidator() {
    this.formData.controls["maDviDxuat"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["namKhoach"].setValidators([Validators.required]);
    this.formData.controls["soDxuat"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["ngayDxuat"].setValidators([Validators.required]);
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'TỪ CHỐI PHÊ DUYỆT',
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
            id: this.idInput,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.DA_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_CBV;
              break;
            }
          }
          const res = await this.dxKhNhapKhacService.approve(body);
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
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.TU_CHOI_CBV:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
            case STATUS.DA_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_CBV;
              break;
            }
          }
          let res = await this.dxKhNhapKhacService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.DUYET_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async hoanThanh() {
    this.setValidator();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.listOfData.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Chi tiết đề xuất kế hoạch nhập khác không được để trống.',
      );
      return;
    }
    let body: any = {};
    if (this.formData.get('soDxuat').value) {
      this.formData.get('soDxuat').setValue(this.formData.get('soDxuat').value + this.maTrinh);
    }
    body = this.formData.value;
    body.details = this.listOfData;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLy = this.canCuPhapLy;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dxKhNhapKhacService.update(body);
    } else {
      res = await this.dxKhNhapKhacService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id;
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn hoàn thành bản dự thảo?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          await this.spinner.show();
          try {
            let body = {
              id: this.idInput,
              trangThai: STATUS.DA_TAO_CBV,
            };
            let res = await this.dxKhNhapKhacService.approve(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DUYET_SUCCESS,
              );
              this.quayLai();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
      this.formData.patchValue({
        soDxuat: this.formData.get("soDxuat").value.split('/')[0]
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  deleteRow(ma: string, data: any) {
    if (ma == 'cuc' && data.maCuc) {
      this.listOfData = this.listOfData.filter(i => i.maCuc != data.maCuc)
    }
    if (ma == 'chiCuc' && data.maChiCuc) {
      this.listOfData = this.listOfData.filter(i => i.maChiCuc != data.maChiCuc)
    }
    if (ma == 'diemKho' && data.maDiemKho) {
      this.listOfData = this.listOfData.filter(i => i.maDiemKho != data.maDiemKho)
    }
    if (ma == 'nhaKho' && data.maNhaKho) {
      this.listOfData = this.listOfData.filter(i => i.maNhaKho != data.maNhaKho)
    }
    this.convertListData();
    this.tinhTongSlVaThanhTien();
  }

  async themMoi($event, data?) {
    $event.stopPropagation();
    if (data) {
      this.rowThemMoi = cloneDeep(data);
      this.isEditRowThemMoi = true;
      if (this.userService.isTongCuc()) {
        this.listChiCuc = this.listCuc.find(item => item.maDvi == this.rowThemMoi.maCuc).children;
        if (this.listChiCuc.length > 0) {
          this.listChiCuc = this.listChiCuc.filter(chiCuc => chiCuc.type != "PB");
        }
        await this.loadListDviThemMoi()
      } else {
        await this.loadListDviThemMoi()
      }
    } else {
      this.isEditRowThemMoi = false;
    }
    if (this.formData.get("tenLoaiHinhNx").value) {
      this.rowThemMoi.title = this.formData.get("tenLoaiHinhNx").value;
    } else {
      this.rowThemMoi.title = "Thêm mới chi tiết đề xuất kế hoạch nhập khác";
    }
    this.isVisible = true;
  }

  calcTongSlTonKho() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        sum += item.slTonKho;
      })
      return sum;
    }
  }

  calcTongSlTonKhoThucTe() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        sum += item.slTonKhoThucTe;
      })
      return sum;
    }
  }

  calcTongSlHaoDoi() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        sum += item.slHaoDoiDinhMuc;
      })
      return sum;
    }
  }

  async loadListDviThemMoi() {
    this.listDiemKho = this.listChiCuc.find(item => item.maDvi == this.rowThemMoi.maChiCuc).children;
    if (this.listDiemKho.length > 0) {
      this.listDiemKho = this.listDiemKho.filter(i => i.type != "PB");
    }
    this.listNhaKho = this.listDiemKho.find(item => item.maDvi == this.rowThemMoi.maDiemKho).children;
    if (this.listNhaKho.length > 0) {
      this.listNhaKho = this.listNhaKho.filter(i => i.type != "PB");
    }
    this.listNganKho = this.listNhaKho.find(item => item.maDvi == this.rowThemMoi.maNhaKho).children;
    if (this.listNganKho.length > 0) {
      this.listNganKho = this.listNganKho.filter(i => i.type != "PB");
    }
    this.listLoKho = this.listNganKho.find(item => item.maDvi == this.rowThemMoi.maNganKho).children;
    if (this.listLoKho.length > 0) {
      this.listLoKho = this.listLoKho.filter(i => i.type != "PB");
    }
    if (this.rowThemMoi.maLoKho) {
      await this.loadThongTinNganLoKho(this.rowThemMoi.maLoKho, DANH_MUC_LEVEL.LO_KHO);
    } else {
      await this.loadThongTinNganLoKho(this.rowThemMoi.maNganKho, DANH_MUC_LEVEL.NGAN_KHO);
    }
  }

  changeCuc(event) {
    if (event) {
      this.rowThemMoi.maChiCuc = null;
      this.rowThemMoi.maDiemKho = null;
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listChiCuc = this.listCuc.find(item => item.maDvi == event).children;
      if (this.listChiCuc.length > 0) {
        this.listChiCuc = this.listChiCuc.filter(chiCuc => chiCuc.type != "PB");
      }
      this.listDiemKho = [];
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeChiCuc(event) {
    if (event) {
      this.rowThemMoi.maDiemKho = null;
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listDiemKho = this.listChiCuc.find(item => item.maDvi == event).children;
      if (this.listDiemKho.length > 0) {
        this.listDiemKho = this.listDiemKho.filter(i => i.type != "PB");
      }
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeDiemKho(event) {
    if (event) {
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listNhaKho = this.listDiemKho.find(item => item.maDvi == event).children;
      if (this.listNhaKho.length > 0) {
        this.listNhaKho = this.listNhaKho.filter(i => i.type != "PB");
      }
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeNhaKho(event) {
    if (event) {
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listNganKho = this.listNhaKho.find(item => item.maDvi == event).children;
      if (this.listNganKho.length > 0) {
        this.listNganKho = this.listNganKho.filter(i => i.type != "PB");
      }
      this.listLoKho = [];
    }
  }

  async changeNganKho(event) {
    if (event) {
      await this.spinner.show();
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listLoKho = this.listNganKho.find(item => item.maDvi == event).children;
      if (this.listLoKho.length > 0) {
        this.listLoKho = this.listLoKho.filter(i => i.type != "PB");
      }
      await this.loadThongTinNganLoKho(event, DANH_MUC_LEVEL.NGAN_KHO);
      await this.spinner.hide();
    }
  }

  async changeLoKho(event) {
    if (event) {
      await this.spinner.show();
      await this.loadThongTinNganLoKho(event, DANH_MUC_LEVEL.LO_KHO);
      await this.spinner.hide();
    }
  }

  async loadThongTinNganLoKho(event, level) {
    let body = {
      maDvi: event,
      capDvi: level
    };
    await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let loKhoDetail = res.data.object;
        this.rowThemMoi.loaiVthh = loKhoDetail.loaiVthh;
        this.rowThemMoi.tenLoaiVthh = this.listLoaiVthh.find(item => item.ma == loKhoDetail.loaiVthh)?.ten;
        this.rowThemMoi.cloaiVthh = loKhoDetail.cloaiVthh;
        this.rowThemMoi.tenCloaiVthh = this.listCloaiVthh.find(item => item.ma == loKhoDetail.cloaiVthh)?.ten;
        this.rowThemMoi.dvt = loKhoDetail.dviTinh;
        this.rowThemMoi.slTonKho = loKhoDetail.slTon;
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.rowThemMoi = {};
  }

  handleOk() {
    if (this.listOfData.length > 0) {
      if (this.rowThemMoi.maLoKho) {
        let index = this.listOfData.findIndex(i => i.maLoKho == this.rowThemMoi.maLoKho);
        if (index >= 0) {
          this.listOfData[index] = this.rowThemMoi;
          this.convertListData();
        } else {
          this.listOfData.push(this.rowThemMoi);
          this.convertListData();
        }
      } else {
        let index = this.listOfData.findIndex(i => i.maNganKho == this.rowThemMoi.maNganKho && i.maLoKho == null);
        if (index >= 0) {
          this.listOfData[index] = this.rowThemMoi;
          this.convertListData();
        } else {
          this.listOfData.push(this.rowThemMoi);
          this.convertListData();
        }
      }
    } else {
      this.listOfData.push(this.rowThemMoi);
      this.convertListData();
    }
    this.tinhTongSlVaThanhTien();
    this.isVisible = false;
    this.rowThemMoi = {};
  }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    if (this.userService.isTongCuc()) {
      this.listDataGroup = chain(this.listOfData).groupBy("maCuc").map((value, key) => (
        {
          tenCuc: this.listDonVi[DANH_MUC_LEVEL.CUC].find(i => i.maDvi == key)?.tenDvi,
          maCuc: key,
          children: value
        }))
        .value();
      this.listDataGroup.forEach(cuc => {
        cuc.children = chain(cuc.children).groupBy("maChiCuc").map((value, key) => (
          {
            tenChiCuc: this.listDonVi[DANH_MUC_LEVEL.CHI_CUC].find(i => i.maDvi == key)?.tenDvi,
            maChiCuc: key,
            children: value
          }))
          .value();
        cuc.children.forEach(chiCuc => {
          chiCuc.children = chain(chiCuc.children).groupBy("maDiemKho").map((value, key) => (
            {
              tenDiemKho: this.listDonVi[DANH_MUC_LEVEL.DIEM_KHO].find(i => i.maDvi == key)?.tenDvi,
              maDiemKho: key,
              children: value
            }))
            .value();
          // chiCuc.children.forEach(diemKho => {
          //   diemKho.children.forEach(nganLo => {
          //     if (nganLo.maLoKho != null) {
          //       nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.LO_KHO].find(i => i.maDvi == nganLo.maLoKho).tenDvi + " - "
          //         + this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
          //     } else {
          //       nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
          //     }
          //   });
          // });
        });
      });
    } else {
      this.listDataGroup = chain(this.listOfData).groupBy("maChiCuc").map((value, key) => (
        {
          tenChiCuc: this.listDonVi[DANH_MUC_LEVEL.CHI_CUC].find(i => i.maDvi == key)?.tenDvi,
          maChiCuc: key,
          children: value
        }))
        .value();
      this.listDataGroup.forEach(chiCuc => {
        chiCuc.children = chain(chiCuc.children).groupBy("maDiemKho").map((value, key) => (
          {
            tenDiemKho: this.listDonVi[DANH_MUC_LEVEL.DIEM_KHO].find(i => i.maDvi == key)?.tenDvi,
            maDiemKho: key,
            children: value
          }))
          .value();
        chiCuc.children.forEach(diemKho => {
          diemKho.children.forEach(nganLo => {
            if (nganLo.maLoKho != null) {
              nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.LO_KHO].find(i => i.maDvi == nganLo.maLoKho).tenDvi + " - "
                + this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
            } else {
              nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
            }
          });
        });
      })
    }
  }

  clearRowThemMoi() {
    this.rowThemMoi.loaiVthh = null;
    this.rowThemMoi.tenLoaiVthh = null;
    this.rowThemMoi.cloaiVthh = null;
    this.rowThemMoi.tenCloaiVthh = null;
    this.rowThemMoi.dvt = null;
    this.rowThemMoi.tonKho = null;
  }

  tinhTongSlVaThanhTien() {
    let tongSl = 0;
    let tongThanhTien = 0;
    this.listOfData.forEach(i => {
      if (this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.DOI_THUA) {
        tongSl += i.slDoiThua;
        tongThanhTien += i.slDoiThua * i.donGia;
      } else if (this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_TANG_SO_LUONG_SAU_KK) {
        tongSl += (i.slTonKhoThucTe - i.slTonKho);
        tongThanhTien += (i.slTonKhoThucTe - i.slTonKho) * i.donGia;
      } else {
        tongSl += i.slNhap;
        tongThanhTien += i.slNhap * i.donGia;
      }
    })
    this.formData.get("tongSlNhap").setValue(tongSl);
    this.formData.get("tongThanhTien").setValue(tongThanhTien);
  }
}
