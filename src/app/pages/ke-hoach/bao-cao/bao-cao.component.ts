import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
@Component({
    selector: 'bao-cao',
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss'],
})
export class BaoCaoComponent implements OnInit {
    // tabH = 0;
    constructor(
        public globals: Globals
    ) { }
    tabSelected = 'thuchien';
    ngOnInit() {
        // this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
        // window.addEventListener('resize', (e) => {
        //   this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
        // });
    }
    selectTab(tab) {
        this.tabSelected = tab;
    }
}
