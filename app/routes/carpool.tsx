import { Outlet } from "@remix-run/react";
export default function CarpoolRoot() {
  return (
    <main className="flex h-full justify-center pt-10">
      <Outlet />
    </main>
  );
}
