//import { AnnotationStatus } from '@admiin-com/ds-graphql';
import { TaskDirection } from '@admiin-com/ds-graphql';
import PSPDFKit, { AnnotationsUnion, Color } from 'pspdfkit';
import { renderToString } from 'react-dom/server';
import { v4 as uuidv4 } from 'uuid';

export const dataURLToBlob = (dataURL: string) => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
function getPageVisibleRect(pdfSignatureRef: any, pageIndex: any) {
  // Page DOM element.
  const pageEl = pdfSignatureRef.contentDocument.querySelector(
    `.PSPDFKit-Page[data-page-index="${pageIndex}"]`
  );
  const pageBoundingClientRect = pageEl.getBoundingClientRect();
  // Viewport DOM element.
  const viewportEl =
    pdfSignatureRef.contentDocument.querySelector('.PSPDFKit-Viewport');

  // Get the visible page area in page units.
  return pdfSignatureRef.transformContentClientToPageSpace(
    new PSPDFKit.Geometry.Rect({
      left: Math.max(pageBoundingClientRect.left, 0),
      top: Math.max(pageBoundingClientRect.top, 0),
      width: Math.min(pageEl.clientWidth, viewportEl.clientWidth),
      height: Math.min(pageEl.clientHeight, viewportEl.clientHeight),
    }),
    pageIndex
  );
}

export function isAnnotationInsidePage(
  pdfSignatureRef: any,
  pageIndex: any,
  annotation: any
) {
  const pageRect = getPageVisibleRect(pdfSignatureRef, pageIndex);
  return annotation.boundingBox.isRectOverlapping(pageRect);
}
// remove blank space from canvas
export function trimCanvas(canvas: HTMLCanvasElement) {
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) {
    return '';
  }
  croppedCanvas.width = canvas.width;
  croppedCanvas.height = canvas.height;
  croppedCtx.drawImage(canvas, 0, 0);

  let w = croppedCanvas.width;
  let h = croppedCanvas.height;
  const pix: {
    x: number[];
    y: number[];
  } = { x: [], y: [] };
  const imageData = croppedCtx.getImageData(0, 0, w, h);

  let index = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      index = (y * w + x) * 4;

      if (
        imageData.data[index] === 255 &&
        imageData.data[index + 1] === 255 &&
        imageData.data[index + 2] === 255 &&
        imageData.data[index + 3] === 255
      ) {
        continue;
      }

      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }

  pix.x.sort((a, b) => a - b);
  pix.y.sort((a, b) => a - b);
  const n = pix.x.length - 1;

  if (pix.x.length === 0 && pix.y.length === 0) {
    return '';
  }
  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  const cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h);

  croppedCanvas.width = w + 40;
  croppedCanvas.height = h + 40;
  croppedCtx.putImageData(cut, 20, 20);

  return croppedCanvas.toDataURL();
}

export const getExtensionFromContentType = (contentType: string) =>
  contentType.split('/').pop();

export function getBlobFromCanvas(canvas: HTMLCanvasElement) {
  const dataUrl: string = trimCanvas(canvas);
  return dataURLToBlob(dataUrl);
}

export async function downloadPdf(pdfSignatureRef: any, name = 'document.pdf') {
  const pdf = await pdfSignatureRef?.current?.exportPDF({
    flatten: true,
  });
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export const createCustomSignatureNode = (
  placeholderUi: any,
  customData: any
) => {
  const isPlaceholderView = customData?.status === 'PENDING'; //AnnotationStatus.PENDING;
  const div = document.createElement('div');
  if (isPlaceholderView) {
    div.style.cssText = 'height: 100%;display: flex;align-items: center;';
    //@ts-ignore TODO: resolve type issue
    div.innerHTML = renderToString(placeholderUi);
  }
  return div;
};

const getDefaultAnnotationData = (annotation: AnnotationsUnion) => {
  const { pageIndex, bbox, name, id, customData } = annotation;

  const updatedId = uuidv4();
  const annotationObj = {
    pageIndex,
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: bbox[0],
      top: bbox[1],
      width: bbox[2],
      height: bbox[3],
    }),
    id: updatedId,
    lockedContents: true,
    fontSize: 12,
    customData: {
      ...customData,
      //status: AnnotationStatus.ACTIONED,
      status: 'ACTIONED',
    },
    backgroundColor: Color.TRANSPARENT,
  };
  return annotationObj;
};

export const getAnnotation = (
  annotation: AnnotationsUnion,
  signatureAttachmentId: string,
  readOnly = false
) => {
  const defaultdAnnotation = getDefaultAnnotationData(annotation);
  let updateAnnotation;
  if (annotation?.customData?.type === 'DATE') {
    updateAnnotation = new PSPDFKit.Annotations.TextAnnotation({
      ...defaultdAnnotation,
      readOnly,
      text: {
        format: 'plain',
        value: new Date().toLocaleDateString() || '2024',
      },
    });
  } else if (annotation?.customData?.type === 'SIGNATURE') {
    updateAnnotation = new PSPDFKit.Annotations.ImageAnnotation({
      ...defaultdAnnotation,
      readOnly,
      contentType: 'image/jpeg',
      imageAttachmentId: signatureAttachmentId,
    });
  } else if (annotation?.customData?.type === 'NAME') {
    updateAnnotation = new PSPDFKit.Annotations.TextAnnotation({
      ...defaultdAnnotation,
      readOnly,
      text: {
        format: 'plain',
        value: (annotation?.customData?.name as string) || 'Sample text', // TODO : added text
      },
    });
  }
  return updateAnnotation;
};
export function checkIfValidHexColor(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}
const SIGNATURE_COLORS = [
  { iconColour: '#E5CA4C', backgroundColor: '#F7EDC4' },
  { iconColour: '#9DDC8B', backgroundColor: '#D7F7CE' },
  { iconColour: '#8FCFE7', backgroundColor: '#C4E9F7' },
  { iconColour: '#CEA3FC', backgroundColor: '#DDC4F7' },
  { iconColour: '#FFB48F', backgroundColor: '#F7CEBA' },
];

export function getSignatureColor(index: number) {
  if (index === -1) return '#FFFFFF';
  return SIGNATURE_COLORS[index % 5].backgroundColor;
}

export function getSignatureIconColor(backgroundColor: string) {
  const index = SIGNATURE_COLORS.findIndex(
    (color) => color.backgroundColor === backgroundColor
  );
  return SIGNATURE_COLORS[index % 5]?.iconColour ?? '#fff';
}

export const checkAnnotationDirection = (annotationJson: string) => {
  const annotations = JSON.parse(annotationJson)?.annotations;
  for (const annotation of annotations) {
    if (
      annotation.customData?.status === 'PENDING' &&
      annotation.customData?.signerType !== 'ENTITY_USER'
    )
      return TaskDirection.SENDING;
  }
  return TaskDirection.RECEIVING;
};

export const signedAndPendingUserNames = (
  annotationsJson: string | null | undefined
) => {
  if (!annotationsJson) return { signedUsersName: [], pendingUsersName: [] };
  const annotations = JSON.parse(annotationsJson)?.annotations;
  const pendingUsersNameSet = new Set<string>();
  const signedUsersNameSet = new Set<string>();
  for (const annotation of annotations) {
    if (annotation.customData?.status === 'ACTIONED') {
      signedUsersNameSet.add(annotation.customData?.name as string);
    } else {
      pendingUsersNameSet.add(annotation.customData?.name as string);
    }
  }

  const pendingUsersName = Array.from(pendingUsersNameSet);
  const signedUsersName = Array.from(signedUsersNameSet);
  return { signedUsersName, pendingUsersName };
};
