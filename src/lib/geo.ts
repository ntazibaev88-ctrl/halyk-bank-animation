import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
import world from 'world-atlas/countries-110m.json';

const topo = world as any;

export const land = feature(topo, topo.objects.land) as unknown as FeatureCollection<Geometry>;
export const countries = (feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>).features;

const byId = (id: string) => countries.find((c) => String(c.id) === id) as Feature<Geometry>;
export const USA = byId('840');
export const CHINA = byId('156');

export type LonLat = [number, number];
export const PLACES: Record<string, LonLat> = {
  washington: [-77.04, 38.9],
  newYork: [-74.0, 40.7],
  losAngeles: [-118.24, 34.05],
  sanFrancisco: [-122.42, 37.77],
  houston: [-95.37, 29.76],
  beijing: [116.4, 39.9],
  shanghai: [121.47, 31.23],
  shenzhen: [114.06, 22.54],
  rotterdam: [4.48, 51.92],
  singapore: [103.82, 1.35],
  panama: [-79.52, 8.98],
  suez: [32.55, 29.97],
  baotou: [109.84, 40.66],
  centralUS: [-98.5, 39.5],
  centralCN: [104.0, 35.0],
};
