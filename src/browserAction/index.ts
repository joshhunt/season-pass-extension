import { createElement } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootNodeId = "react-root";
const rootNode = document.getElementById(rootNodeId);

if (!rootNode) {
  throw new Error(`Extension entry with id "${rootNodeId}" not found`);
}

const root = createRoot(rootNode);
const appElement = createElement(App);

root.render(appElement);
