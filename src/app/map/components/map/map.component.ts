import { MapService } from './../../services/map.service';
import { GeocodingService } from './../../services/geocoding.service';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private map: MapService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.map.setMap(this.el.nativeElement);
  }

}
