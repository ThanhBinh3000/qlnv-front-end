import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
@Component({
    selector: 'du-toan-nsnn',
    templateUrl: './du-toan-nsnn.component.html',
    styleUrls: ['./du-toan-nsnn.component.scss'],
})
export class DuToanNsnnComponent implements OnInit {
    // tabH = 0;
    constructor(
        public globals: Globals
    ) { }
    tabSelected = 'lapthamdinh';
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
