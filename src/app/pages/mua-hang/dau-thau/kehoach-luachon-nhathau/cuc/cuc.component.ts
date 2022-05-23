import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertTenVthh } from 'src/app/shared/commonFunction';

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

  loaiVthh : string = '';

  ngOnInit() {
      this.getTitleVthh();
  }

  getTitleVthh(){
    this.loaiVthh = convertTenVthh(this.route.snapshot.paramMap.get('type'));
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/'+this.route.snapshot.paramMap.get('type')+'/danh-sach']);
  }

}
