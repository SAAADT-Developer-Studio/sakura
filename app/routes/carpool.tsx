import { Outlet } from "@remix-run/react";
export default function CarpoolRoot() {
  return (
    <main className="flex justify-center pt-10 h-full">
      <Outlet />
    </main>
  );
}
