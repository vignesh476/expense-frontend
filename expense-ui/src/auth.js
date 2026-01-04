export function login(tokens) {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login";
}

export function isAuth() {
  return !!localStorage.getItem("access_token");
}
