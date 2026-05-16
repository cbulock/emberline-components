import "../../register.js";

import { CindorSplitterPanel } from "../splitter-panel/cindor-splitter-panel.js";
import { CindorSplitter } from "./cindor-splitter.js";

describe("cindor-splitter", () => {
  it("distributes panel sizes when no explicit sizes are provided", async () => {
    const element = document.createElement("cindor-splitter") as CindorSplitter;
    element.innerHTML = `
      <cindor-splitter-panel><p>Navigation</p></cindor-splitter-panel>
      <cindor-splitter-panel><p>Content</p></cindor-splitter-panel>
    `;
    document.body.append(element);
    await element.updateComplete;

    const panels = element.querySelectorAll("cindor-splitter-panel");
    expect((panels[0] as HTMLElement).style.flex).toContain("50%");
    expect((panels[1] as HTMLElement).style.flex).toContain("50%");
  });

  it("resizes adjacent panels with keyboard interaction", async () => {
    const element = document.createElement("cindor-splitter") as CindorSplitter;
    element.innerHTML = `
      <cindor-splitter-panel size="40"></cindor-splitter-panel>
      <cindor-splitter-panel size="60"></cindor-splitter-panel>
    `;
    document.body.append(element);
    await element.updateComplete;

    const handle = element.renderRoot.querySelector('[part="handle"]') as HTMLButtonElement;
    handle.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }));
    await element.updateComplete;

    const panels = element.querySelectorAll("cindor-splitter-panel");
    expect((panels[0] as CindorSplitterPanel).size).toBeGreaterThan(40);
  });

  it("stacks horizontal panels on narrow widths and hides resize handles", async () => {
    const resizeObserverController = installResizeObserverMock();
    const element = document.createElement("cindor-splitter") as CindorSplitter;
    Object.defineProperty(element, "clientWidth", { configurable: true, value: 640 });
    element.innerHTML = `
      <cindor-splitter-panel size="40"></cindor-splitter-panel>
      <cindor-splitter-panel size="60"></cindor-splitter-panel>
    `;
    document.body.append(element);
    await element.updateComplete;

    resizeObserverController.flush();
    await element.updateComplete;

    expect(element.renderRoot.querySelector(".splitter")?.hasAttribute("data-stacked")).toBe(true);
    expect(element.renderRoot.querySelector('[part="handle"]')).toBeNull();

    resizeObserverController.restore();
  });
});

function installResizeObserverMock(): { flush: () => void; restore: () => void } {
  const callbacks = new Set<ResizeObserverCallback>();
  const originalResizeObserver = globalThis.ResizeObserver;

  class ResizeObserverMock {
    constructor(private readonly callback: ResizeObserverCallback) {
      callbacks.add(callback);
    }

    disconnect(): void {
      callbacks.delete(this.callback);
    }

    observe(): void {}

    unobserve(): void {}
  }

  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

  return {
    flush: () => {
      for (const callback of callbacks) {
        callback([], {} as ResizeObserver);
      }
    },
    restore: () => {
      globalThis.ResizeObserver = originalResizeObserver;
    }
  };
}
