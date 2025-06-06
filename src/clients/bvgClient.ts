import { DepartureResponse } from "@/types/bvg.ts";

class Client {
  static async journeys(station: string): Promise<DepartureResponse> {
    const res = await fetch(
      `https://v6.vbb.transport.rest/stops/${station}/departures?duration=10`,
    );
    const json: DepartureResponse = await res.json();

    return json;
  }
}

export default Client;
