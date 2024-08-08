import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="w-screen h-screen flex">
      <div className="w-1/2 h-full bg-cover"></div>
      <div className="w-1/2 h-full bg-baseGreen flex justify-between place-items-center flex-col">
        <div className="w-full h-12 flex justify-between">
          <Link
            to="/register"
            className="w-32 text-xl flex justify-center place-items-center"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="w-32 text-xl flex justify-center place-items-center"
          >
            Login
          </Link>
        </div>
        <div>
          <h1 className="text-4xl flex flex-col justify-center place-content-center text-center">
            Sakura
          </h1>
          <p className="text-2xl text-slightGray">
            Making trips with your friends easy
          </p>
        </div>
        <div className="text-slightGray">@Sakura-2024</div>
      </div>
    </main>
  );
}
