import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 6;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - PAGE_MARGIN_MM * 2;
const CV_PADDING = "16mm 20mm";
const PAGE_BREAK_BUFFER_PX = 16;

function safeColor(value: string, fallback: string) {
  return value.includes("oklch") ? fallback : value;
}

function inlineComputedStylesFromSource(source: Element, target: HTMLElement) {
  const computed = window.getComputedStyle(source);
  target.removeAttribute("class");
  target.style.color = safeColor(computed.color, "#000000");
  target.style.backgroundColor = safeColor(computed.backgroundColor, "transparent");
  target.style.fontFamily = computed.fontFamily;
  target.style.fontSize = computed.fontSize;
  target.style.fontWeight = computed.fontWeight;
  target.style.fontStyle = computed.fontStyle;
  target.style.lineHeight = computed.lineHeight;
  target.style.letterSpacing = computed.letterSpacing;
  target.style.textAlign = computed.textAlign;
  target.style.textTransform = computed.textTransform;
  target.style.padding = computed.padding;
  target.style.margin = computed.margin;
  target.style.display = computed.display;
  target.style.flexDirection = computed.flexDirection;
  target.style.justifyContent = computed.justifyContent;
  target.style.alignItems = computed.alignItems;
  target.style.gap = computed.gap;
  target.style.borderTopWidth = computed.borderTopWidth;
  target.style.borderRightWidth = computed.borderRightWidth;
  target.style.borderBottomWidth = computed.borderBottomWidth;
  target.style.borderLeftWidth = computed.borderLeftWidth;
  target.style.borderTopStyle = computed.borderTopStyle;
  target.style.borderRightStyle = computed.borderRightStyle;
  target.style.borderBottomStyle = computed.borderBottomStyle;
  target.style.borderLeftStyle = computed.borderLeftStyle;
  target.style.flexShrink = computed.flexShrink;
}

function inlineTreeFromSource(sourceRoot: Element, targetRoot: Element) {
  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll("*")];
  const targetNodes = [targetRoot, ...targetRoot.querySelectorAll("*")];
  sourceNodes.forEach((source, index) => {
    inlineComputedStylesFromSource(source, targetNodes[index] as HTMLElement);
  });
}

function createExportFrame(widthPx: number) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.border = "0";
  iframe.style.width = `${widthPx}px`;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("Could not create export frame");
  }

  doc.open();
  doc.write('<!DOCTYPE html><html><head></head><body style="margin:0;background:#fff"></body></html>');
  doc.close();

  return { iframe, doc };
}

function getPageShellStyle(element: HTMLElement, widthPx: number) {
  const computed = window.getComputedStyle(element);
  return {
    width: `${widthPx}px`,
    minWidth: `${widthPx}px`,
    padding: CV_PADDING,
    fontFamily: computed.fontFamily,
    backgroundColor: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
  } as const;
}

function getMeasureShellStyle(element: HTMLElement, widthPx: number) {
  const computed = window.getComputedStyle(element);
  return {
    width: `${widthPx}px`,
    minWidth: `${widthPx}px`,
    padding: CV_PADDING,
    fontFamily: computed.fontFamily,
    backgroundColor: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
  } as const;
}

function collectPageBlocks(element: HTMLElement) {
  const blocks = element.querySelectorAll("[data-page-block]");
  if (blocks.length > 0) {
    return Array.from(blocks);
  }
  return Array.from(element.children);
}

function resetTopMarginForPageStart(root: HTMLElement) {
  root.style.marginTop = "0";
  const firstChild = root.firstElementChild as HTMLElement | null;
  if (!firstChild) return;

  const view = root.ownerDocument.defaultView;
  if (!view) return;

  const marginTop = parseFloat(view.getComputedStyle(firstChild).marginTop) || 0;
  if (marginTop > 0) {
    firstChild.style.marginTop = "0";
  }
}

function appendBlocksToShell(
  shell: HTMLElement,
  blocks: Element[],
  resetFirstMargin: boolean,
) {
  shell.replaceChildren();
  blocks.forEach((block, index) => {
    const clone = block.cloneNode(true) as HTMLElement;
    clone.style.width = "100%";
    shell.appendChild(clone);
    inlineTreeFromSource(block, clone);
    if (resetFirstMargin && index === 0) {
      resetTopMarginForPageStart(clone);
    }
  });
}

