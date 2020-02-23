import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-advert-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() advert;
  imagesrc = '';

  constructor() {
  }

  ngOnInit() {
    if (this.advert.images[0]) {
      this.imagesrc = this.advert.images[0];
    } else {
      this.imagesrc = 'http://localhost:8080/images/default.jpg';
    }
  }

}
