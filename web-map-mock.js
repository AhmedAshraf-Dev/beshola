// web-map-mock.js
import React from "react";

export default function MapView({ style, children }) {
  return (
    <div style={{ width: style?.width || "100%", height: style?.height || "200px", backgroundColor: "#eee" }}>
      Map Placeholder (Web)
      {children}
    </div>
  );
}
