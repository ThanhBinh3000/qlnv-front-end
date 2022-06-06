import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LEVEL, LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { convertIdToLoaiVthh, convertTenVthh, convertTrangThai } from 'src/app/shared/commonFunction';


@Component({
  selector: 'app-tong-cuc',
  templateUrl: './tong-cuc.component.html',
  styleUrls: ['./tong-cuc.component.scss']
})
export class TongCucComponent implements OnInit {
  constructor(

  ) {
  }
  ngOnInit() {

  }

}
