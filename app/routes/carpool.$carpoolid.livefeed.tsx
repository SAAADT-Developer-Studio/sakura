import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Profile from "~/components/profile";
import { getUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return (await getUser(request)) ?? null;
}

/*
car seat numbers
---------
| 0 | 2 |
| 1 | 3 |
---------
*/

export default function CarpoolLiveFeed() {
  const userData = useLoaderData<typeof loader>();
  const dummyData = [
    {
      name: "Marcedes",
      seats: 4,
      owner: "John",
      carParticipants: [
        { name: "Jackson", seat: 0 },
        { name: "Jordan", seat: 1 },
      ],
    },
    { name: "BMW", seats: 4, owner: "Jane", carParticipants: [] },
    {
      name: "Toyota",
      seats: 4,
      owner: "Jack",
      carParticipants: [{ name: "nekdo", seat: 3 }],
    },
    {
      name: "Honda",
      seats: 4,
      owner: "Jill",
      carParticipants: [{ name: "nekdo1", seat: 1 }],
    },
    {
      name: "Ford",
      seats: 4,
      owner: "Jenny",
      carParticipants: [{ name: "nekdo2", seat: 0 }],
    },
  ];

  const generateSeats = (seats: number) => {
    return Array.from({ length: seats }, (_, index) => (
      <div key={index}>Div {index + 1}</div>
    ));
  };

  function getGridColsClass(seats: number) {
    const cols = Math.floor(seats / 2);
    return `grid-cols-${cols}`;
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-baseGreen justify-between place-items-center">
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
      <div className="w-2/3 h-5/6 grid grid-cols-5 gap-4">
        {dummyData.map((car, index) => (
          <div
            key={index}
            className={`bg-brightOrange h-20 grid grid-rows-3 grid-cols-2`}
          >
            {generateSeats(car.seats)}
          </div>
        ))}
      </div>
      <div className="text-slightGray w-full flex justify-center place-items-center">
        @Sakura-2024
      </div>
    </div>
  );
}
