export function getHostname() {
  console.log(window.env);
  return window.env.NODE_ENV === "production"
    ? window.location.hostname
    : "localhost:3000";
}
