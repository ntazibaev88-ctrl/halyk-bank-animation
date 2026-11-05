// Projects real Natural Earth borders (world-atlas) into SVG path data for the map scene.
import fs from "node:fs"; import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import { feature } from "topojson-client"; import { geoConicConformal, geoPath } from "d3-geo";
const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json","utf8"));
const all = feature(topo, topo.objects.countries).features;
const kz = all.find(f=>f.properties.name==="Kazakhstan");
const near = ["Russia","China","Uzbekistan","Kyrgyzstan","Turkmenistan","Mongolia","Azerbaijan","Georgia","Tajikistan","Afghanistan","Ukraine","Iran"];
const W=1080,H=1500;
const proj = geoConicConformal().parallels([43,56]).rotate([-67,0]).fitExtent([[40,150],[W-40,H-150]], kz);
const path = geoPath(proj);
const out = { kz: path(kz), neighbors: all.filter(f=>near.includes(f.properties.name)).map(f=>path(f)), graticule: null,
  almaty: proj([76.945,43.238]), astana: proj([71.449,51.169]) };
fs.writeFileSync("assets/kz-map.json", JSON.stringify(out));
console.log(out.almaty, out.astana, out.kz.length, out.neighbors.length);
