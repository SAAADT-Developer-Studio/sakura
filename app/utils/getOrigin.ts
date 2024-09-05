export function getOrigin() {
  return window.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3000";
}
