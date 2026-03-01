import React, { useState } from "react";
import MapWithArea from "./PolygonForm";
import DrawPolygonMap from "./DrawSmoothPolygon";

const sampleProps = [
  {
    id: 1,
    title: "Apartment New Cairo",
    lat: 30.03,
    lng: 31.42,
    price: 5000000,
    type: "Apartment",
  },
  {
    id: 2,
    title: "Villa New Cairo",
    lat: 30.08,
    lng: 31.45,
    price: 12000000,
    type: "Villa",
  },
  {
    id: 3,
    title: "Townhouse Outside",
    lat: 29.9,
    lng: 31.3,
    price: 4000000,
    type: "Townhouse",
  },
  // more...
];

function App() {
  const [area, setArea] = useState(null);

  const handleAreaSelect = (areaKey) => {
    setArea(areaKey);
    console.log("Selected area:", areaKey);
    // You could call backend API to load only properties for that area
  };

  return (
    <div>
      <DrawPolygonMap
        apiKey={"AIzaSyAQI0XOqGuGc_3CF_uASbtFpy2OJtWzi6Q"}
        properties={sampleProps}
        onAreaSelect={handleAreaSelect}
        onFinish={() => {}}
      />
    </div>
  );
}

export default App;
