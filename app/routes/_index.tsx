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
    <main className="flex h-screen w-screen">
      <div className="h-full w-1/2 bg-cover"></div>
      <div className="flex h-full w-1/2 flex-col place-items-center justify-between bg-baseGreen">
        <div className={`flex h-12 w-full ${loggedInStyle}`}>
          {userData ? (
            <></>
          ) : (
            <Link to="/register" className="flex w-32 place-items-center justify-center text-xl">
              Register
            </Link>
          )}
          {userData ? (
            <Profile userName={userData.email} setLoggedInStyle={setLoggedInStyle} />
          ) : (
            <Link to="/login" className="flex w-32 place-items-center justify-center text-xl">
              Login
            </Link>
          )}
        </div>
        <div>
          <h1 className="flex flex-col place-content-center justify-center text-center text-4xl">
            Sakura
          </h1>
          {userData ? (
            <Link
              className="flex h-10 w-32 place-items-center justify-around rounded-md border border-black bg-brightOrange"
              to="/carpool/new"
            >
              <img className="h-6 w-6" src={plusIcon}></img>
              New Carpool
            </Link>
          ) : (
            <p className="text-2xl text-slightGray">Making trips with your friends easy</p>
          )}
        </div>
        <div className="text-slightGray">@Sakura-2024</div>
      </div>
    </main>
  );
}
