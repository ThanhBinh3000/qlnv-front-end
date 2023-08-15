import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import {AddDiemKho, ChiTietThongTinChaoGia} from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
import {DonviService} from "../../../../../../services/donvi.service";


@Component({
  selector: 'app-themmoi-chaogia-uyquyen-muale',
  templateUrl: './themmoi-chaogia-uyquyen-muale.component.html',
  styleUrls: ['./themmoi-chaogia-uyquyen-muale.component.scss']
})
export class ThemmoiChaogiaUyquyenMualeComponent extends Base2Component implements OnInit {
  //base init
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  dataDetail: any[] = [];
  radioValue: string = '01';
  fileDinhKemUyQuyen: any[] = [];
  fileDinhKemMuaLe: any[] = [];
  donGiaRow: any;
  @Output()
  dataTableChange = new EventEmitter<any>();
  @Output()
  dataTableChangeDk = new EventEmitter<any>();
  danhSachCtiet: any[] = [];
  danhSachCtietDtl: any[] = [];
  listDiemKho: any[] = [];
  listChiCuc: any[] = [];
  selected: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private donViService : DonviService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaogiaUyquyenMualeService);
    this.formData = this.fb.group(
      {
        id: [],
        idQdDtl: [],
        namKh: [dayjs().get("year"), [Validators.required]],
        soQd: ['', [Validators.required]],
        maDvi: [''],
        tenDvi: ['', [Validators.required]],
        pthucMuaTrucTiep: [''],
        diaDiemChaoGia: [],
        ngayMkho: [null, [Validators.required]],
        ngayMua: [null, [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        moTaHangHoa: [''],
        trangThai: [STATUS.CHUA_CAP_NHAT],
        tenTrangThai: ['Chưa cập nhật'],
        ghiChuChaoGia: ['']
      }
    );
  }
  rowItem: ChiTietThongTinChaoGia = new ChiTietThongTinChaoGia();
  diemKhoItem: AddDiemKho = new AddDiemKho();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinChaoGia } } = {};
  diemKhoEdit: { [key: string]: { edit: boolean; data: AddDiemKho } } = {};

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
        this.loadDiemKho(),
        this.initForm()
      ])
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
    this.emitDataTable()
    this.emitDataTableDk()
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(id)
        .then(async (res) => {
          const dataDtl = res.data;
          console.log(dataDtl)
          this.danhSachCtiet = dataDtl.children.length > 0 ? dataDtl.children : dataDtl.children2
          this.formData.patchValue({
            idQdDtl: id,
            soQd: dataDtl.hhQdPheduyetKhMttHdr.soQd,
            trangThai: dataDtl.trangThai,
            tenTrangThai: dataDtl.tenTrangThai,
            tenCloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenCloaiVthh,
            cloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.cloaiVthh,
            tenLoaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenLoaiVthh,
            loaiVthh: dataDtl.hhQdPheduyetKhMttHdr.loaiVthh,
            moTaHangHoa: dataDtl.hhQdPheduyetKhMttHdr.moTaHangHoa,
            diaDiemChaoGia: dataDtl.diaDiemChaoGia,
            ngayMkho: dataDtl.ngayMkho,
            ngayMua: dataDtl.ngayMua,
            ghiChuChaoGia: dataDtl.ghiChuChaoGia
          })
          this.radioValue = dataDtl.pthucMuaTrucTiep ? dataDtl.pthucMuaTrucTiep : '01'
          this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
          this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
          // this.danhSachCtiet.forEach(item =>{
          //   item.edit = false
          // })
          console.log(this.danhSachCtiet)
          this.calcTong();
          this.showDetail(event,this.danhSachCtiet[0]);
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  calcTong(): number {
    let totalSum = 0;
    if (this.danhSachCtiet) {
      this.danhSachCtiet.forEach(data => {
        const sum = data.children.reduce((prev, cur) => {
          prev += Number.parseInt(cur.soLuong);
          return prev;
        }, 0);
        totalSum += sum;
      });
    }
    return totalSum;
  }

  idRowSelect: number;
  async showDetail($event, data: any) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selected = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selected = true;
    }
    this.rowItem.donGia = data.donGia
    this.donGiaRow = data.donGia
    if(this.listChiCuc.length > 0){
      this.listDiemKho = this.listChiCuc.find(x => x.maDvi == data.maDvi).children.filter(y => y.type == 'MLK').filter(k => k.maDvi.includes(data.children.filter(i => i.maDiemKho == k.maDvi)))
    }
    this.idRowSelect = data.id;
    this.dataTable = data.listChaoGia
    this.updateEditCache()
    this.updateEditCacheDk()
    await this.spinner.hide();
  }

  addDiemKho(index: any, diemKho: any){
    console.log("diemKho", diemKho)
    if(this.validateDiemKho(index, diemKho)){
      return;
    }
    this.danhSachCtiet[index].children.push(diemKho)
    this.diemKhoItem = new AddDiemKho();
    this.updateListDiemKho(index, diemKho)
    this.emitDataTableDk();
    this.updateEditCacheDk()
  }

  updateListDiemKho(index: any, diemKho: any){
    this.listDiemKho = this.listChiCuc.find(x => x.maDvi == this.danhSachCtiet[index].maDvi).children.filter(y => y.type == 'MLK').filter(k => k.maDvi.includes(this.danhSachCtiet[index].children.filter(i => i.maDiemKho == k.maDvi)))
  }

  validateDiemKho(index: any, diemKho: any): boolean {
    let sum = 0;
    for (let i = 0; i < this.danhSachCtiet[index].children.length; i++) {
      sum += Number.parseInt(this.danhSachCtiet[index].children[i].soLuong)
    }
    sum += Number.parseInt(diemKho.soLuong)
    if(sum > Number.parseInt(this.danhSachCtiet[index].tongSoLuong)){
      this.notification.error(MESSAGE.ERROR, MESSAGE.ADD_DIEM_KHO_ERROR);
      return true;
    }
    return false;
  }

  handleChangeDiemKho(dataTable: any, diemKho: any){
    diemKho.idDiaDiem = dataTable.id
    diemKho.donGia = dataTable.donGia
    diemKho.tenDiemKho = this.listDiemKho.find(x => x.maDvi == diemKho.maDiemKho).tenDvi
  }

  showDsChaoGia(id: any){

  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen.filter(
        (x) => x.id !== data.id,
      );
      this.fileDinhKemMuaLe = this.fileDinhKemMuaLe.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  hoanThanhCapNhat() {
    // if (this.listOfData.length == 0) {
    //   this.notification.error(MESSAGE.ERROR, "Không thể hoàn thành cập nhập, chi tiết thông tin đấu giá không được để trống");
    //   return
    // }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhập ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT
          }
          let res = await this.chaogiaUyquyenMualeService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.spinner.hide();
            this.loadDetail(this.idInput);
            this.goBack()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }


  async save() {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      body.children = this.danhSachCtietDtl;
      body.danhSachCtiet = this.danhSachCtiet;
      body.pthucMuaTrucTiep = this.radioValue;
      body.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen;
      body.fileDinhKemMuaLe = this.fileDinhKemMuaLe;
      let res = await this.chaogiaUyquyenMualeService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        await this.loadDetail(this.idInput)
        this.goBack()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  addRow(): void {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.rowItem.idQdPdSldd = this.idRowSelect;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.danhSachCtiet.forEach((itemA) => {
      const itemsB = this.dataTable.filter((item) => item.idQdPdSldd === itemA.id);
      if (itemsB.length > 0) {
        itemA.listChaoGia = [];
        itemA.listChaoGia.push(...itemsB);
      }
    });
    this.rowItem = new ChiTietThongTinChaoGia();
    this.rowItem.donGia = this.donGiaRow
    this.emitDataTable();
    this.updateEditCache()
  }

  clearItemRow() {
    // let soLuong = this.rowItem.soLuong;
    this.rowItem = new ChiTietThongTinChaoGia();
    // this.rowItem.soLuong = soLuong;
    this.rowItem.id = null;
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }
  emitDataTableDk() {
    this.dataTableChangeDk.emit(this.danhSachCtiet);
  }

  deleteRow(index: any) {
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
        } catch (e) {
          console.log('error', e);
        }
      },
    });
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

  updateEditCacheDk(): void {
    if (this.danhSachCtiet) {
      this.danhSachCtiet.forEach((item, index) => {
        this.diemKhoEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  startEditDk(index1: number, index2: number) {
    this.diemKhoEdit[index1].data.children[index2].edit = true
  }

  cancelEditDk(index1: number, index2: number): void {
    this.diemKhoEdit[index1].data.children[index2].edit = false
  }

  saveEditDk(index1: number, index2: number): void {
    if(this.validateDiemKho(index1, index2)){
      return;
    }
    Object.assign(this.danhSachCtiet[index1], this.diemKhoEdit[index1].data);
    this.diemKhoEdit[index1].data.children[index2].edit = false
  }

  clearItemRowDk() {
    this.diemKhoItem = new AddDiemKho();
    this.diemKhoItem.id = null;
  }

  calcTongThanhTien(index: any) {
    if (this.danhSachCtiet) {
      let sum = 0
      for (let i = 0; i < this.danhSachCtiet[index].children.length; i++) {
        sum += this.danhSachCtiet[index].children[i].soLuong;
      }
      return sum;
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.danhSachCtiet.forEach((itemA) => {
      const itemsB = this.dataTable.filter((item) => item.idQdPdSldd === itemA.id);
      if (itemsB.length > 0) {
        itemA.listChaoGia = [];
        itemA.listChaoGia.push(...itemsB);
      }
    });
    this.dataEdit[idx].edit = false;
  }


  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }


  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
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
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          }
          else {
            if (!type) {
              if (!this.rowItem.fileDinhKems) {
                this.rowItem.fileDinhKems = new FileDinhKem();
              }
              this.rowItem.fileDinhKems.fileName = resUpload.filename;
              this.rowItem.fileDinhKems.fileSize = resUpload.size;
              this.rowItem.fileDinhKems.fileUrl = resUpload.url;
              this.rowItem.fileDinhKems.idVirtual = new Date().getTime();
            } else {
              // if (!type.fileDinhKem) {
              //   type.fileDinhKem = new FileDinhKem();
              // }
              type.fileDinhKems.fileName = resUpload.filename;
              type.fileDinhKems.fileSize = resUpload.size;
              type.fileDinhKems.fileUrl = resUpload.url;
              type.fileDinhKems.idVirtual = new Date().getTime();
            }

          }
        });
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  isDisable(): boolean {
    if ((this.formData.value.trangThai == STATUS.CHUA_CAP_NHAT || this.formData.value.trangThai == STATUS.DANG_CAP_NHAT) && this.userService.isCuc()) {
      return false
    } else {
      return true
    }
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
              ...element.children
            ]
            this.listDiemKho = this.listDiemKho.filter(i => i.type != "PB");
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
}
