import React from "react";
import { Form } from "@remix-run/react";
import logout from "../images/logout.png";
import account_circle from "../images/account_circle.png";

export default function Profile({
  userName,
  setLoggedInStyle,
}: {
  userName: string;
  setLoggedInStyle: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [dropdownToggled, setDropdownToggled] = React.useState(false);
  return (
    <div className="mr-10 mt-2 flex h-28 w-16 flex-col place-items-center justify-between">
      <img
        className="h-10 w-10 cursor-pointer"
        onClick={() => setDropdownToggled(!dropdownToggled)}
        src={account_circle}
        alt="profile"
      />
      {dropdownToggled ? (
        <div className="flex flex-col place-items-center justify-center rounded-xl p-2">
          <h1 className="flex place-items-center justify-center text-lg">{userName}</h1>
          <Form method="POST" action="/logout" className="w-16">
            <button
              onClick={() => setLoggedInStyle("justify-between")}
              type="submit"
              className="flex w-full place-items-center justify-between text-lg"
            >
              <p>logout</p> <img className="h-4 w-4" alt="logout" src={logout}></img>
            </button>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
