import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertTenVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-chi-cuc',
  templateUrl: './chi-cuc.component.html',
  styleUrls: ['./chi-cuc.component.scss']
})
export class ChiCucComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  loaiVthh: string = '';

  ngOnInit() {
  }

}
