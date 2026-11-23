import fs from 'fs';
import {feature} from 'topojson-client';
import {geoConicConformal, geoPath, geoOrthographic, geoGraticule10} from 'd3-geo';
const topo=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc=feature(topo,topo.objects.countries);
const kz=fc.features.find(f=>f.id==='398');
console.error('kz found',!!kz, kz?.properties);
// 1) Regional map: KZ + neighbours, conic projection fitted to 1800x1300
const proj=geoConicConformal().parallels([42,52]).rotate([-67,0]).fitExtent([[120,120],[1680,1080]],kz);
const path=geoPath(proj);
const neighbours=fc.features.filter(f=>f.id!=='398'&&path.bounds(f)[1][0]>-400&&path.bounds(f)[0][0]<2200&&path.bounds(f)[1][1]>-400&&path.bounds(f)[0][1]<1600);
const out={w:1800,h:1200,kz:path(kz),neighbours:neighbours.map(f=>path(f)).filter(Boolean),
  almaty:proj([76.886,43.238]),astana:proj([71.43,51.128])};
// 2) Globe (orthographic) centred on KZ for "world map" moment: several rotations
const globe=[];
for(const lon of [20,35,50,67]){
  const g=geoOrthographic().rotate([-lon,-35]).translate([800,800]).scale(760).clipAngle(90);
  const gp=geoPath(g);
  globe.push({lon,land:fc.features.filter(f=>f.id!=='398').map(f=>gp(f)).filter(Boolean).join(' '),kz:gp(kz)||'',sphere:gp({type:'Sphere'}),grat:gp(geoGraticule10())});
}
out.globe=globe;
fs.writeFileSync('../../hf/assets_map.json',JSON.stringify(out));
console.error('neighbours',neighbours.length,'kz path len',out.kz.length);
