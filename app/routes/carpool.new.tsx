import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import { FormEvent, useState } from "react";
import Profile from "~/components/profile";

interface Car {
  name: string;
  seats: number;
  owner: string;
}

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
  const [cars, setCars] = useState<Car[]>([]);
  const [carpoolName, setCarpoolName] = useState("");
  const [isFirstPage, setIsFirstPage] = useState(true);

  const handleAddCarSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCar: Car = {
      owner: ((event.target as HTMLFormElement)[1] as HTMLInputElement).value,
      name: ((event.target as HTMLFormElement)[2] as HTMLInputElement).value,
      seats: Number(
        ((event.target as HTMLFormElement)[3] as HTMLInputElement).value,
      ),
    };
    setCars([...cars, newCar]);
  };

  return (
    <div className="flex w-screen h-screen bg-baseGreen justify-center">
      {isFirstPage ? (
        <></>
      ) : (
        <div className="w-1/2 h-full flex justify-center place-items-center">
          <div className="w-4/5 h-2/3 bg-brightOrange rounded-md border border-black">
            {cars.map((car, index) => (
              <div
                key={index}
              >{`${car.owner}'s ${car.name} - ${car.seats} seats`}</div>
            ))}
          </div>
        </div>
      )}
      <div className="w-1/2 h-full flex justify-center place-items-center">
        {isFirstPage ? (
          <div className="w-1/3 h-1/6 bg-brightOrange rounded-md border border-black">
            <div className="flex flex-col w-full h-full p-4 gap-2 justify-between">
              <input type="hidden" name="formType" value="form2" />
              <input
                onChange={(e) => setCarpoolName(e.target.value)}
                type="text"
                placeholder="Name your carpool"
                name="carpoolName"
                className="border border-black/30 rounded-md p-2"
              />
              <button
                className="rounded-md bg-customPurple text-white h-10"
                onClick={() => setIsFirstPage(false)}
                disabled={carpoolName.length <= 0}
              >
                next 1/2
              </button>
            </div>
          </div>
        ) : (
          <div className="w-4/5 h-2/3 bg-brightOrange rounded-md border border-black">
            <Form onSubmit={handleAddCarSubmit}>
              <input type="hidden" name="formType" value="form1" />
              <input
                type="text"
                name="owner"
                placeholder="car owner"
                required
              ></input>
              <input
                type="text"
                name="name"
                placeholder="car brand"
                required
              ></input>
              <input
                type="number"
                name="seats"
                placeholder="number of seats"
                min="2"
                required
              ></input>
              <button type="submit">add car</button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
