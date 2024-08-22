import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("carpoolName")?.toString();

  if (!name) {
    return json({ message: "Name is required" });
  }
  const { id } = await prisma.carPool.create({
    select: {
      id: true,
    },
    data: {
      name,
      organiserId: userId,
    },
  });
  return redirect(`/carpool/${id}/invite`);
}

export default function NewCarPool() {
  const data = useActionData<typeof action>();
  return (
    <Form method="POST">
      <div className="flex flex-col w-96 border border-black/10 p-4 gap-2">
        <input
          type="text"
          placeholder="Name your carpool"
          name="carpoolName"
          className="border border-black/30 rounded-md p-2"
        />
        <button className="bg-blue-600 p-2 text-white rounded-md">
          Create Carpool Link
        </button>
      </div>
    </Form>
  );
}
