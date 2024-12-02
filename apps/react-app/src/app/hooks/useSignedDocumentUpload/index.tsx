import { TaskGuest } from '@admiin-com/ds-graphql';
import { AnnotationsUnion } from 'pspdfkit';
import { PdfPlaceholderV2 } from '../../components/PdfPlaceholder/PdfPlaceholder';
import { createCustomSignatureNode } from '../../helpers/signature';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3Storage } from '@admiin-com/ds-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
const { VITE_PSPDFKIT_KEY } = import.meta.env;
const renderConfigurations: Record<any, any> = {};

const getAnnotationRenderers = ({
  annotation,
}: {
  annotation: AnnotationsUnion;
}) => {
  // Use cached render configuration
  if (renderConfigurations[annotation.id]) {
    return renderConfigurations[annotation.id];
  }

  const { customData } = annotation;
  const placeholderUi = <PdfPlaceholderV2 customData={customData} />;
  const customNode = createCustomSignatureNode(placeholderUi, customData);

  renderConfigurations[annotation.id] = {
    node: customNode,
    append: true,
  };
  return renderConfigurations[annotation.id] || null;
};

export const useSignedDocumentUpload = () => {
  const instanceRef = React.useRef<any>(null);
  const uploadSignedDocument = async (
    documentUrl: string,
    taskGuest?: TaskGuest,
    annotations?: null | string
  ) => {
    const PSPDFKit: any = await import('pspdfkit');

    const pspdfParams: any = {
      // TODO: types for init pspdfkit
      document: documentUrl,
      licenseKey: VITE_PSPDFKIT_KEY,
      baseUrl: `${window.location.origin}/`,
      toolbarItems: [],
      headless: true,
      disableTextSelection: false,
      customRenderers: {
        Annotation: getAnnotationRenderers,
      },
      styleSheets: ['/viewer.css'],
      initialViewState: new PSPDFKit.ViewState({ readOnly: true }),
    };

    if (annotations) {
      pspdfParams.instantJSON = JSON.parse(annotations);
    }

    instanceRef.current = await PSPDFKit.load(pspdfParams);

    const viewState = instanceRef?.current?.viewState;
    instanceRef?.current?.setViewState(viewState.set('showToolbar', false));

    const pdf = await instanceRef?.current?.exportPDF({
      flatten: true,
    });
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const previousDocument = taskGuest?.documents?.[0];
    if (!previousDocument) return null;

    const fileType =
      previousDocument?.key?.split('.')?.[1] ?? 'application/pdf';
    const key = `${uuidv4()}.${fileType}`;
    await uploadToS3Storage({
      key,
      contentType: fileType,
      file: blob,
      level: previousDocument?.level ?? 'protected',
    });
    // if (previousDocument?.level !== "public") {
    //     {
    //         const data = await fetchAuthSession();
    //         const identityId = data.identityId;
    //         previousDocument.identityId = identityId;
    //     }
    // }

    return {
      key,
      level: 'public',
      type: 'PDF',
    };
  };

  return [uploadSignedDocument];
};
