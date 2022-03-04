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
  cuc: string;
  soGoiThau: string;
  soDeXuat: string;
  ngayDeXuat: string;
  tenDuAn: string;
  soLuong: string;
  tongTien: string;
}
@Component({
  selector: 'thong-tin-luong-dau-thau-gao',
  templateUrl: './thong-tin-luong-dau-thau-gao.component.html',
  styleUrls: ['./thong-tin-luong-dau-thau-gao.component.scss'],
})
export class ThongTinLuongDauThauGaoComponent implements OnInit {
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
  constructor(private fb: FormBuilder, private modal: NzModalService, private router: Router) { }

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
        cuc: '',
        soGoiThau: '',
        soDeXuat: '',
        ngayDeXuat: '',
        tenDuAn: '',
        soLuong: '',
        tongTien: ''
      },
    ];
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }

  tongHopDeXuatTuCuc(id: string): void {
    this.router.navigate([`/nhap/dau-thau/thong-tin-chung-phuong-an-trinh-tong-cuc/`, id])
  }

  ngOnInit(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        stt: `${this.i}`,
        cuc: 'Cục DTNN KV Vĩnh phú',
        soGoiThau: `4`,
        soDeXuat: 'DX_KHCNT_01',
        ngayDeXuat: `10/03/2022`,
        tenDuAn: `Mua gạo dự trữ A`,
        soLuong: `2000`,
        tongTien: `42.000.000`,
      },
    ];
  }
  back(value: boolean) {
    this.messageEvent.emit(value);
  }
}
