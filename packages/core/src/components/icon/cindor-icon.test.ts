import "../../register.js";

import { CindorIcon } from "./cindor-icon.js";

describe("cindor-icon", () => {
  it("renders a Lucide icon with accessible labelling", async () => {
    const element = document.createElement("cindor-icon") as CindorIcon;
    element.name = "alarm-clock";
    element.label = "Alarm clock";
    element.size = 18;
    element.strokeWidth = 1.5;
    document.body.append(element);
    await element.updateComplete;

    const icon = element.renderRoot.querySelector("svg");

    expect(icon?.getAttribute("aria-label")).toBe("Alarm clock");
    expect(icon?.getAttribute("width")).toBe("18");
    expect(icon?.getAttribute("stroke-width")).toBe("1.5");
    expect(icon?.querySelectorAll("*").length).toBeGreaterThan(0);
  });

  it("normalizes Lucide export names to kebab-case icon names", async () => {
    const element = document.createElement("cindor-icon") as CindorIcon;
    element.name = "AlarmClock";
    document.body.append(element);
    await element.updateComplete;

    expect(element.renderRoot.querySelector("svg")).not.toBeNull();
  });
});
