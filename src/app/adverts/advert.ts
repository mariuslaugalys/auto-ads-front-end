export interface AdvertFilter {
  manufacturersModels: MapStringList;
  colors: string[];
  driveTypes: string[];
  chassisTypes: string[];
  transmissionTypes: string[];
  fuelTypes: string[];
  minPrice: number;
  maxPrice: number;
  minManufactureYear: number;
  maxManufactureYear: number;
  minPower: number;
  maxPower: number;
  minKilometers: number;
  maxKilometers: number;
  minVolume: number;
  maxVolume: number;
}
export function getAdvertFilterFieldType(key: string): string {
  if ([
    'colors',
    'driveTypes',
    'chassisTypes',
    'transmissionTypes',
    'fuelTypes'
  ].indexOf(key) >= 0) {
    return 'array';
  }

  if ([
    'minPrice',
    'maxPrice',
    'minManufactureYear',
    'maxManufactureYear',
    'minPower',
    'maxPower',
    'minKilometers',
    'maxKilometers',
    'minVolume',
    'maxVolume'
  ].indexOf(key) >= 0) {
    return 'number';
  }

  if (['manufacturersModels'].indexOf(key) >= 0) {
    return 'map';
  }
  return undefined;
}

export interface MapStringList {
  [fieldName: string]: string[];
}
