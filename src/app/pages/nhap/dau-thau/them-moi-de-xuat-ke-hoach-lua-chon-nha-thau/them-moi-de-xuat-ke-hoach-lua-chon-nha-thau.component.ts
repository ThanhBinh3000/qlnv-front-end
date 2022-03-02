import { UploadComponent } from './../../../../components/dialog/dialog-upload/upload.component';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { Router } from '@angular/router';

interface ItemData {
  id: string;
  stt: string;
  goiThau: string;
  soLuong: string;
  diaDiem: string;
  donGia: string;
  thanhTien: string;
  bangChu: string;
}
@Component({
  selector: 'them-moi-de-xuat-ke-hoach-lua-chon-nha-thau',
  templateUrl: './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component.html',
  styleUrls: ['./them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component.scss'],
})
export class ThemMoiDeXuatKeHoachLuaChonNhaThauComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  @Output()
  messageEvent = new EventEmitter<boolean>();
  nzTreeComponent!: NzTreeComponent;
  visible = false;
  nodes: any = [];
  nodeDetail: any;
  listDonViDuoi = [];
  cureentNodeParent: any = [];
  datasNguoiDung: any = [];
  nodeSelected: any = [];
  listHTDV: any = [];
  listKPB: any = [];
  detailDonVi: FormGroup;
  noParent = true;
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };

  formData: FormGroup;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    this.i++;
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        stt: `${this.i}`,
        goiThau: '',
        soLuong: '',
        diaDiem: '',
        donGia: '',
        thanhTien: '',
        bangChu: '',
      },
    ];
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }

  ngOnInit(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        stt: `${this.i}`,
        goiThau: 'Số 1',
        soLuong: `1.330`,
        diaDiem: `Việt trì, Phú thọ`,
        donGia: `13.020`,
        thanhTien: ` 17.316.600.000`,
        bangChu: `Mười bảy tỷ ba trăm mười sáu trăm triệu`,
      },
    ];
  }

  taiLieuDinhKem() {
    this.modal.create({
      nzTitle: 'Thêm mới căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        // totalRecord: this.totalRecord,
        // date: event,
      },
    });
  }
  back(value: boolean) {
    this.messageEvent.emit(value);
  }
}
