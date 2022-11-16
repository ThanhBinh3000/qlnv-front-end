import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { UserLogin } from "../../../../../models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../../models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { DiaDiemNhapKho } from "../../../../../models/CuuTro";

@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})
export class DeXuatComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isDetail: boolean = true;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  selectedId: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  showList() {

  }
}
