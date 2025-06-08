import { useEffect, useState } from "react";
import { Chip } from "@heroui/chip";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Bus, Train, TramFront, TrainFrontTunnel } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import Client from "@/clients/bvgClient";
import { stations } from "@/config/stations";
import { Departure, DepartureResponse } from "@/types/bvg.ts";

function getTransportIcon(product: string) {
  switch (product) {
    case "subway":
      return <TrainFrontTunnel size={16} />;
    case "suburban":
      return <Train size={16} />;
    case "tram":
      return <TramFront size={16} />;
    case "bus":
      return <Bus size={16} />;
    default:
      return null;
  }
}

function getTransportColor(product: string) {
  switch (product) {
    case "suburban":
      return { bg: "#4CAF50", fg: "#fff" }; // S-Bahn green
    case "subway":
      return { bg: "#005CA9", fg: "#fff" }; // U-Bahn blue
    case "tram":
      return { bg: "#C62828", fg: "#fff" }; // Tram red
    case "bus":
      return { bg: "#6A1B9A", fg: "#fff" }; // Bus violet
    default:
      return { bg: "#ccc", fg: "#000" };
  }
}

export function IndexPage() {
  const [departuresByStation, setDeparturesByStation] = useState<
    Record<string, Departure[]>
  >({});

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDepartures = async () => {
      const grouped: Record<string, Departure[]> = {};

      for (const stationId of stations) {
        try {
          const res: DepartureResponse = await Client.journeys(stationId);

          for (const dep of res.departures) {
            const stopName = dep.stop?.name ?? "Unknown Station";

            if (!grouped[stopName]) grouped[stopName] = [];
            grouped[stopName].push(dep);
          }
        } catch (err) {
          console.error(`Failed to fetch departures for ${stationId}`, err);
        }
      }

      setDeparturesByStation(grouped);
    };

    fetchDepartures();
    interval = setInterval(fetchDepartures, 90_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center bg-gray-100 min-h-screen w-full">
        <div className="w-full max-w-3xl px-4 space-y-8">
          {Object.entries(departuresByStation).map(([stationName, deps]) => {
            const lines = deps.reduce(
              (acc, dep) => {
                const key = dep.line?.name ?? "unknown";

                if (!acc[key]) acc[key] = [];
                acc[key].push(dep);

                return acc;
              },
              {} as Record<string, Departure[]>,
            );

            return (
              <div key={stationName} className="space-y-4">
                <h2 className="text-xl font-bold px-2">{stationName}</h2>
                {Object.entries(lines)
                  .sort(([, a], [, b]) => {
                    const getPriority = (p: string) =>
                      ({ suburban: 0, subway: 1, tram: 2, bus: 3 })[p] ?? 99;

                    return (
                      getPriority(a[0]?.line?.product ?? "") -
                      getPriority(b[0]?.line?.product ?? "")
                    );
                  })
                  .map(([lineName, lineDeps]) => {
                    const line = lineDeps[0]?.line;
                    const color = getTransportColor(line?.product ?? "");
                    const icon = getTransportIcon(line?.product ?? "");

                    return (
                      <Card key={`${stationName}-${lineName}`}>
                        <CardHeader className="flex items-center justify-between text-base font-semibold">
                          <div className="flex items-center gap-2">
                            {icon}
                            <span>
                              {lineName} → {lineDeps[0].direction}
                            </span>
                          </div>
                          <Chip
                            style={{
                              backgroundColor: color.bg,
                              color: color.fg,
                            }}
                          >
                            {lineName}
                          </Chip>
                        </CardHeader>
                        <CardBody className="space-y-2">
                          {lineDeps.map((dep) => (
                            <div
                              key={dep.tripId}
                              className="flex justify-between text-sm"
                            >
                              <span>{dep.direction}</span>
                              <span className="font-mono">
                                {new Date(dep.when).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </section>
    </DefaultLayout>
  );
}
