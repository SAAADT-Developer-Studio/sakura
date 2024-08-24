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
    <div className="flex flex-col justify-between place-items-center w-16 h-28 mt-2">
      <img
        className="w-10 h-10 cursor-pointer"
        onClick={() => setDropdownToggled(!dropdownToggled)}
        src={account_circle}
        alt="profile"
      />
      {dropdownToggled ? (
        <div className="p-2 rounded-xl flex justify-center place-items-center flex-col">
          <h1 className="flex justify-center place-items-center text-lg">
            {userName}
          </h1>
          <Form method="POST" action="/logout" className="w-16">
            <button
              onClick={() => setLoggedInStyle("justify-between")}
              type="submit"
              className="w-full flex justify-between place-items-center text-lg"
            >
              <p>logout</p>{" "}
              <img className="w-4 h-4" alt="logout" src={logout}></img>
            </button>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
