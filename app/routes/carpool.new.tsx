import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";

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
    <div className="flex flex-col w-screen h-screen bg-baseGreen justify-between">
      <div className="h-12 w-full flex justify-between">
        <div></div>
        <h1 className="text-4xl flex flex-col justify-center place-content-center text-center">
          Sakura
        </h1>
        <Profile
          setLoggedInStyle={() => {}}
          userName={userData?.email as string}
        ></Profile>
      </div>
      <div className="w-full h-5/6 flex">
        <div className="w-1/2 h-full flex justify-center place-items-center">
          <div
            className="w-1/2 h-1/2 bg-brightOrange rounded-md border border-black flex flex-col place-items-center overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-brightOrange
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-black
  dark:[&::-webkit-scrollbar-track]:bg-brightOrange
  dark:[&::-webkit-scrollbar-thumb]:bg-black"
          >
            <div className="w-full flex justify-center">
              <h1>Your Cars</h1>
            </div>
            {cars.map((car, index) => (
              <div
                key={index}
              >{`${car.owner}'s ${car.name} - ${car.seats} seats`}</div>
            ))}
          </div>
        </div>
        <div className="w-1/2 h-full flex justify-center place-items-center">
          <div className="w-1/3 h-1/2 bg-brightOrange rounded-md border border-black">
            <div className="flex flex-col w-full h-full p-4 gap-2 justify-between">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  formData.append("cars", JSON.stringify(cars));
                  submit(formData, { method: "POST" });
                }}
                method="POST"
                className="flex flex-col w-full h-full place-items-center justify-around"
              >
                <input
                  type="text"
                  placeholder="Name your carpool"
                  name="carpoolName"
                  className="border border-black/30 rounded-md p-2"
                  required
                />
                <hr className="border-black w-full" />
                <p>add cars</p>
                <input
                  onChange={(e) =>
                    setCurrentCar({ ...currentCar, owner: e.target.value })
                  }
                  type="text"
                  name="owner"
                  placeholder="car owner"
                  className="border border-black/30 rounded-md p-2"
                ></input>
                <input
                  onChange={(e) =>
                    setCurrentCar({ ...currentCar, name: e.target.value })
                  }
                  type="text"
                  name="name"
                  placeholder="car model"
                  className="border border-black/30 rounded-md p-2"
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
                  className="border border-black/30 rounded-md p-2"
                ></input>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCars([...cars, currentCar]);
                  }}
                  className="rounded-md bg-customPurple text-white h-10 w-full"
                  disabled={
                    currentCar.name.length <= 0 ||
                    currentCar.owner.length <= 0 ||
                    currentCar.seats < 2
                  }
                >
                  add car
                </button>
                <hr className="border-black w-full" />
                <button
                  className="rounded-md bg-customPurple text-white h-10 w-full"
                  disabled={cars.length <= 0}
                >
                  submit
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="text-slightGray w-full flex justify-center place-items-center">
        @Sakura-2024
      </div>
    </div>
  );
}
