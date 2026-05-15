import { html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import * as Lucide from "lucide";

import type { IconNode } from "lucide";

type SvgAttributeValue = boolean | number | string | undefined;
type IconAttributes = Record<string, SvgAttributeValue>;
type LucideIconNode = IconNode;

export const lucideIcons = Object.freeze(
  Object.entries(Lucide).reduce<Record<string, LucideIconNode>>((icons, [exportName, value]) => {
    if (isLucideIconNode(value)) {
      icons[normalizeIconName(exportName)] = value;
    }

    return icons;
  }, {})
);

export const lucideIconNames = Object.freeze(Object.keys(lucideIcons));

export type LucideIconName = keyof typeof lucideIcons;

export type RenderLucideIconOptions = {
  attributes?: Record<string, SvgAttributeValue>;
  label?: string;
  name: LucideIconName | string;
  size?: number;
  strokeWidth?: number;
};

export function renderLucideIcon({
  attributes = {},
  label = "",
  name,
  size = 24,
  strokeWidth = 2.25
}: RenderLucideIconOptions) {
  const iconNode = lucideIcons[normalizeIconName(name)];

  if (!iconNode) {
    return nothing;
  }

  const svgAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": strokeWidth,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    focusable: "false",
    role: label ? "img" : "presentation",
    "aria-hidden": label ? undefined : "true",
    "aria-label": label || undefined,
    style: [
      "overflow: visible",
      "transform-box: fill-box",
      "transform-origin: center",
      "stroke-linecap: var(--cindor-lucide-icon-linecap, round)",
      "stroke-linejoin: var(--cindor-lucide-icon-linejoin, round)",
      `stroke-width: var(--cindor-lucide-icon-stroke-width, ${strokeWidth})`,
      "transform: var(--cindor-lucide-icon-transform, none)",
      "filter: var(--cindor-lucide-icon-filter, none)"
    ].join("; "),
    ...attributes
  };

  return html`${unsafeSVG(
    `<svg ${serializeAttributes(svgAttributes)}>${iconNode
      .map(([tagName, iconAttributes]) => `<${tagName} ${serializeAttributes(iconAttributes)}></${tagName}>`)
      .join("")}</svg>`
  )}`;
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeIconName(name: string): string {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function isLucideIconNode(value: unknown): value is LucideIconNode {
  return Array.isArray(value) && value.every(isLucideIconNodeChild);
}

function isLucideIconNodeChild(value: unknown): value is LucideIconNode[number] {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [tagName, attributes] = value;

  return typeof tagName === "string" && isIconAttributes(attributes);
}

function isIconAttributes(value: unknown): value is IconAttributes {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(
    (attributeValue) =>
      attributeValue === undefined ||
      typeof attributeValue === "boolean" ||
      typeof attributeValue === "number" ||
      typeof attributeValue === "string"
  );
}

function serializeAttributes(attributes: IconAttributes): string {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }

      return `${key}="${escapeAttribute(String(value))}"`;
    })
    .join(" ");
}
