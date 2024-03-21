import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Validators} from "@angular/forms";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {ChiTietThongTinBanTrucTiepChaoGia} from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {saveAs} from 'file-saver';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {THONG_TIN_BAN_TRUC_TIEP} from "../../../../../../constants/status";
import {AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-them-moi-thong-tin-ban-truc-tiep',
  templateUrl: './them-moi-thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-thong-tin-ban-truc-tiep.component.scss']
})
export class ThemMoiThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Output() showListEvent = new EventEmitter<any>();
  @Output() dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  amount = {...AMOUNT_NO_DECIMAL};
  TRUC_TIEP = THONG_TIN_BAN_TRUC_TIEP
  templateNameVt = "Thông tin bán trực tiếp chào giá vật tư";
  templateNameLt = "Thông tin bán trực tiếp chào giá lương thực";
  listOfData: any[] = [];
  showFromTT: boolean = false;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listToChucCaNhan: any[] = [];
  filteredListToChucCaNhan: any[] = [];
  idDviDtl: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group(
      {
        id: [],
        idDtl: [],
        namKh: [],
        soQdPd: [''],
        soQdDc: [''],
        maDvi: [''],
        tenDvi: [''],
        pthucBanTrucTiep: [THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA],
        diaDiemChaoGia: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        trangThai: [''],
        tenTrangThai: [''],
        soQdPdKq: [''],
        ghiChuChaoGia: [''],
        loaiHinhNx: [''],
        tenLoaiHinhNx: [''],
        kieuNx: [''],
        tenKieuNx: [''],
        tgianDkienTu: [''],
        tgianDkienDen: [''],
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.idInput > 0) {
        await this.loadDetail(this.idInput)
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    try {
      await this.spinner.show();
      if (id <= 0) return;
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idDtl: data.id,
        soQdPd: data.soQdPd,
        soQdDc: data.soQdDc,
        maDvi: data.maDvi,
        tenDvi: data.tenDvi,
        diaDiemChaoGia: data.diaDiemChaoGia,
        loaiHinhnx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        tgianDkienTu: data.tgianDkienTu,
        tgianDkienDen: data.tgianDkienDen,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        ghiChuChaoGia: data.ghiChuChaoGia,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
      })
      if (data.pthucBanTrucTiep) {
        this.formData.patchValue({
          pthucBanTrucTiep: data.pthucBanTrucTiep.toString()
        });
      }
      this.dataTable = data.children.map(item => {
        return {...item, expandSetAll: true};
      });
      if (this.dataTable && this.dataTable.length > 0) {
        await this.selectRow(this.dataTable.flatMap(item => item.children)[0]);
      }
      this.fileDinhKem = data.fileDinhKem;
      await this.loadToChucCaNhan();
    } catch (e) {
      console.error('Error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadToChucCaNhan() {
    this.listToChucCaNhan = [];
    let res = await this.chaoGiaMuaLeUyQuyenService.getToChucCaNhan();
    if (res.msg == MESSAGE.SUCCESS) {
      const uniqueKeyMap = new Map();
      for (const obj of res.data) {
        const key = `${obj.tochucCanhan}${obj.mst}`;
        if (uniqueKeyMap.has(key)) {
          const existingObj = uniqueKeyMap.get(key);
          existingObj.someProperty += obj.someProperty;
        } else {
          uniqueKeyMap.set(key, obj);
        }
      }
      this.listToChucCaNhan = Array.from(uniqueKeyMap.values());
      this.filteredListToChucCaNhan = cloneDeep(this.listToChucCaNhan)
    }
  }

  filterToChucCaNhan(event: any): void {
    const keyword = event.target.value;
    this.filteredListToChucCaNhan = this.listToChucCaNhan.filter(
      item => item.tochucCanhan.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  changeToChucCaNhan(event?: any, index?: number) {
    if (event.nzValue !== '') {
      const selectedToChuc = this.listToChucCaNhan.find(item => item.tochucCanhan === event.nzValue);
      if (selectedToChuc) {
        const target = index >= 0 ? this.dataEdit[index].data : this.rowItem;
        target.mst = selectedToChuc.mst;
        target.diaDiemChaoGia = selectedToChuc.diaDiemChaoGia;
        target.sdt = selectedToChuc.sdt;
      }
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
        fileDinhKem: this.fileDinhKem,
      };
      body.id = 0;
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidForm();
      const body = {
        ...this.formData.value,
        children: this.dataTable,
        fileDinhKem: this.fileDinhKem,
      };
      body.id = 0;
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  rowItem: ChiTietThongTinBanTrucTiepChaoGia = new ChiTietThongTinBanTrucTiepChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  onChangeThanhTien() {
    this.rowItem.thanhTien = this.rowItem.donGia * this.rowItem.soLuong
  }

  addRow(): void {
    if (!this.validateSoLuong()) {
      return;
    }
    if (!this.listOfData) {
      this.listOfData = [];
    }
    this.rowItem.idDviDtl = this.idDviDtl ? this.idDviDtl : undefined;
    const targetChild = this.dataTable.flatMap((item) => item.children).find((child) => child.id === this.rowItem.idDviDtl);
    if (targetChild) {
      targetChild.children = [...targetChild.children, this.rowItem];
    }
    this.listOfData.push(this.rowItem);
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    this.emitDataTable();
    this.updateEditCache();
  }

  clearItemRow() {
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    this.rowItem.id = null;
  }

  emitDataTable() {
    this.dataTableChange.emit(this.listOfData);
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
          this.listOfData.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.error('Error:', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.listOfData) {
      this.listOfData.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.listOfData[stt]},
      edit: false
    };
  }

  saveEdit(idx: number): void {
    const updatedData = this.dataEdit[idx].data;
    Object.assign(this.listOfData[idx], updatedData);
    this.dataEdit[idx].edit = false;
  }

  onChangeThanhTienEdit(index) {
    this.dataEdit[index].data.thanhTien = this.dataEdit[index].data.soLuong * this.dataEdit[index].data.donGia
  }

  validateSoLuong(): boolean {
    let isValid = true;
    if (!this.rowItem.tochucCanhan || !this.rowItem.mst || !this.rowItem.sdt || !this.rowItem.ngayChaoGia || !this.rowItem.soLuong || !this.rowItem.donGia) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      isValid = false;
      return isValid;
    }
    const tgianMoKho = new Date(this.formData.value.tgianDkienTu);
    const tgianDongKho = new Date(this.formData.value.tgianDkienDen);
    const tgianChaoGia = new Date(this.rowItem.ngayChaoGia);
    if (tgianChaoGia < tgianMoKho || tgianChaoGia > tgianDongKho) {
      this.notification.error(MESSAGE.WARNING, 'Ngày chào giá phải lớn hơn thời gian mở cửa kho bán trực tiếp và nhỏ hơn thời hạn bán trực tiếp');
      isValid = false
    }
    for (const data of this.dataTable) {
      for (const item of data.children) {
        if (this.idDviDtl === item.id) {
          if (this.rowItem.soLuong > item.soLuongDeXuat) {
            const errorMessage = `Số lượng chào giá phải bé hơn hoặc bằng số lượng đề xuất là ${item.soLuongDeXuat.toLocaleString()} (${item.donViTinh})!`;
            this.notification.error(MESSAGE.WARNING, errorMessage);
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  async getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (!fileList) {
      return;
    }
    const itemFile = {
      name: fileList[0].name,
      file: event.target.files[0] as File,
    };
    try {
      const resUpload = await this.uploadFileService.uploadFile(itemFile.file, itemFile.name);
      if (item) {
        item.fileName = resUpload.filename;
        item.fileSize = resUpload.size;
        item.fileUrl = resUpload.url;
      } else {
        const targetObject = type ? type : this.rowItem;
        if (!targetObject.fileDinhKems) {
          targetObject.fileDinhKems = new FileDinhKem();
        }
        targetObject.fileDinhKems.fileName = resUpload.filename;
        targetObject.fileDinhKems.fileSize = resUpload.size;
        targetObject.fileDinhKems.fileUrl = resUpload.url;
        targetObject.fileDinhKems.idVirtual = new Date().getTime();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  async selectRow(data: any) {
    this.dataTableAll = this.dataTable.flatMap(item => item.children);
    if (!data.selected) {
      this.dataTableAll.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.dataTableAll.findIndex(child => child.id == data.id);
      this.listOfData = this.dataTableAll[findndex].children;
      this.idDviDtl = this.dataTableAll[findndex].id;
      this.showFromTT = true;
      this.emitDataTable();
      this.updateEditCache();
    }
  }

  setValidForm() {
    const formDataControls = this.formData.controls;
    formDataControls["soQdPd"].setValidators([Validators.required]);
    formDataControls["tgianDkienTu"].setValidators([Validators.required]);
    formDataControls["tgianDkienDen"].setValidators([Validators.required]);
    if (this.formData.value.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA) {
      formDataControls["diaDiemChaoGia"].setValidators([Validators.required]);
    } else {
      formDataControls["diaDiemChaoGia"].clearValidators();
    }
    Object.keys(formDataControls).forEach(field => {
      formDataControls[field].updateValueAndValidity();
    });
  }
}
