import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import QRCode from "react-qr-code";

import { prisma } from "~/db.server";
import { getHostname } from "~/utils/getHostname";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolId = params.carpoolid;

  const carPool =
    carpoolId &&
    (await prisma.carPool.findUnique({
      where: { id: carpoolId },
    }));

  return json({ carPool });
}

export default function Carpool() {
  const { carPool } = useLoaderData<typeof loader>();
  const [link, setLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // set with useEffect to prevent hydration mismatch
  // TODO: figure out how to get fly app hostname on server
  React.useEffect(() => {
    if (!carPool) return;
    setLink(`${getHostname()}/carpool/${carPool.id}/join`);
  }, [carPool]);

  if (!carPool) {
    return (
      <div>
        <h1>Car Pool not found</h1>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <div>
      <h1>Invite your friends to {carPool.name}</h1>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={link}
        viewBox={`0 0 256 256`}
      />
      <button onClick={copyToClipboard}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
