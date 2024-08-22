import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolId = params.carpoolid;
  const participantId = params.participantid;
  if (!carpoolId || !participantId) {
    throw new Response("bad", { status: 400 });
  }
}

export default function CarPool() {
  // TODO: subscribe to websockets endpoint, listen to changes and emit car seat picks
  const cars = [];
  return (
    <div>
      {cars.map((car) => {
        return (
          <div>
            <div>seat1</div>
            <div>seat2</div>
            <div>seat3</div>
          </div>
        );
      })}
    </div>
  );
}
