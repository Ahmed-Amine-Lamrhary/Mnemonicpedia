self.addEventListener("install", (e) => {
  console.log("Service Worker Installed");
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker Activated");
});

self.addEventListener("fetch", (event) => {
  const token = new URL(location).searchParams.get("token");

  const currentUrl = new URL(event.request.url);

  if (currentUrl.origin === location.origin) {
    const newRequest = new Request(event.request, {
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "x-auth-token": token,
      },
    });
    event.respondWith(fetch(newRequest));
  } else {
    event.respondWith(fetch(event.request));
  }
});
