import { Outlet } from "@remix-run/react";

export default function CarpoolRoot() {
  return (
    <main className="flex justify-center mt-10">
      <Outlet />
    </main>
  );
}
