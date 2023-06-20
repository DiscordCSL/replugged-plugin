const serverHeader = "container-1NXEtd";
const serverName = "name-3Uvkvr";
const loadingSplash = "container-2RRFHK";
const manifestVersion = "5.0.1";

// CDSL Console Log
function log(input: string, type: string | null): string {
  let color;
  if (type == "info") {
    color = "#43b581";
  } else if (type == "warn") {
    color = "#faa61a";
  } else if (type == "error") {
    color = "#f04747";
  } else {
    color = "#7289da";
  }
  console.log(
    `%cDiscord CSL v${manifestVersion}%c ${input}`,
    `color: ${color}; padding: 3px; border-radius: 4px; background: ${color}22; border-right: 2px solid ${color}; padding-right: 5px; padding-left: 6px; font-weight: bold`,
    "font-style: italic;",
    "",
  );
}

// Server Logo Styling
function addStyle(): string {
  const style = document.createElement("style");
  style.textContent = `
[csl-server] div.guildIconContainer-3QvE6w {
    transform: translate(-6%, 6%)
}
[csl-server] .${serverName} {
    display: flex;
    justify-content: center;
    position: relative;
}

/* == Shrink server banners to header instead of disappearing == */
[csl-server] [class*="animatedContainer-"] {
    opacity: 1 !important;
    transition: opacity .5s, blur .5s;
}
[csl-server] [class*="animatedContainer-"] > [class*="bannerImage-"] {
    transition: margin .5s;
}
[csl-server] :not([class*="bannerVisible-"]) > [class*="animatedContainer-"] {
    opacity: .35 !important;
    filter: blur(2px);
    height: 138px;
}
[csl-server] :not([class*="bannerVisible-"]) > [class*="animatedContainer-"] > [class*="bannerImage-"] {
    margin-top: -12px;
}`;
  style.id = "DiscordCSL-style";
  document.head.append(style);
}

function removeStyle(): string {
  let removeData = document.getElementById("DiscordCSL-style");
  removeData!.parentNode!.removeChild(removeData!);
}

// Fetching the database
let data: { servers: string };
let getDB = async (): string => {
  const response = await fetch(
    "https://raw.githubusercontent.com/DiscordCSL/database/main/db.json",
  );
  const fetchData = await response.json();
  data = fetchData;
  log("Thanks for installing Custom Server Logos!", null);
  if (fetchData.latestVersion > manifestVersion) {
    log(
      `You're running an older version of this plugin. Update to v${fetchData.latestVersion}`,
      "error",
    );
  } else {
    log("You're running the latest and greatest!", "info");
  }
};

// Injecting the logo
let injectLogo = (): string => {
  if (
    !document.getElementsByClassName(loadingSplash)[0] &&
    window.location.pathname.split("/")[1] == "channels" &&
    !(window.location.pathname.split("/")[2] == "@me")
  ) {
    if (!document.getElementsByClassName(serverHeader)[0].hasAttribute("csl-server")) {
      for (let i = 0; i < data.servers.length; i++) {
        if (data.servers[i].id == window.location.pathname.split("/")[2]) {
          if (!document.getElementsByClassName(serverHeader)[0].hasAttribute("csl-server")) {
            document.getElementsByClassName(serverHeader)[0].setAttribute("csl-server", "");
          }
          fetch(data.servers[i].logoURL)
            .then((response) => response.text())
            .then((response) => {
              document.getElementsByClassName(serverName)[0].innerHTML = response;
            });
        }
      }
    }
  }
};

// Plugin Stuff

let inject = setInterval(injectLogo, 0);
export function start(): void {
  addStyle();
  setTimeout(function () {
    getDB();
  }, 3000);
  inject;
}

export function stop(): void {
  removeStyle();
  clearInterval(inject);
  log("See ya next time!", null);
}
