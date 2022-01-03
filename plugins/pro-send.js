// Better Move
//
// No more clicking and dragging to move
const { getPlanetName } = df.getProcgenUtils();
class ProSend {
  constructor() {
    this.origin = document.createElement("span");
    this.origin.readOnly = true;
    this.origin.innerText = "???";
    this.origin.style.textAlign = "center";
    this.origin.style.border = "thin dotted";
    this.origin.style.width = "80%";

    this.dest = document.createElement("span");
    this.dest.readOnly = true;
    this.dest.innerText = "???";
    this.dest.style.textAlign = "center";
    this.dest.style.border = "thin dotted";
    this.dest.style.width = "80%";

    this.energyLabel = this.createElem("div", "Energy", "left");

    this.destPlanet = null;
    this.originPlanet = null;

    this.minEnergy = 0;
    this.energy = -1;
    this.silver = -1;
    this.receiveMessage = this.createElem("div", "", "left");

    this.energyStats = {
      energyRange: this.createRange(50),
      energyPercentLabel: this.createElem("span", `??%`, "center"),
      energyValueLabel: this.createElem("span", "???", "center"),
    };

    this.energyStats.energyPercentLabel.style.marginRight = "1rem";
    this.energyStats.energyPercentLabel.style.marginLeft = ".5rem";

    this.energyStats.energyRange.onchange = (evt) => {
      this.energy = this.originPlanet ? evt.target.value : 0;
      this.energyStats.energyPercentLabel.innerText =
        this.energy > 0
          ? `${Math.round(
              (100 * evt.target.value) / this.originPlanet.energy
            )}% `
          : `??%`;
      this.energyStats.energyValueLabel.innerText = `${this.energy}`;
      this.destPlanet ? this.receiveMessage.innerHTML = `${getPlanetName(
        this.destPlanet
      )} will receive ${this.silver} silver and ${Math.round(df.getEnergyArrivingForMove(
        this.originPlanet.locationId,
        this.destPlanet.locationId,
        undefined,
        this.energy)
      )} energy` : null;

      try {
        this.energy = parseInt(evt.target.value, 10);
      } catch (e) {
        console.error("could not parse energy percent", e);
      }
    };
    this.silverStats = {
      silverRange: this.createRange(50),
      silverPercentLabel: this.createElem("span", `??%`, "center"),
      silverValueLabel: this.createElem("span", "???", "center"),
    };

    this.silverStats.silverPercentLabel.style.marginRight = "1rem";
    this.silverStats.silverPercentLabel.style.marginLeft = ".5rem";

    this.silverStats.silverRange.onchange = (evt) => {
      this.silver = this.originPlanet ? evt.target.value : 0;
      this.silverStats.silverPercentLabel.innerText =
        this.silver > 0
          ? `${Math.round(
              (100 * evt.target.value) / this.originPlanet.silver
            )}% `
          : `??%`;
      this.silverStats.silverValueLabel.innerText = `${this.silver}`;
      this.destPlanet ? this.receiveMessage.innerHTML = `${getPlanetName(
        this.destPlanet
      )} will receive ${this.silver} silver and ${Math.round(df.getEnergyArrivingForMove(
        this.originPlanet.locationId,
        this.destPlanet.locationId,
        undefined,
        this.energy)
      )} energy` : null;
      try {
        this.silver = parseInt(evt.target.value, 10);
      } catch (e) {
        console.error("could not parse silver percent", e);
      }
    };

    this.moveTime = this.createElem("div", "Move time: ???", "left");
  }

