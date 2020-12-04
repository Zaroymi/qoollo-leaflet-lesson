import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public geoData = of([
    {
      lat: 55.702287,
      lng: 37.536591
    },
    {
      lat: 55.732068,
      lng: 37.682846
    },
    {
      lat: 55.841716,
      lng: 37.717865
    },
    {
      lat: 55.828397,
      lng: 37.518489
    },
    {
      lat: 55.742927,
      lng: 37.526867
    }
  ])

  constructor() { }
}