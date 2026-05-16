import { css, html, LitElement } from "lit";

import { CindorSplitterPanel } from "../splitter-panel/cindor-splitter-panel.js";

export type SplitterOrientation = "horizontal" | "vertical";

const MOBILE_STACK_BREAKPOINT = 840;

/**
 * Resizable panel group for workbench-style layouts.
 *
 * @fires panel-resize - Fired whenever adjacent panel sizes change.
 *
 * @slot - Direct child `cindor-splitter-panel` elements.
 */
export class CindorSplitter extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
      min-height: 0;
    }

    .splitter {
      position: relative;
      display: flex;
      min-width: 0;
      min-height: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
    }

    .splitter.stacked {
      flex-direction: column;
    }

    :host([orientation="vertical"]) .splitter {
      flex-direction: column;
    }

    ::slotted(cindor-splitter-panel) {
      min-width: 0;
      min-height: 0;
      overflow: auto;
    }

    .handle {
      position: absolute;
      z-index: 1;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    :host([orientation="vertical"]) .handle {
      cursor: row-resize;
    }

    .handle::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--border) 82%, transparent);
      transition:
        background var(--duration-base) var(--ease-out),
        box-shadow var(--duration-base) var(--ease-out);
    }

    .handle:hover::before,
    .handle:focus-visible::before {
      background: color-mix(in srgb, var(--accent) 70%, var(--border));
      box-shadow: var(--ring-focus);
    }

    .handle:focus-visible {
      outline: none;
    }

    .handle.horizontal {
      top: 0;
      bottom: 0;
      width: 0.75rem;
      transform: translateX(-50%);
    }

    .handle.horizontal::before {
      width: 2px;
      height: calc(100% - var(--space-4));
    }

    .handle.vertical {
      left: 0;
      right: 0;
      height: 0.75rem;
      transform: translateY(-50%);
    }

    .handle.vertical::before {
      width: calc(100% - var(--space-4));
      height: 2px;
    }
  `;

  static properties = {
    orientation: { reflect: true }
  };

  orientation: SplitterOrientation = "horizontal";

  private activeDrag: { handleIndex: number; startCoordinate: number; startSizes: number[] } | null = null;
  private mobileStacked = false;
  private readonly panelObserver = new MutationObserver(() => {
    if (!this.syncingPanels) {
      this.syncPanels();
    }
  });
  private panels: CindorSplitterPanel[] = [];
  private resizeObserver?: ResizeObserver;
  private sizes: number[] = [];
  private syncingPanels = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.panelObserver.observe(this, {
      attributes: true,
      attributeFilter: ["min-size", "size"],
      childList: true,
      subtree: true
    });
    this.syncPanels();
    window.addEventListener("pointermove", this.handleWindowPointerMove);
    window.addEventListener("pointerup", this.handleWindowPointerUp);
    window.addEventListener("pointercancel", this.handleWindowPointerUp);
  }

  protected override render() {
    const splitterClass = `splitter${this.mobileStacked ? " stacked" : ""}`;

    return html`
      <div ?data-stacked=${this.mobileStacked} class=${splitterClass} part="splitter">
        <slot @slotchange=${this.handleSlotChange}></slot>
        ${this.mobileStacked ? [] : this.panels.slice(0, -1).map((_, index) => this.renderHandle(index))}
      </div>
    `;
  }

  protected override firstUpdated(): void {
    this.setupResizeObserver();
    queueMicrotask(() => {
      this.syncResponsiveMode();
    });
  }

  protected override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("orientation")) {
      queueMicrotask(() => {
        this.syncResponsiveMode();
      });
    }
  }

  private renderHandle(index: number) {
    const position = this.sizes.slice(0, index + 1).reduce((total, size) => total + size, 0);
    const orientation = this.effectiveOrientation;
    const orientationClass = orientation === "horizontal" ? "horizontal" : "vertical";
    const style = orientation === "horizontal" ? `left: ${position}%;` : `top: ${position}%;`;

    return html`
      <button
        aria-label=${`Resize panels ${index + 1} and ${index + 2}`}
        aria-orientation=${orientation}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow=${String(Math.round(position))}
        class=${`handle ${orientationClass}`}
        part="handle"
        role="separator"
        style=${style}
        type="button"
        @keydown=${(event: KeyboardEvent) => this.handleHandleKeydown(index, event)}
        @pointerdown=${(event: PointerEvent) => this.handlePointerDown(index, event)}
      ></button>
    `;
  }

  private handleSlotChange = (): void => {
    this.syncPanels();
  };

  private handlePointerDown(handleIndex: number, event: PointerEvent): void {
    event.preventDefault();
    this.activeDrag = {
      handleIndex,
      startCoordinate: this.coordinateFor(event),
      startSizes: [...this.sizes]
    };
  }

  private handleWindowPointerMove = (event: PointerEvent): void => {
    if (!this.activeDrag) {
      return;
    }

    const container = this.containerElement;
    if (!container) {
      return;
    }

    const totalSize = this.effectiveOrientation === "horizontal" ? container.clientWidth : container.clientHeight;
    if (totalSize <= 0) {
      return;
    }

    const delta = ((this.coordinateFor(event) - this.activeDrag.startCoordinate) / totalSize) * 100;
    this.applyResize(this.activeDrag.handleIndex, this.activeDrag.startSizes, delta);
  };

  private handleWindowPointerUp = (): void => {
    this.activeDrag = null;
  };

  private handleHandleKeydown(handleIndex: number, event: KeyboardEvent): void {
    const horizontal = this.effectiveOrientation === "horizontal";
    const forwardKey = horizontal ? "ArrowRight" : "ArrowDown";
    const backwardKey = horizontal ? "ArrowLeft" : "ArrowUp";
    const delta = event.shiftKey ? 10 : 5;

    if (event.key !== forwardKey && event.key !== backwardKey) {
      return;
    }

    event.preventDefault();
    this.applyResize(handleIndex, this.sizes, event.key === forwardKey ? delta : -delta);
  }

  private applyResize(handleIndex: number, baseSizes: number[], delta: number): void {
    const leftPanel = this.panels[handleIndex];
    const rightPanel = this.panels[handleIndex + 1];
    if (!leftPanel || !rightPanel) {
      return;
    }

    const combined = baseSizes[handleIndex] + baseSizes[handleIndex + 1];
    const nextLeft = clamp(baseSizes[handleIndex] + delta, leftPanel.minSize, combined - rightPanel.minSize);
    const nextRight = combined - nextLeft;
    const nextSizes = [...baseSizes];
    nextSizes[handleIndex] = nextLeft;
    nextSizes[handleIndex + 1] = nextRight;

    this.setSizes(nextSizes, true);
  }

  private setSizes(nextSizes: number[], emit = false): void {
    const normalized = normalizePercentages(nextSizes);

    this.sizes = normalized;
    this.syncingPanels = true;
    for (const [index, panel] of this.panels.entries()) {
      panel.size = roundPercentage(normalized[index] ?? 0);
      panel.style.flex = `0 0 ${panel.size}%`;
    }
    this.syncingPanels = false;
    this.requestUpdate();

    if (emit) {
      this.dispatchEvent(
        new CustomEvent("panel-resize", {
          bubbles: true,
          composed: true,
          detail: {
            orientation: this.orientation,
            sizes: this.panels.map((panel) => panel.size)
          }
        })
      );
    }
  }

  private syncPanels(): void {
    this.panels = Array.from(this.children).filter((child): child is CindorSplitterPanel => child instanceof CindorSplitterPanel);
    this.setSizes(
      this.panels.length > 0
        ? this.panels.map((panel) => (panel.size > 0 ? panel.size : 100 / this.panels.length))
        : [],
      false
    );
  }

  private coordinateFor(event: PointerEvent): number {
    return this.effectiveOrientation === "horizontal" ? event.clientX : event.clientY;
  }

  private get containerElement(): HTMLElement | null {
    return this.renderRoot.querySelector(".splitter");
  }

  private get effectiveOrientation(): SplitterOrientation {
    return this.mobileStacked ? "vertical" : this.orientation;
  }

  private setupResizeObserver(): void {
    if (this.resizeObserver || typeof ResizeObserver !== "function") {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.syncResponsiveMode();
    });
    this.resizeObserver.observe(this);
  }

  private syncResponsiveMode(): void {
    const nextMobileStacked = this.orientation === "horizontal" && this.clientWidth > 0 && this.clientWidth <= MOBILE_STACK_BREAKPOINT;

    if (this.mobileStacked === nextMobileStacked) {
      return;
    }

    this.mobileStacked = nextMobileStacked;
    this.activeDrag = null;
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.panelObserver.disconnect();
    window.removeEventListener("pointermove", this.handleWindowPointerMove);
    window.removeEventListener("pointerup", this.handleWindowPointerUp);
    window.removeEventListener("pointercancel", this.handleWindowPointerUp);
    super.disconnectedCallback();
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePercentages(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }

  const safeValues = values.map((value) => (Number.isFinite(value) && value > 0 ? value : 0));
  const total = safeValues.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return Array(values.length).fill(100 / values.length);
  }

  return safeValues.map((value) => (value / total) * 100);
}

function roundPercentage(value: number): number {
  return Math.round(value * 100) / 100;
}
