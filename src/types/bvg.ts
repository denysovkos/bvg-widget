export interface DepartureResponse {
  departures: Departure[];
  realtimeDataUpdatedAt: number;
}

export interface Departure {
  tripId: string;
  stop: Stop;
  when: string;
  plannedWhen: string;
  delay: number | null;
  platform: string;
  plannedPlatform: string;
  prognosisType: string | null;
  direction: string;
  provenance: string | null;
  origin: Stop | null;
  destination: Stop;
  line: Line;
  remarks: Remark[];
  currentTripPosition: Location;
}

export interface Stop {
  type: "stop";
  id: string;
  name: string;
  location: Location;
  products: Products;
  stationDHID: string;
}

export interface Location {
  type: "location";
  id?: string;
  latitude: number;
  longitude: number;
}

export interface Products {
  suburban: boolean;
  subway: boolean;
  tram: boolean;
  bus: boolean;
  ferry: boolean;
  express: boolean;
  regional: boolean;
}

export interface Line {
  type: "line";
  id: string;
  fahrtNr: string;
  name: string;
  public: boolean;
  adminCode: string;
  productName: string;
  mode: string;
  product: string;
  operator: Operator;
  color: LineColor;
}

export interface Operator {
  type: "operator";
  id: string;
  name: string;
}

export interface LineColor {
  fg: string;
  bg: string;
}

export interface Remark {
  type: string;
  code: string;
  text: string;
}
