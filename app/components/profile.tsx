import React from "react";
import { Form } from "@remix-run/react";
import logout from "../images/logout.png";
import account_circle from "../images/account_circle.png";

export default function Profile({ userName }: { userName: string }) {
  const [dropdownToggled, setDropdownToggled] = React.useState(false);
  return (
    <div className="flex flex-col justify-center place-items-center">
      <img
        className="w-10 h-10"
        onClick={() => setDropdownToggled(!dropdownToggled)}
        src={account_circle}
        alt="profile"
      />
      {dropdownToggled ? (
        <div className="bg-brightOrange p-2 rounded-xl">
          <h1 className="flex justify-center place-items-center text-lg">
            {userName}
          </h1>
          <Form method="POST" action="/logout" className="w-16">
            <button
              type="submit"
              className="w-full flex justify-between place-items-center text-lg"
            >
              <p>logout</p> <img className="w-4 h-4" src={logout}></img>
            </button>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