  setPlanet = () => {
    let planet = ui.getMouseDownPlanet();
    // console.log(`planet clicked: ${JSON.stringify(planet)}`);
    //   this.originPlanet = planet;
    //   this.origin.innerText = `Origin: ${planet.locationId}`

    if (!planet) {
      this.originPlanet = null;
      this.destPlanet = null;
      this.origin.innerText = "???";
      this.dest.innerText = "???";
      this.moveTime.innerHTML = "Move time: ???";
      this.energyLabel.innerHTML = `Energy`;
      this.energyStats.energyPercentLabel.innerHTML = "??%";
      this.silverStats.silverPercentLabel.innerHTML = "??%";
      this.energyStats.energyValueLabel.innerHTML = "???";
      this.silverStats.silverValueLabel.innerHTML = "???";
      this.receiveMessage.innerHTML = "";

      return;
    }

    if (!this.originPlanet) {
      console.log(`no origin planet`);
      this.originPlanet = planet;
      this.origin.innerHTML = `${getPlanetName(this.originPlanet)}`;
      this.moveTime.innerHTML = "Move time: ???";
      this.energyLabel.innerHTML = `Energy`;
      this.energy = Math.round(planet.energy * 0.5);
      this.silver = Math.round(planet.silver * 0.5);
      console.log(
        `energy: ${this.energy}, silver: ${this.silver} planet energy: ${planet.energy}, planet silver: ${planet.silver}`
      );

      this.energyStats.energyRange.max = `${planet.energy}`;
      this.energyStats.energyRange.value = `${this.energy}`;
      this.energyStats.energyPercentLabel.innerHTML = `${Math.round(
        (100 * this.energy) / planet.energy
      )}%`;
      this.energyStats.energyValueLabel.innerHTML = `${this.energy}`;

      this.silverStats.silverRange.max = `${planet.silver}`;
      this.silverStats.silverRange.value = `${this.silver}`;
      this.silverStats.silverPercentLabel.innerHTML = `${Math.round(
        (100 * this.silver) / planet.silver
      )}%`;
      this.silverStats.silverValueLabel.innerHTML = `${this.silver}`;

      return;
    }
    if (this.originPlanet == planet) return;
    this.destPlanet = planet;
    this.dest.innerHTML = `${getPlanetName(this.destPlanet)}`;
    // console.log(df.getTimeForMove(this.originPlanet.locationId, planet.locationId))
    this.moveTime.innerHTML = `Move time: ${Math.round(
      df.getTimeForMove(this.originPlanet.locationId, planet.locationId)
    )} secs`;
    const minEnergy = df.getEnergyNeededForMove(
      this.originPlanet.locationId,
      planet.locationId,
      0
    );
    console.log(minEnergy);
    this.energyLabel.innerHTML = `Energy:(minimum ${Math.round(minEnergy)})`;
    this.receiveMessage.innerHTML = `${getPlanetName(
      this.destPlanet
    )} will receive ${this.silver} silver and ${Math.round(df.getEnergyArrivingForMove(
      this.originPlanet.locationId,
      this.destPlanet.locationId,
      undefined,
      this.energy)
    )} energy`;
    // while(){}
  };

  // updateEnergy (newEnergy) => {

  // }

  // updateSilver (newSilver) => {

  // }

  createRange = (value) => {
    let range = document.createElement("input");
    range.type = "range";
    range.min = this.minEnergy;
    range.max = "100";
    range.step = "1";
    range.value = value;
    range.style.width = "70%";
    range.style.height = "24px";
    // range.disabled = this.originPlanet == null;
    return range;
  };

  createInput = (value) => {
    let range = document.createElement("input");

    range.style.width = "5%";
    range.style.height = "24px";
    // range.disabled = this.originPlanet == null;
    return range;
  };

  createElem = (type, value, align) => {
    let label = document.createElement(type);
    label.innerText = `${value}`;
    label.style.textAlign = align;
    return label;
  };

  render(container) {
    container.style.width = "400px";
    container.style.minHeight = "unset";
    window.addEventListener("mousedown", this.setPlanet);

    let moveButton = document.createElement("button");

    moveButton.style.width = "100%";
    moveButton.style.marginBottom = "10px";
    moveButton.innerHTML = "Move";
    moveButton.disabled = this.destPlanet;
    moveButton.onclick = () => {
      // let selected = this.destPlanet;
      if (this.destPlanet) {
        setTimeout(() => {
          let res = df.move(
            this.originPlanet.locationId,
            this.destPlanet.locationId,
            this.energy,
            this.silver
          );
        }, 0);
      } else {
        console.log("no planet selected");
      }
    };

    container.appendChild(this.createElem("div", "Better Move", "center"));

    container.appendChild(this.createElem("div", "Origin", "left"));
    container.appendChild(this.origin);

    // container.appendChild(br);
    container.appendChild(this.createElem("div", "Destination", "left"));
    container.appendChild(this.dest);

    // container.appendChild(br);
    container.appendChild(this.energyLabel);

    let energy = document.createElement("div");
    energy.style.display = "inline-flex";
    energy.style.flexDirection = "row";
    energy.style.width = "100%";

    energy.appendChild(this.energyStats.energyRange);
    energy.appendChild(this.energyStats.energyPercentLabel);
    energy.appendChild(this.energyStats.energyValueLabel);
    container.appendChild(energy);
    container.appendChild(this.createElem("div", "Silver", "left"));

    let silver = document.createElement("div");
    silver.style.display = "inline-flex";
    silver.style.flexDirection = "row";
    silver.style.width = "100%";
    silver.appendChild(this.silverStats.silverRange);
    silver.appendChild(this.silverStats.silverPercentLabel);
    silver.appendChild(this.silverStats.silverValueLabel);

    container.appendChild(silver);
    container.appendChild(this.moveTime);
    container.appendChild(document.createElement("hr"));

    container.appendChild(this.receiveMessage);
    container.appendChild(moveButton);

    // container.appendChild(this.estimatedTimeSeconds);
  }

  destroy() {
    window.removeEventListener("mousedown", this.setPlanet);
    delete this.origin;
    delete this.dest;

    // delete this.estimatedTimeSeconds
  }
}

export default ProSend;
