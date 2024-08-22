import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/session.server";
import Profile from "~/components/profile";
import { useEffect, useState } from "react";
import plusIcon from "~/images/plusIcon.png";

export async function loader({ request }: LoaderFunctionArgs) {
  return (await getUser(request)) ?? null;
}

export default function Index() {
  const userData = useLoaderData<typeof loader>();
  const [loggedInStyle, setLoggedInStyle] = useState("justify-between");
  useEffect(() => {
    if (userData) {
      setLoggedInStyle("justify-center");
    }
  }, []);

  return (
    <main className="w-screen h-screen flex">
      <div className="w-1/2 h-full bg-cover"></div>
      <div className="w-1/2 h-full bg-baseGreen flex justify-between place-items-center flex-col">
        <div className={`w-full h-12 flex ${loggedInStyle}`}>
          {userData ? (
            <></>
          ) : (
            <Link
              to="/register"
              className="w-32 text-xl flex justify-center place-items-center"
            >
              Register
            </Link>
          )}
          {userData ? (
            <Profile
              userName={userData.email}
              setLoggedInStyle={setLoggedInStyle}
            />
          ) : (
            <Link
              to="/login"
              className="w-32 text-xl flex justify-center place-items-center"
            >
              Login
            </Link>
          )}
        </div>
        <div>
          <h1 className="text-4xl flex flex-col justify-center place-content-center text-center">
            Sakura
          </h1>
          {userData ? (
            <Link
              className="w-32 h-10 border border-black bg-brightOrange flex justify-around place-items-center rounded-md"
              to="/carpool/new"
            >
              <img className="w-6 h-6" src={plusIcon}></img>
              New Carpool
            </Link>
          ) : (
            <p className="text-2xl text-slightGray">
              Making trips with your friends easy
            </p>
          )}
        </div>
        <div className="text-slightGray">@Sakura-2024</div>
      </div>
    </main>
  );
}
