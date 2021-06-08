import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
    lat: number;
    lng: number;
}

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lat:0, lng:0 });
    const onApiLoaded = ({ map, maps }: {map: any, maps: any}) => {
        map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    };
    // @ts-ignore
    const onSucces = ({ coords: { latitude, longitude } }: Position) => {
        setDriverCoords({lat: latitude, lng: longitude});
    }
    // @ts-ignore
    const onError = (error: PositionError) => {
        console.log(error);
      };
    useEffect(() => {
        navigator.geolocation.watchPosition(onSucces, onError, {
            enableHighAccuracy: true,
        });
    }, []);
    return (
        <div>
            <div
                className="overflow-hidden"
                style={{ width: window.innerWidth, height: "95vh"}}
            >
            <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={onApiLoaded}
                defaultZoom={5}
                draggable={false}
                defaultCenter={{
                    lat: 36.58,
                    lng: 125.95
                }}
                bootstrapURLKeys={{ key: "AIzaSyB6nf2hDBOfKKbVgqHpvS7T14dG13Y3Zo8" }}
            >
                <h1>Hello</h1>
            </GoogleMapReact>
            </div>
        </div>
    );
}