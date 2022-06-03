import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { convertIdToLoaiVthh, convertTenVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-cuc',
  templateUrl: './cuc.component.html',
  styleUrls: ['./cuc.component.scss']
})
export class CucComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  listVthh: any = LIST_VAT_TU_HANG_HOA;

  ngOnInit() {
    this.referTabLv1(LIST_VAT_TU_HANG_HOA[0]);
  }

  referTabLv1(event) {
    console.log(event);
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + convertIdToLoaiVthh(event.value) + '/danh-sach']);
  }

}
