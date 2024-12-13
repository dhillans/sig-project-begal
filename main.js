import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Icon, Style } from "ol/style.js";
import Overlay from "ol/Overlay.js";

// pop up
const container = document.getElementById("popup");
const content_element = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// riau
const riau = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "data/polygonpku.json",
  }),
});

// banjiur
const begal = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "data/begal.json",
  }),
  style: new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: "flaticon",
      anchorYUnits: "pixels",
      src: "icon/icon.png",
      width: 32,
      height: 32,
    }),
  }),
});

// main
const map = new Map({
  target: "map",
  overlays: [overlay],
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    riau,
    begal,
  ],
  view: new View({
    center: fromLonLat([101.438309, 0.51044]),
    zoom: 12,
  }),
});

map.addOverlay(overlay);
map.on("singleclick", function (evt) {
  let feature = null;

  // Cek fitur hanya dari layer "begal"
  map.forEachFeatureAtPixel(evt.pixel, function (f, layer) {
    if (layer === begal) {
      feature = f;
      return true;
    }
  });

  if (!feature) {
    return;
  }

  // Ambil data dari fitur
  const imageSrc = feature.get("No_") || "noImg";
  const alamat = feature.get("ALAMAT") || "Alamat tidak tersedia";

  // Debugging (opsional)
  console.log(imageSrc);

  const coordinate = evt.coordinate;
  const content = `
    <img src="./icon/FOTO/${imageSrc}.png" alt="Gambar Lokasi" style="width: 100%; height: auto;"/>
    <h4>Alamat: ${alamat}</h4>
   
  `;

  content_element.innerHTML = content;
  overlay.setPosition(coordinate); // Tampilkan overlay
});

//Click handler to hide popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
