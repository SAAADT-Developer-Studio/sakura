import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolid = params.carpoolid;
  const carpool = await prisma.carPool.findUnique({
    where: { id: carpoolid },
    include: {
      organiser: true,
    },
  });
  return json({ carpool });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const participantName = formData.get("participantName")?.toString();
  const carpoolId = params.carpoolid;
  if (!participantName || !carpoolId) {
    return new Response("not good", {
      status: 400,
    });
  }

  const { id } = await prisma.participant.create({
    data: {
      name: participantName.toString(),
      carpoolId,
    },
  });
  return redirect(`/carpool/${carpoolId}/participant/${id}`);
}

export default function JoinCarpool() {
  const { carpool } = useLoaderData<typeof loader>();
  if (!carpool) {
    return (
      <div className="flex justify-center items-center h-full flex-col">
        <h1 className="text-3xl">This link is broken!</h1>
        <div className="p-2" />
        <div>Whoever sent this to you is an evil person</div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-[38px]">
        Welcome to Sakura, the world leading car charing app!
      </h1>
      <h2 className="mt-4 text-2xl">
        Your colleague{" "}
        <span className="font-bold">{carpool.organiser.email}</span> has invited
        you to <span className="font-bold">{carpool.name}</span>
      </h2>

      <Form method="POST">
        <div className="mt-14 flex flex-col w-96 border border-black/10 p-4 gap-2 mx-auto rounded">
          <input
            type="text"
            placeholder="Your name"
            name="participantName"
            className="border border-black/30 rounded-md p-2"
          />
          <button className="bg-blue-600 p-2 text-white rounded-md">
            Join
          </button>
        </div>
      </Form>
    </div>
  );
}
