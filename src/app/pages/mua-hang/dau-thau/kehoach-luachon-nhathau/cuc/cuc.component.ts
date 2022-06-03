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

  loaiVthh: string = '';
  listVthh: any = LIST_VAT_TU_HANG_HOA;

  ngOnInit() {
    // this.getTitleVthh();
  }

  referTabLv1(event) {
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + convertIdToLoaiVthh(event.value) + '/danh-sach']);
  }


  // getTitleVthh(){
  //   this.loaiVthh = convertTenVthh(this.route.snapshot.paramMap.get('type'));
  //   this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/'+this.route.snapshot.paramMap.get('type')+'/danh-sach']);
  // }

}
