import React from "react";
import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
    return (
        <div>
            <div
                className="overflow-hidden"
                style={{ width: window.innerWidth, height: "95vh"}}
            >
            <GoogleMapReact
                defaultZoom={5}
                defaultCenter={{
                    lat: 29.95,
                    lng: 30.93
                }}
                bootstrapURLKeys={{ key: "AIzaSyB6nf2hDBOfKKbVgqHpvS7T14dG13Y3Zo8" }}
            >
                <h1>Hello</h1>
            </GoogleMapReact>
            </div>
        </div>
      );
}