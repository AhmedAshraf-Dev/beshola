import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100vh" };

type LatLng = { lat: number; lng: number };

export default function DrawSmoothPolygon({ apiKey }: { apiKey: string }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingPathRef = useRef<LatLng[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [livePath, setLivePath] = useState<LatLng[]>([]);
  const [finalPolygon, setFinalPolygon] = useState<LatLng[]>([]);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // ✅ START DRAW
  const startDrawing = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    setIsDrawing(true);
    const startPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    drawingPathRef.current = [startPoint];
    setLivePath([startPoint]);

    mapRef.current?.setOptions({
      draggable: false,
      gestureHandling: "none",
    });
  };

  // ✅ DRAW LINE
  const drawLine = (e: google.maps.MapMouseEvent) => {
    if (!isDrawing || !e.latLng) return;

    const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const last = drawingPathRef.current[drawingPathRef.current.length - 1];

    const distance =
      Math.abs(last.lat - point.lat) + Math.abs(last.lng - point.lng);
    if (distance < 0.00005) return;

    drawingPathRef.current.push(point);
    setLivePath([...drawingPathRef.current]);
  };

  // ✅ END DRAWING (ROBUST)
  const endDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    let path = [...drawingPathRef.current];

    if (path.length > 2) {
      path.push(path[0]); // close polygon
      setFinalPolygon(path);
    }

    setLivePath([]);

    mapRef.current?.setOptions({
      draggable: true,
      gestureHandling: "greedy",
    });

    console.log("Polygon Matrix:", path);
  };

  // ✅ GLOBAL EVENT LISTENERS (Fixes event bugs)
  useEffect(() => {
    const stop = () => endDrawing();

    if (isDrawing) {
      window.addEventListener("mouseup", stop);
      window.addEventListener("touchend", stop);
      window.addEventListener("mouseleave", stop);
    }

    return () => {
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("mouseleave", stop);
    };
  }, [isDrawing]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 30.05, lng: 31.45 }}
      zoom={12}
      onLoad={onLoad}
      onMouseDown={startDrawing}
      onMouseMove={drawLine}
      onTouchStart={startDrawing}
      onTouchMove={drawLine}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {/* LIVE LINE */}
      {isDrawing && livePath.length > 1 && (
        <Polyline
          path={livePath}
          options={{
            strokeColor: "#FF0000",
            strokeWeight: 3,
          }}
        />
      )}

      {/* LIVE POLYGON */}
      {isDrawing && livePath.length > 2 && (
        <Polygon
          paths={livePath}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.1,
            strokeColor: "#FF0000",
          }}
        />
      )}

      {/* FINAL POLYGON */}
      {finalPolygon.length > 2 && (
        <Polygon
          paths={finalPolygon}
          options={{
            fillColor: "#1E88E5",
            fillOpacity: 0.25,
            strokeColor: "#1E88E5",
          }}
        />
      )}
    </GoogleMap>
  );
}
