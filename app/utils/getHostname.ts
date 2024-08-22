export function getHostname() {
  return window.env.NODE_ENV === "production"
    ? window.location.hostname
    : "localhost:3000";
}
