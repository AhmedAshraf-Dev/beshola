export function RunOnlyInDeployment(callback) {
  // const isLocalhost =
  //   window.location.hostname === "localhost" ||
  //   window.location.hostname === "127.0.0.1";

  if (typeof callback === "function") {
    callback();
  }
}
