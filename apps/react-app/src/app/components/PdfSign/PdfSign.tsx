import { WBFlex, WBIconButton, WBTypography } from '@admiin-com/ds-web';
import PSPDFKit, { Annotation, AnnotationsUnion, Color } from 'pspdfkit';
import React, { forwardRef, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import PdfPlaceholder, {
  PdfPlaceholderV2,
} from '../PdfPlaceholder/PdfPlaceholder';
import {
  createCustomSignatureNode,
  getAnnotation,
} from '../../helpers/signature';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import StartArrowIcon from '../../../assets/icons/start-arrow.svg';
import FinishArrowIcon from '../../../assets/icons/finish-arrow.svg';
import NextArrowIcon from '../../../assets/icons/next-arrow.svg';
import ConfirmationDlg from '../ConfirmationDlg/ConfirmationDlg';
import { useTranslation } from 'react-i18next';
import { usePdfScroll } from './PdfScrollContext';

const { VITE_PSPDFKIT_KEY } = import.meta.env;
// if domain is local host
export interface PdfSignProps {
  documentUrl?: string;
  height?: any;
  headless?: boolean;
  annotations?: any;
  onPdfLoad?: () => void;
  onSignedAll?: (annotations: string | null) => Promise<void>;
}
const renderConfigurations: Record<any, any> = {};
export const PdfSign = forwardRef(
  (
    { height, documentUrl, annotations, onPdfLoad }: PdfSignProps,
    instanceRef: any
  ) => {
    const containerRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showAddSignModal, setShowAddSignModal] = React.useState(false);
    const signingAnnotationRef = useRef<any>(null);
    const pdfInstanceRef = useRef<any>(null);
    const {
      indicatorIndex,
      setSignatureToAll,
      signatureToAll,
      updateAnnotations,
      disableNextButton,
      loading,
      totalSignatures,
      completed,
      setActionedSignatures,
      signedSignatures,
      setSignedSignatures,
      openConfirmation,
      actionedSignatures,
      indicatorTop,
      setOpenConfirmation,
      isFinish,
      handleMoveIndicator,
    } = usePdfScroll();
    const [signatureName, setSignatureName] = React.useState('');

    let icon = StartArrowIcon;
    if (indicatorIndex > 0) {
      icon = NextArrowIcon;
    }
    if (isFinish) {
      icon = FinishArrowIcon;
    }

    useEffect(() => {
      const container = containerRef.current; // This `useRef` instance will render the PDF.

      let PSPDFKit: any;

      if (!instanceRef) {
        instanceRef = { current: null };
      }

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

      (async function () {
        PSPDFKit = await import('pspdfkit'); // Load PSPDFKit asynchronously.
        PSPDFKit.unload(container); // unload any existing instances
        if (!documentUrl) return;
        try {
          PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.
          const pspdfParams: any = {
            container,
            document: documentUrl,
            licenseKey: VITE_PSPDFKIT_KEY,
            baseUrl: `${window.location.origin}/`,
            disableTextSelection: false,
            customRenderers: {
              Annotation: getAnnotationRenderers,
            },
            styleSheets: ['/viewer.css'],
            initialViewState: isMobile
              ? new PSPDFKit.ViewState({})
              : new PSPDFKit.ViewState({
                  sidebarMode: PSPDFKit.SidebarMode.THUMBNAILS,
                  sidebarPlacement: PSPDFKit.SidebarPlacement.END,
                }),
            inlineTextSelectionToolbarItems: () => {
              return [];
            },
          };
          if (isMobile) {
            pspdfParams.toolbarItems = [];
          }

          const annotationData = JSON.parse(annotations)?.annotations;
          if (annotations) {
            console.log(JSON.parse(annotations).annotations);
            pspdfParams.instantJSON = {
              ...JSON.parse(annotations),
              annotations: annotationData.map((annotation: any) => ({
                ...annotation,
                flags:
                  annotation.customData.type === 'SIGNATURE' &&
                  annotation.customData.status === 'PENDING'
                    ? annotation.flags
                    : [...annotation.flags, 'readOnly'],
              })),
            };
          }

          instanceRef.current = await PSPDFKit.load(pspdfParams);
          pdfInstanceRef.current = instanceRef.current;

          const stopAnnotationMove = (annotation: Annotation) => {
            if (annotation) {
              instanceRef.current.contentDocument.ownerDocument.addEventListener(
                'pointermove',
                stopPropagation,
                { capture: true }
              );
              instanceRef.current.contentDocument.ownerDocument.addEventListener(
                'mousemove',
                stopPropagation,
                {
                  capture: true,
                }
              );
              instanceRef.current.contentDocument.ownerDocument.addEventListener(
                'touchmove',
                stopPropagation,
                {
                  capture: true,
                }
              );

              instanceRef.current.contentDocument.ownerDocument.addEventListener(
                'keydown',
                stopPropagation,
                {
                  capture: true,
                }
              );
            } else {
              instanceRef.current.contentDocument.ownerDocument.removeEventListener(
                'pointermove',
                stopPropagation,
                { capture: true }
              );

              instanceRef.current.contentDocument.ownerDocument.removeEventListener(
                'mousemove',
                stopPropagation,
                {
                  capture: true,
                }
              );
              instanceRef.current.contentDocument.ownerDocument.removeEventListener(
                'touchmove',
                stopPropagation,
                {
                  capture: true,
                }
              );

              instanceRef.current.contentDocument.ownerDocument.removeEventListener(
                'keydown',
                stopPropagation,
                {
                  capture: true,
                }
              );
            }
          };

          const totalPages = instanceRef.current.totalPageCount;
          const allAnnotations = [];

          for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const annotations = await instanceRef.current.getAnnotations(
              pageIndex
            );
            allAnnotations.push(...annotations.toArray());
          }
          const filteredAnnotations = annotationData.filter(
            (annotation: any) =>
              annotation.customData?.status === 'PENDING' &&
              annotation.isSignersAnnotation &&
              annotation.customData?.type !== 'SIGNATURE'
          );

          for (const annotation of filteredAnnotations) {
            const updatedAnnotation = getAnnotation(
              annotation,
              annotation.customData?.signerId,
              true
            );
            await instanceRef.current.delete(annotation.id);
            await instanceRef.current.create(updatedAnnotation);
          }
          const stopPropagation = (event: any) => {
            if (event.target.getAttribute('data-testid') !== 'canvas-element')
              event.stopImmediatePropagation();
          };

          instanceRef.current.addEventListener(
            'annotationSelection.change',
            (annotation: Annotation) => {
              if (!showAddSignModal) stopAnnotationMove(annotation);
            }
          );

          // for (const annotation of realAnnotations) {
          //   if (
          //     annotation.customData?.type === 'SIGNATURE' &&
          //     annotation.customData.status === 'PENDING'
          //   )
          //     instanceRef.current.create(createSignatureWidget(annotation));
          // }
          const viewState = instanceRef?.current?.viewState;
          instanceRef?.current?.setViewState(
            //viewState.set('showToolbar', isMobile ? false : true)
            viewState.set('showToolbar', false)
          );
          instanceRef?.current?.setViewState((v: any) =>
            v.set('disableTextSelection', true)
          );
          onPdfLoad && onPdfLoad();
          // Assume `instance` is your PSPDFKit instance
          instanceRef?.current.addEventListener(
            'annotations.press',
            (event: any) => {
              const annotation = event.annotation;
              if (
                annotation.customData?.type === 'SIGNATURE' &&
                annotation.customData?.status === 'PENDING'
              ) {
                setShowAddSignModal(true);
                signingAnnotationRef.current = annotation.id;
                setSignatureName(annotation.customData?.name);
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      })();

      return () => PSPDFKit.unload(container);
    }, [documentUrl, isMobile, instanceRef]);
    const makeSignature = async (
      annotationId: string,
      signatureAttachmentId: string
    ) => {
      const annotation = JSON.parse(annotations)?.annotations.find(
        (at: any) => at.id === annotationId
      );
      const updatedAnnotation = getAnnotation(
        annotation,
        signatureAttachmentId,
        true
      );
      Promise.all([
        await pdfInstanceRef.current.create(updatedAnnotation),
        await pdfInstanceRef.current.delete(annotationId),
      ]);
      setSignedSignatures((prev: Array<string>) => [...prev, annotationId]);
    };
    const signatureAddHandler = async (signatureBlob?: string | Blob) => {
      if (!pdfInstanceRef?.current) {
        console.error('PSPDFKit instance not loaded.');
        return;
      }
      setShowAddSignModal(false);
      if (signatureBlob && typeof signatureBlob !== 'string') {
        const signatureAttachmentId =
          await pdfInstanceRef.current.createAttachment(signatureBlob);

        if (!signatureToAll) {
          await makeSignature(
            signingAnnotationRef.current,
            signatureAttachmentId
          );

          setActionedSignatures((prev: number) => prev + 1);
        } else {
          const annotationData = JSON.parse(annotations)?.annotations;

          const pendingSigantures = annotationData.filter(
            (annotation: any) =>
              signedSignatures.indexOf(annotation.id) === -1 &&
              annotation.customData?.status === 'PENDING' &&
              annotation.isSignersAnnotation &&
              annotation.customData?.type === 'SIGNATURE'
          );

          setActionedSignatures(totalSignatures);
          await Promise.all(
            pendingSigantures.map(async (annotation: any) => {
              await makeSignature(annotation.id, signatureAttachmentId);
            })
          );
        }
      }
    };
    // This div element will render the document to the DOM.
    const { t } = useTranslation();

    return (
      <>
        <WBFlex
          ref={containerRef}
          className="pdf-viewer"
          flex={1}
          {...(height ? { height } : {})}
          // sx={{ width: '100%', height: height ?? ['250px', '150px'] }}
        />

        <WBIconButton
          sx={{
            position: 'absolute',
            left: 0,
            transform: 'translateX(-100%)',
            top: indicatorTop,
          }}
          onClick={() => {
            if (isFinish) {
              setOpenConfirmation(true);
            } else {
              handleMoveIndicator();
            }
          }}
          disabled={disableNextButton || completed}
        >
          <LoadSvgIcon component={icon} width={80} height={50} />
        </WBIconButton>
        <ConfirmationDlg
          open={openConfirmation}
          title={t('confirmAllYourSignaturesSigned', { ns: 'taskbox' })}
          onOK={async () => {
            await updateAnnotations();
          }}
          onClose={() => {
            setOpenConfirmation(false);
          }}
          loading={loading}
        >
          <WBTypography>
            {t('youSignedSignatures', {
              ns: 'taskbox',
              number: actionedSignatures,
              total: totalSignatures,
            })}
          </WBTypography>
        </ConfirmationDlg>
        <AddSignatureModal
          open={showAddSignModal}
          applyToAll={signatureToAll}
          onApplyToAll={(value: boolean) => setSignatureToAll(value)}
          handleClose={() => setShowAddSignModal(false)}
          handleSave={signatureAddHandler}
          isGuest
          signerName={signatureName}
        />
      </>
    );
  }
);

export default PdfSign;
