import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(
    private http: HttpClient
  ) { }

  public getAddress(position: { lat: number, lng: number }) {
    const { lat, lng } = position;

    const params = new HttpParams()
      .set('format', 'json')
      .set('lat', lat.toString())
      .set('lon', lng.toString())

    return this.http.get<{ display_name: string }>(environment.reverseGeocodingUrl, {
      params
    }).pipe(
      map(({ display_name }) => display_name ?? 'Ошибка')
    );
  }
}
