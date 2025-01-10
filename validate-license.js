(async function () {
  const localLicenseFile = "https://imoaproductions.neocities.org/license.json";
  const remoteLicenseURL = "https://imoaproductions.neocities.org/licenses.json";
  const currentHost = window.location.hostname;

  try {
    // Fetch local license key
    const localResponse = await fetch(localLicenseFile);
    const localData = await localResponse.json();
    const licenseKey = localData.license_key;

    // Fetch remote licenses
    const remoteResponse = await fetch(remoteLicenseURL);
    const remoteData = await remoteResponse.json();
    const licenses = remoteData.licenses;

    if (licenses[licenseKey]) {
      const license = licenses[licenseKey];

      if (license.active) {
        if (!license.used_on || license.used_on === currentHost) {
          // Update used_on field if not set
          if (!license.used_on) {
            // TODO: Make an API call to Neocities to update `used_on`
            console.log(`Activating license for ${currentHost}`);
          }
          console.log("License validated successfully!");
          return; // Allow site access
        } else {
          console.error("License is already used on another host!");
        }
      } else {
        console.error("License is inactive!");
      }
    } else {
      console.error("License key is invalid!");
    }
  } catch (error) {
    console.error("Error validating license:", error);
  }

  // Redirect to maintenance page on failure
  window.location.href = "D:/Delete/Clash of Clans/Site/maintenance.html";
})();
