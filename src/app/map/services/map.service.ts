import { HttpClient } from '@angular/common/http';
import { GeocodingService } from './geocoding.service';
import { flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: L.Map;

  private groupLayer: L.LayerGroup;

  private markers: L.Marker[] = [];

  constructor(
    private data: DataService,
    private geo: GeocodingService,
    private http: HttpClient
  ) { }

  public setMap(host: HTMLElement) {
    this.map = L.map(host, {
      center: L.latLng({lat: environment.mapCenter[0], lng: environment.mapCenter[1]}),
      zoom: 5,
      minZoom: 2,
      maxZoom: 17,
      maxBounds: new L.LatLngBounds({lat: -90, lng: -180}, {lat: 90, lng: 180})
    });

    this.addTileLayers();
    this.visualizeMarkers();

    this.http.get('/assets/regions.geojson').subscribe(
      geo => {
        L.geoJSON(geo as any, {
          onEachFeature: (f, l) => l.bindPopup(f.properties['name'])
        }).addTo(this.map);
      }
    )

  }


  private visualizeMarkers() {
    this.data.geoData.pipe(
      map(points => points.map(p => {
        const marker = new L.Marker(p, { draggable: true }).addTo(this.groupLayer);
        marker.on('click', () => {
          this.groupLayer.removeLayer(marker);
        });
        return marker;
      })),
      tap(markers => {
        const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
        this.map.flyToBounds(bounds);
      }),
      flatMap(m => m),
      mergeMap(m => combineLatest([of(m), this.geo.getAddress(m.getLatLng())])),
      tap(([marker, address]) => marker.bindPopup(address))
    ).subscribe(([marker, address]) => {
      this.markers.push(marker);
    });

    this.data.geoData.pipe(
      map(m => new L.Polyline(m).addTo(this.map))
    ).subscribe();

    this.map.on('click', (e) => {
      const positon = (e as any).latlng;
      const marker = new L.Marker(positon, { opacity: 0.5 }).addTo(this.groupLayer);
    });
  }

  private addTileLayers() {
    const firstTile = L.tileLayer(environment.tileUrl)
      .addTo(this.map);

    const secondTile = L.tileLayer(environment.anotherTileUrl);

    this.groupLayer = L.markerClusterGroup().addTo(this.map);

    const control = L.control.layers({
      'Первый': firstTile,
      'Второй': secondTile
    }, { 'Маркеры': this.groupLayer }).addTo(this.map);
  }
}
