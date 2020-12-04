import * as L from 'leaflet';

export class DataMarker extends L.Marker {
    constructor(data: object, position: L.LatLng, options?: L.MarkerOptions) {
        super(position, options);

        this.setIcon(L.divIcon({
            html: '<div> </div>',
            className: '',
        }));
    }
}