function measureStackHeight(shell: HTMLElement, blocks: Element[]) {
  appendBlocksToShell(shell, blocks, true);
  return shell.scrollHeight;
}

function paginateBlocks(blocks: Element[], element: HTMLElement, pageHeightPx: number) {
  const widthPx = element.scrollWidth;
  const { iframe, doc } = createExportFrame(widthPx);
  const shell = doc.createElement("div");
  Object.assign(shell.style, getMeasureShellStyle(element, widthPx));
  doc.body.appendChild(shell);

  const heightLimit = pageHeightPx - PAGE_BREAK_BUFFER_PX;
  const pages: Element[][] = [];
  let currentPage: Element[] = [];

  for (const block of blocks) {
    const trial = [...currentPage, block];
    const stackHeight = measureStackHeight(shell, trial);

    if (stackHeight > heightLimit && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [block];
    } else {
      currentPage = trial;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  iframe.remove();
  return pages;
}

async function captureInFrame(root: HTMLElement, widthPx: number) {
  const { iframe, doc } = createExportFrame(widthPx);
  const clone = root.cloneNode(true) as HTMLElement;
  clone.style.width = `${widthPx}px`;
  clone.style.minWidth = `${widthPx}px`;
  clone.style.boxSizing = "border-box";
  clone.style.padding = CV_PADDING;
  inlineTreeFromSource(root, clone);
  doc.body.appendChild(clone);

  try {
    return await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: widthPx,
      windowWidth: widthPx,
      windowHeight: clone.scrollHeight,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
        clonedDoc.documentElement.style.backgroundColor = "#ffffff";
        clonedDoc.body.style.backgroundColor = "#ffffff";
      },
    });
  } finally {
    iframe.remove();
  }
}

async function capturePage(
  blocks: Element[],
  element: HTMLElement,
  widthPx: number,
) {
  const { iframe, doc } = createExportFrame(widthPx);
  const page = doc.createElement("div");
  Object.assign(page.style, getPageShellStyle(element, widthPx));

  blocks.forEach((block, index) => {
    const clone = block.cloneNode(true) as HTMLElement;
    clone.style.width = "100%";
    page.appendChild(clone);
    inlineTreeFromSource(block, clone);
    if (index === 0) {
      resetTopMarginForPageStart(clone);
    }
  });

  doc.body.appendChild(page);

  try {
    return await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: widthPx,
      windowWidth: widthPx,
      windowHeight: page.scrollHeight,
      onclone: (clonedDoc, clonedPage) => {
        clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
        clonedDoc.documentElement.style.backgroundColor = "#ffffff";
        clonedDoc.body.style.backgroundColor = "#ffffff";
        clonedPage.style.width = `${widthPx}px`;
        clonedPage.style.minWidth = `${widthPx}px`;
        clonedPage.style.padding = CV_PADDING;
        clonedPage.style.boxSizing = "border-box";
      },
    });
  } finally {
    iframe.remove();
  }
}

export async function exportCVAsPNG(element: HTMLElement, filename: string) {
  const canvas = await captureInFrame(element, element.scrollWidth);
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportCVAsPDF(element: HTMLElement, filename: string) {
  const widthPx = element.scrollWidth;
  const pageHeightPx = Math.floor((widthPx * CONTENT_HEIGHT_MM) / A4_WIDTH_MM);

  const blocks = collectPageBlocks(element);
  const pages = paginateBlocks(blocks, element, pageHeightPx);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let index = 0; index < pages.length; index++) {
    if (index > 0) pdf.addPage();

    const canvas = await capturePage(pages[index], element, widthPx);
    const sliceHeightMm = Math.min(
      (canvas.height * A4_WIDTH_MM) / canvas.width,
      CONTENT_HEIGHT_MM,
    );

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      PAGE_MARGIN_MM,
      A4_WIDTH_MM,
      sliceHeightMm,
    );
  }

  pdf.save(filename);
}
