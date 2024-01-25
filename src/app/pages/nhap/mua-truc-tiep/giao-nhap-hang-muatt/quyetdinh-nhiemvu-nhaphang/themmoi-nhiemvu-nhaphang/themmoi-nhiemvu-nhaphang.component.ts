import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from '../../../../../../services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { QuyetDinhGiaoNvNhapHangService } from '../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { HopdongPhulucHopdongService } from '../../../../../../services/hopdong-phuluc-hopdong.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Validators
} from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat, ThongTinDiaDiemNhap } from 'src/app/models/QuyetDinhNhapXuat';
import { DonviService } from 'src/app/services/donvi.service';
import {FILETYPE} from "../../../../../../constants/fileType";
import {QuyetDinhPheDuyetKeHoachMTTService} from "../../../../../../services/quyet-dinh-phe-duyet-ke-hoach-mtt.service";
import {ChaogiaUyquyenMualeService} from "../../../../../../services/chaogia-uyquyen-muale.service";
import {NzSelectSizeType} from "ng-zorro-antd/select";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
@Component({
  selector: 'app-themmoi-nhiemvu-nhaphang',
  templateUrl: './themmoi-nhiemvu-nhaphang.component.html',
  styleUrls: ['./themmoi-nhiemvu-nhaphang.component.scss']
})
export class ThemmoiNhiemvuNhaphangComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  taiLieuDinhKemList: any[] = [];
  type: string = '';
  quyetDinhNhapXuat: QuyetDinhNhapXuat = new QuyetDinhNhapXuat();
  optionsDonVi: any[] = [];
  optionsFullDonVi: any[] = [];
  dsQuyetDinhNhapXuatDetailClone: Array<DetailQuyetDinhNhapXuat> = [];
  isAddQdNhapXuat: boolean = false;
  isChiTiet: boolean = false;
  radioValue: string = '01';
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  today = new Date();
  listNam: any[] = [];
  listFileDinhKem: any[] = [];
  canCuPhapLy: any[] = [];

  STATUS = STATUS
  maQdSuffix: string;

  listHopDong: any[] = [];

  listUyQuyen: any[] = [];

  dataTable: any[] = [];

  rowItem: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();
  rowItemEdit: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listFile: any[] = []
  listNhaKhoEdit: any[] = [];
  listNganKhoEdit: any[] = [];
  listNganLoEdit: any[] = [];

  listOfOption: Array<{ label: string; value: string }> = [];
  size: NzSelectSizeType = 'default';
  singleValue = 'a10';
  multipleValue = ['a10', 'c12'];
  dsHongDong = [];
  soLuong: number = 0;
  previewName: string = 'mtt_qd_giao_nhiem_vu_nhap_hang';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private hopdongPhulucHopdongService: HopdongPhulucHopdongService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private quyetDinhPheDuyetKeHoachMTTService : QuyetDinhPheDuyetKeHoachMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvNhapHangService);
    this.formData = this.fb.group({
      id: [null],
      soQd: [''],
      ngayQd: [null],
      tenHd: [''],
      idHd: [''],
      soHd: [''],
      idQdPdKh: [''],
      soQdPdKh: [''],
      idQdPdKq: [''],
      soQdPdKq: [''],
      trichYeu: [],
      namNhap: [dayjs().get('year')],
      tenDvi: [''],
      maDvi: [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      soLuong: [],
      donViTinh: [''],
      tgianNkho: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      lyDoTuChoi: [''],
      diaDiemGiaoNhan: [''],
      ngayKyHd: [''],
      loaiQd: [''],
      trangThaiDtl: [''],
      fileDinhKem: [FileDinhKem],
    })
  }

  async ngOnInit() {
    this.spinner.show()
    let dayNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayNow - i,
        text: dayNow - i,
      });
    }
    this.userInfo = this.userService.getUserLogin();
    this.maQdSuffix = "/" + this.userInfo.MA_QD;
    await Promise.all([
      await this.getListHopDong(),
      await this.getListCanCuUyQuyen(),
      await this.loadDiemKho()
    ])

    if (this.id > 0) {
      await this.loadThongTinQdNhapXuatHang(this.id);
    } else {
      this.initForm();
    }
    this.spinner.hide();
  }

  editRow (i, y){
    this.dataTable[i].children.forEach(i => {
      i.edit = false;
    })
    this.dataTable[i].children[y].edit = true;
    this.rowItemEdit = cloneDeep(this.dataTable[i].children[y])
    this.changeDiemKho(true)
  }

  saveEdit (i, y){
      this.dataTable[i].children[y] = cloneDeep(this.rowItemEdit);
    if(this.validatorDdiemNhap(i,true)){
      this.dataTable[i].children[y].edit = false;
    }
  }

  cancelEdit (i, y){
    this.dataTable[i].children[y].edit = false;
    this.rowItemEdit = this.dataTable[i].children[y];
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh
    });
  }

  async getListHopDong() {
    let body = {
      "trangThai": STATUS.DA_KY,
    }
    let res = await this.hopdongPhulucHopdongService.dsTaoQd(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHopDong = res.data.content.filter(x => x.maDvi.includes(this.userInfo.MA_DVI));
      console.log(this.listHopDong, "lisst hd")
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogHopDong() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Ngày ký', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soHd', 'tenHd', 'ngayKy', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.spinner.show();
        let res = await this.hopdongPhulucHopdongService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          console.log(res.data)
          this.dataTable = [];
          const data = res.data;
          this.formData.patchValue({
            soHd: data.soHd,
            tenHd: data.tenHd,
            idHd: data.id,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.dviTinh,
            idQdPdKq: data.idQdKq,
            soQdPdKq: data.soQd,
            soLuong: data.soLuong,
            tgianNkho: data.tgianKthuc,
            ngayKyHd: data.ngayKy,
            trichYeu: data.trichYeu
          })
          this.dataTable = data.children
          console.log(this.dataTable, "this.dataTable")
          this.calcTong();
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
        this.spinner.hide();
      }
    });

  }

  convertDataHopDongToDataDetail(hopDong) {
    hopDong.diaDiemGiaoNhan.forEach(async (item) => {
      let dataDetail = {
        maDvi: item.maDvi,
        tenDvi: item.tenDvi,
        loaiVthh: hopDong.loaiVthh,
        tenLoaiVthh: hopDong.tenLoaiVthh,
        cloaiVthh: hopDong.cloaiVthh,
        tenCloaiVthh: hopDong.tenCloaiVthh,
        donViTinh: hopDong.donViTinh,
        soLuong: item.soLuong,
        tgianNkho: hopDong.tgianNkho,
        trangThai: STATUS.CHUA_CAP_NHAT,
        tenTrangThai: 'Chưa cập nhật'
      }
      this.dataTable.push(dataDetail);
    })
  }

  async getListCanCuUyQuyen() {
    let body = {
      "trangThai": STATUS.HOAN_THANH_CAP_NHAT,
      "pthucMuaTrucTiep": "'02', '03'",
      "maDvi": this.userInfo.MA_DVI
    }
    let res = await this.chaogiaUyquyenMualeService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listUyQuyen = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogCanCuUyQuyen() {
    console.log("huhu1123");
    if (this.isChiTiet) {
      return;
    }

    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Căn cứ ủy quyền, chào giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listUyQuyen,
        dataHeader: ['Số QĐ PDKH mua trực tiếp ', 'Ngày ký', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayPduyet', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {

      if (data) {
        this.spinner.show();
        let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataTable = [];
          const data = res.data;
          console.log(data, "alo123");
          this.formData.patchValue({
            soQdPdKh: data.soQd,
            idQdPdKh: data.idQdHdr,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh,
            soLuong: data.tongSoLuong,

          })
          if (data.children.length > 0 || data.children2.length > 0) {
            this.dataTable = data.children.length > 0 ? data.children : data.children2
            console.log(this.dataTable, "this.dataTable")
            this.calcTong();
          }
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
        this.spinner.hide();
      }
    });

  }

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
    this.quyetDinhNhapXuat.fileDinhKems = this.quyetDinhNhapXuat.fileDinhKems.filter(
      (x) => x.id !== data.id,
    );

  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.uploadFileService
        .uploadFile(event.file, event.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          this.quyetDinhNhapXuat.fileDinhKems.push(fileDinhKem);
          this.taiLieuDinhKemList.push(item);
        });
    }
  }

  checkDataExistQdNhapXuat(quyetDinhNhapXuat: DetailQuyetDinhNhapXuat) {
    if (this.quyetDinhNhapXuat.detail) {
      let indexExist = this.quyetDinhNhapXuat.detail.findIndex(
        (x) => x.maDvi == quyetDinhNhapXuat.maDvi,
      );
      if (indexExist != -1) {
        this.quyetDinhNhapXuat.detail.splice(indexExist, 1);
      }
    } else {
      this.quyetDinhNhapXuat.detail = [];
    }
    this.quyetDinhNhapXuat.detail = [
      ...this.quyetDinhNhapXuat.detail,
      quyetDinhNhapXuat,
    ];
    this.quyetDinhNhapXuat.detail.forEach((lt, i) => {
      lt.stt = i + 1;
    });

  }
  clearNew() {
    this.isAddQdNhapXuat = false;
    // this.newObjectQdNhapXuat();
  }

  startEdit(index: number) {
    this.dsQuyetDinhNhapXuatDetailClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.quyetDinhNhapXuat.detail =
          this.quyetDinhNhapXuat?.detail.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.quyetDinhNhapXuat?.detail.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsQuyetDinhNhapXuatDetailClone = cloneDeep(
          this.quyetDinhNhapXuat.detail,
        );
        // this.loadData();
      },
    });
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      // this.optionsDonVi = [];
    } else {
      this.optionsDonVi = this.optionsFullDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet)
    if(this.checkListHopDong()){
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    await this.spinner.show();
    let body = this.formData.value;
    console.log(body, "body");
    body.ngayQd = this.formData.value.ngayQd != null ? dayjs(this.formData.value.ngayQd).format('YYYY-MM-DD') + " 00:00:00" : null
    body.soQd = this.formData.get('soQd').value + this.maQdSuffix;
    body.loaiQd = this.radioValue
    body.hhQdGiaoNvNhangDtlList = this.dataTable;
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.canCuPhapLy.length > 0) {
      this.canCuPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    body.fileDinhKems = this.listFile;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhGiaoNvNhapHangService.update(body);
    } else {
      res = await this.quyetDinhGiaoNvNhapHangService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        await this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.redirectQdNhapXuat();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.redirectQdNhapXuat();
        }
        await this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      await this.spinner.hide();
    }
  }
  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      if (this.formData.value.trangThai == STATUS.DU_THAO) {
        this.formData.controls["soQd"].setValidators([Validators.required]);
        this.formData.controls["ngayQd"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soQd"].clearValidators();
        this.formData.controls["ngayQd"].clearValidators();
      }
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
    }
  }

  checkListHopDong(){
    if(this.listHopDong.length > this.dsHongDong.length){
      this.notification.error(MESSAGE.ERROR, 'Phải chọn tất cả các hợp đồng của cục trước khi tạo QĐ');
      return true;
    }
  }


  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  async loadThongTinQdNhapXuatHang(id: number) {
    await this.quyetDinhGiaoNvNhapHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          console.log(data, "hello");
          // let sum = 0;
          // data.hhQdGiaoNvNhangDtlList.forEach(item =>{
          //   sum = item.children.reduce((prev, cur) => {
          //     prev += cur.soLuong;
          //     return prev;
          //   }, 0);
          // })
          let hhQdGiaoNvNhangDtl = null;
          if(this.userService.isChiCuc()){
            hhQdGiaoNvNhangDtl = data.hhQdGiaoNvNhangDtlList.find(x => x.maDvi.includes(this.userInfo.MA_DVI))
          }
          this.formData.patchValue({
            id: data.id,
            namNhap: data.namNhap,
            soQd: data.soQd?.split('/')[0],
            tenDvi: data.tenDvi,
            maDvi: data.maDvi,
            ngayQd: data.ngayQd,
            loaiQd: data.loaiQd,
            soQdPdKh: data.soQdPdKh,
            trichYeu: data.trichYeu,
            tenLoaiVthh: data.tenLoaiVthh,
            loaiVthh: data.loaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            cloaiVthh: data.cloaiVthh,
            trangThai: data.trangThai,
            trangThaiDtl: hhQdGiaoNvNhangDtl?.trangThai,
            tenTrangThai: data.tenTrangThai,
            lyDoTuChoi: data.ldoTuchoi,
            idHd: data.idHd,
            // soLuong: this.userService.isChiCuc() ? data.hhQdGiaoNvNhangDtlList.find(x => x.maDvi.includes(this.userInfo.MA_DVI)).soLuong : sum,
            donViTinh: data.donViTinh,
            soHd: data.soHd,
            tenHd: data.tenHd,
            tgianNkho: data.tgianNkho,
          });
          if(data.soHd){
            this.dsHongDong = data.soHd.split(",")
          }
          console.log(this.dsHongDong);
          this.radioValue = data.loaiQd
          if (this.userService.isCuc()) {
            this.dataTable = data.hhQdGiaoNvNhangDtlList
          } else {
            this.dataTable = data.hhQdGiaoNvNhangDtlList.filter(x => x.maDvi.includes(this.userInfo.MA_DVI));
          }
          this.calcTong();
          console.log(this.dataTable, "this.dataTable")
          if (data.fileDinhKems.length > 0) {
            data.fileDinhKems.forEach(item => {
              if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                this.listFileDinhKem.push(item)
              } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                this.canCuPhapLy.push(item)
              }
            })
          }
          this.typeVthh = data.loaiVthh;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
  }

  pheDuyet() {
    if (this.formData.invalid) {
      this.spinner.hide()
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mesg = 'Bạn có muốn duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.BAN_HANH;
        mesg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhGiaoNvNhapHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
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
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhGiaoNvNhapHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
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

  huyBo() {
    this.showListEvent.emit();
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56],
  });

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themDiaDiemNhap(indexTable?) {
    debugger
    if (this.validatorDdiemNhap(indexTable) && this.validateButtonThem('ddiemNhap')) {
      this.dataTable[indexTable].children = [...this.dataTable[indexTable].children, this.rowItem]
      this.rowItem = new ThongTinDiaDiemNhap();
    }
  }

  themChiCuc() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  validatorDdiemNhap(indexTable, isEdit?): boolean {
    let soLuong = 0;
    debugger
    const sum = this.dataTable[indexTable].children.reduce((prev, cur) => {
      prev += cur.soLuong;
      return prev;
    }, 0);
    if(isEdit){
      soLuong += sum
    }else{
      soLuong += this.rowItem.soLuong + sum
    }
    if (soLuong > +this.formData.value.soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }
    return true
  }

  calcTong() {
    if (this.dataTable) {
      let sum = 0;
      this.dataTable.forEach(item =>{
        item.children.forEach(x =>{
          sum += x.soLuong
        })
      })
      this.formData.patchValue({
        soLuong: sum
      })
      return sum;
    }
  }

  calcTongByName(index) {
    if (this.dataTable) {
      let sum = 0;
      const sumChild = this.dataTable[index].children.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      sum += sumChild
      return sum;
    }
  }

  calcTongChil() {
    if (this.dataTable) {
      let sum = 0;
      this.dataTable.forEach(item =>{
        item.children.forEach(x =>{
          sum += x.soLuong
        })
      })
      return sum;
    }
  }

  validateButtonThem(typeButton): boolean {
    if (typeButton == 'ddiemNhap') {
      if (this.rowItem.maDiemKho && this.rowItem.maNhaKho && this.rowItem.maNganKho && this.rowItem.soLuong > 0) {
        return true
      } else {
        return false;
      }
    } else {
      if (this.rowItem.maChiCuc && this.rowItem.soLuong > 0) {
        return true
      } else {
        return false;
      }
    }

  }


  xoaDiaDiemNhap(indexTable, indexRow?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        // if (indexRow) {
        //   this.dataTable[indexTable].diaDiemNhapList.splice(indexRow, 1);
        // } else {
        //   this.dataTable.splice(indexTable, 1);
        // }
        this.dataTable[indexTable].children.splice(indexRow, 1);
      },
    });
  }

  clearDiaDiemNhap() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children.filter(x => x.type == 'MLK')
            ]
            console.log(this.listDiemKho, "diem kho")
          }
          if (element && element.capDvi == '2' && element.children) {
            this.listChiCuc = [
              ...this.listChiCuc,
              ...element.children
            ]
          }
        });
      };
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(isEdit?) {
    if (isEdit) {
      // this.listNhaKhoEdit = [];
      // this.listNganKhoEdit = [];
      // this.listNganLoEdit = [];
      // this.rowItemEdit.maNhaKho = null;
      // this.rowItemEdit.maNganKho = null;
      // this.rowItemEdit.maLoKho = null;
      let diemKho = this.listDiemKho.filter(x => x.key == this.rowItemEdit.maDiemKho);
      if (diemKho && diemKho.length > 0) {
        this.listNhaKhoEdit = diemKho[0].children;
        // this.rowItemEdit.tenDiemKho = diemKho[0].tenDvi;
        // this.rowItemEdit.soLuongDiemKho = diemKho[0].soLuongDiemKho;
      }
    } else {
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listNganLo = [];
      this.rowItem.maNhaKho = null;
      this.rowItem.maNganKho = null;
      this.rowItem.maLoKho = null;
      let diemKho = this.listDiemKho.filter(x => x.key == this.rowItem.maDiemKho);
      if (diemKho && diemKho.length > 0) {
        this.listNhaKho = diemKho[0].children;
        this.rowItem.tenDiemKho = diemKho[0].tenDvi;
        this.rowItem.soLuongDiemKho = diemKho[0].soLuongDiemKho;
      }
    }
  }

  changeNhaKho(isEdit?) {
    if (isEdit) {
      this.listNganKhoEdit = [];
      this.listNganLoEdit = [];
      this.rowItemEdit.maNganKho = null;
      this.rowItemEdit.maLoKho = null;
      let nhaKho = this.listNhaKhoEdit.filter(x => x.key == this.rowItemEdit.maNhaKho);
      if (nhaKho && nhaKho.length > 0) {
        this.listNganKhoEdit = nhaKho[0].children;
        this.rowItemEdit.tenNhaKho = nhaKho[0].tenDvi
      }
    } else {
      this.listNganKho = [];
      this.listNganLo = [];
      this.rowItem.maNganKho = null;
      this.rowItem.maLoKho = null;
      let nhaKho = this.listNhaKho.filter(x => x.key == this.rowItem.maNhaKho);
      if (nhaKho && nhaKho.length > 0) {
        this.listNganKho = nhaKho[0].children;
        this.rowItem.tenNhaKho = nhaKho[0].tenDvi
      }
    }
  }

  changeNganKho(isEdit?) {
    if (isEdit) {
      this.listNganLoEdit = [];
      this.rowItemEdit.maLoKho = null;
      let nganKho = this.listNganKhoEdit.filter(x => x.key == this.rowItemEdit.maNganKho);
      if (nganKho && nganKho.length > 0) {
        this.listNganLoEdit = nganKho[0].children;
        this.rowItemEdit.tenNganKho = nganKho[0].tenDvi
      }
    } else {
      this.listNganLo = [];
      this.rowItem.maLoKho = null;
      let nganKho = this.listNganKho.filter(x => x.key == this.rowItem.maNganKho);
      if (nganKho && nganKho.length > 0) {
        this.listNganLo = nganKho[0].children;
        this.rowItem.tenNganKho = nganKho[0].tenDvi
      }
    }
  }

  changeLoKho(isEdit?) {
    if (isEdit) {
      let loKho = this.listNganLoEdit.filter(x => x.key == this.rowItemEdit.maLoKho);
      if (loKho && loKho.length > 0) {
        this.rowItemEdit.tenLoKho = loKho[0].tenDvi
      }
    } else {
      let loKho = this.listNganLo.filter(x => x.key == this.rowItem.maLoKho);
      if (loKho && loKho.length > 0) {
        this.rowItem.tenLoKho = loKho[0].tenDvi
      }
    }
  }

  async saveDdiemNhap(statusSave, hoanThanh?) {
    if(!this.validatorDdiemNhap(0, true)){
      return;
    }
    let checkTable = false;
    let msg = '';
    console.log(this.dataTable, "1")
    this.dataTable.forEach(item => {
      item.trangThai = statusSave
      item.children.forEach(x =>{
        if(x.maLoKho == null){
          checkTable = true
        }
      })
    })
    if(hoanThanh){
      msg = 'Bạn có muốn hoàn thành cập nhật'
    }else{
      msg = 'Bạn có lưu cập nhật'
    }
    console.log(this.dataTable, "2")
    if(checkTable){
      this.notification.error(MESSAGE.ERROR, 'Bạn phải hoàn thành cập nhật lô kho');
      return;
    }

    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        try {
          let body = this.formData.value;
          body.hhQdGiaoNvNhangDtlList = this.dataTable
          let res = await this.quyetDinhGiaoNvNhapHangService.updateDdiemNhap(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  isDisableForm() {
    if ((this.isViewDetail || (!this.isViewDetail && this.userService.isAccessPermisson('NHDTQG_PTMTT_QDGNVNH_DUYET_TP') || !this.isViewDetail && this.userService.isAccessPermisson('NHDTQG_PTMTT_QDGNVNH_DUYET_LDC')) ) && (this.formData.value.trangThai == STATUS.BAN_HANH || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.CHO_DUYET_TP)) {
      return true
    } else {
      return false;
    }
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  async handleTagValueChange() {
    console.log('Tag value changed:', this.dsHongDong);
    let body = {
      ids: this.dsHongDong
    }
    let res = await this.hopdongPhulucHopdongService.dsHDongByListId(body);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res.data)
      let soHd = ''
      let tenHd = ''
      let idHd = ''
      let listChildren = []
      res.data.forEach(item =>{
        // this.dataTable = [];
        soHd = soHd + item.soHd + ","
        tenHd = tenHd + item.tenHd + ","
        idHd = idHd + item.id + ","
        this.formData.patchValue({
          soHd: soHd.substring(0, soHd.length - 1),
          tenHd: tenHd.substring(0, tenHd.length - 1),
          idHd: idHd.substring(0, idHd.length - 1),
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          tenLoaiVthh: item.tenLoaiVthh,
          tenCloaiVthh: item.tenCloaiVthh,
          donViTinh: item.dviTinh,
          idQdPdKq: item.idQdKq,
          soQdPdKq: item.soQd,
          soLuong: this.formData.value.soLuong += item.soLuong,
          tgianNkho: item.tgianKthuc,
          ngayKyHd: item.ngayKy,
          trichYeu: item.trichYeu
        })
        listChildren.push(...item.children);
      })
      this.dataTable = listChildren.filter((value, index, self) => self.indexOf(value) === index);
      console.log(this.dataTable, 3333)
      this.calcTong();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
  }
}
