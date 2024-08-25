import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import { prisma } from "~/db.server";
import { getUser, requireUserId } from "~/session.server";
import { FormEvent, useState } from "react";
import Profile from "~/components/profile";

interface Car {
  name: string;
  seats: number;
  owner: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return (await getUser(request)) ?? null;
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const name = formData.get("carpoolName")?.toString();
  const cars = JSON.parse(formData.get("cars")?.toString() || "[]");

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
      Cars: { create: cars },
    },
  });
  return redirect(`/carpool/${id}/invite`);
}

export default function NewCarPool() {
  const userData = useLoaderData<typeof loader>();
  const [cars, setCars] = useState<Car[]>([]);
  const [currentCar, setCurrentCar] = useState<Car>({
    owner: "",
    name: "",
    seats: 2,
  });

  const submit = useSubmit();

  return (
    <div className="flex h-screen w-screen flex-col justify-between bg-baseGreen">
      <div className="flex h-12 w-full justify-between">
        <div></div>
        <h1 className="flex flex-col place-content-center justify-center text-center text-4xl">
          Sakura
        </h1>
        <Profile setLoggedInStyle={() => {}} userName={userData?.email as string}></Profile>
      </div>
      <div className="flex h-5/6 w-full">
        <div className="flex h-full w-1/2 place-items-center justify-center">
          <div className="flex h-1/2 w-1/2 flex-col place-items-center overflow-y-auto rounded-md border border-black bg-brightOrange [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black dark:[&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-brightOrange dark:[&::-webkit-scrollbar-track]:bg-brightOrange [&::-webkit-scrollbar]:w-2">
            <div className="flex w-full justify-center">
              <h1>Your Cars</h1>
            </div>
            {cars.map((car, index) => (
              <div key={index}>{`${car.owner}'s ${car.name} - ${car.seats} seats`}</div>
            ))}
          </div>
        </div>
        <div className="flex h-full w-1/2 place-items-center justify-center">
          <div className="h-1/2 w-1/3 rounded-md border border-black bg-brightOrange">
            <div className="flex h-full w-full flex-col justify-between gap-2 p-4">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  formData.append("cars", JSON.stringify(cars));
                  submit(formData, { method: "POST" });
                }}
                method="POST"
                className="flex h-full w-full flex-col place-items-center justify-around"
              >
                <input
                  type="text"
                  placeholder="Name your carpool"
                  name="carpoolName"
                  className="rounded-md border border-black/30 p-2"
                  required
                />
                <hr className="w-full border-black" />
                <p>add cars</p>
                <input
                  onChange={(e) => setCurrentCar({ ...currentCar, owner: e.target.value })}
                  type="text"
                  name="owner"
                  placeholder="car owner"
                  className="rounded-md border border-black/30 p-2"
                ></input>
                <input
                  onChange={(e) => setCurrentCar({ ...currentCar, name: e.target.value })}
                  type="text"
                  name="name"
                  placeholder="car model"
                  className="rounded-md border border-black/30 p-2"
                ></input>
                <input
                  onChange={(e) =>
                    setCurrentCar({
                      ...currentCar,
                      seats: Number(e.target.value),
                    })
                  }
                  type="number"
                  name="seats"
                  min="2"
                  placeholder="number of seats"
                  className="rounded-md border border-black/30 p-2"
                ></input>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCars([...cars, currentCar]);
                  }}
                  className="h-10 w-full rounded-md bg-customPurple text-white"
                  disabled={
                    currentCar.name.length <= 0 ||
                    currentCar.owner.length <= 0 ||
                    currentCar.seats < 2
                  }
                >
                  add car
                </button>
                <hr className="w-full border-black" />
                <button
                  className="h-10 w-full rounded-md bg-customPurple text-white"
                  disabled={cars.length <= 0}
                >
                  submit
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full place-items-center justify-center text-slightGray">
        @Sakura-2024
      </div>
    </div>
  );
}
