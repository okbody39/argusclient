// Example url API
const URL_API = "http://localhost:8000";

// Example Key JWT
const KEY_JWT = "ABC123456";

// Example Images
const IMAGES = {
  LOGO: require("../assets/images/argusclient-logo.png"),
  ICON: require("../assets/images/argus-icon.png"),
};

const ISFULLSCREEN = (path) => {
  let fullscreen = [
    "/",
    "/signin",
    "/signup",
    "/diagnosis",
    "/notfound",
  ];

  return fullscreen.indexOf(path) !== -1;

};

export { URL_API, KEY_JWT, IMAGES, ISFULLSCREEN};
