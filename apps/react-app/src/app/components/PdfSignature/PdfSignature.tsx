import { WBFlex, WBIcon, WBTypography } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import { Annotation, AnnotationsUnion, Color } from 'pspdfkit';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import ConfirmationDlg from '../ConfirmationDlg/ConfirmationDlg';
import {
  createCustomSignatureNode,
  isAnnotationInsidePage,
} from '../../helpers/signature';
import PdfPlaceholder from '../PdfPlaceholder/PdfPlaceholder';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';
import { isAndroid } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';

const { VITE_PSPDFKIT_KEY } = import.meta.env;

export interface PdfSignatureProps {
  documentUrl: string;
  pdfId: string;
  annotations?: any;
  userId?: string;
  isAssignSignature?: boolean;
  onPdfLoad?: () => void;
  onFieldRemoved?: () => void;
}

interface DeleteAnnotation {
  type: string; // to show different title for different annotation type
  id: string;
}

const renderConfigurations: Record<any, any> = {};

//function fileToDataURL(file) {
//  return new Promise((resolve) => {
//    const reader = new FileReader();
//
//    reader.onload = function () {
//      resolve(reader.result);
//    };
//    reader.readAsDataURL(file);
//  });
//}
export const PdfSignature = forwardRef(
  (
    {
      documentUrl,
      pdfId,
      onPdfLoad,
      onFieldRemoved,
      annotations,
      userId,
      isAssignSignature,
    }: PdfSignatureProps,
    instanceRef: any
  ) => {
    const { t } = useTranslation();
    //TODO: valid ref type
    const PSPDFKit = useRef<any>(null); //TODO: types
    const theme = useTheme();
    const containerRef = useRef(null);
    //let isDragAndDropSupported = false; //TODO: purpose?
    const [showDeleteDlg, setShowDeleteDlg] =
      useState<DeleteAnnotation | null>();
    const [showAddSignModal, setShowAddSignModal] = useState<any>(null);
    const { userSignatureKey, getSignatureBlob } = useUserSignature();

    //TODO: this is rendering each movement / event, should it be so?

    const isLoggedInUser = (signerUserId: string) => {
      return isAssignSignature && userId === signerUserId;
    };

    useEffect(() => {
      const container = containerRef.current; // render PSPDFKit ui to this container
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
        const placeholderUi = <PdfPlaceholder customData={customData} />;
        const customNode = createCustomSignatureNode(placeholderUi, customData);
        renderConfigurations[annotation.id] = {
          node: customNode,
          append: true,
        };

        return renderConfigurations[annotation.id] || null;
      };

      const annotationTooltipCallback = (annotation: Annotation) => {
        const deleteIcon = (
          <WBIcon name="CloseCircle" color={theme.palette.error.light} />
        );
        const tooltipNode = document.createElement('div');
        tooltipNode.style.cssText = 'height: 2rem;';
        //@ts-ignore TODO: resolve type issue
        tooltipNode.innerHTML = renderToString(deleteIcon);
        const customTooltipItem = {
          type: 'custom',
          node: tooltipNode,
          onPress: function () {
            setShowDeleteDlg({
              type: 'Signature',
              id: annotation.id,
            });
          },
        };
        return [customTooltipItem];
      };

      (async function () {
        PSPDFKit.current = await import('pspdfkit'); // Load PSPDFKit asynchronously.
        PSPDFKit.current.unload(container); // unload any existing instances

        console.log('PSPDFKit.current signature: ', PSPDFKit.current);

        // pdf toolbar menu items
        // const toolbarItems = PSPDFKit.current.defaultToolbarItems.filter(
        //   (item: any) => {
        //     return /\b("pager|pan|search|sidebar-document-outline|sidebar-document-outline|sidebar-thumbnails|zoom-in|zoom-mode|zoom-out|layout")\b/.test(
        //       item.type
        //     );
        //   }
        // );
        //let baseUrl = '';
        //if (!isLocalHost)
        //  baseUrl = `${window.location.protocol}//${window.location.hostname}/`;
        //else baseUrl = `${window.location.protocol}//${window.location.host}/`;
        //baseUrl: `${window.location.origin}/`, // Use the origin of the current window as a base URL. PSPDFKit.current will download its library assets from here.
        const input = {
          container,
          document: documentUrl,
          autoSaveMode: 'INTELLIGENT', //TODO: may not require
          instantJSON: undefined,
          //TODO: env variable
          licenseKey: VITE_PSPDFKIT_KEY,
          baseUrl: `${window.location.origin}/`, // Use the public directory URL as a base URL. PSPDFKit.current will download its library assets from here.
          //toolbarItems: [],
          //toolbarItems,
          enableHistory: true,
          disableTextSelection: true,
          electronicSignatures: {
            creationModes: [
              PSPDFKit.current.ElectronicSignatureCreationMode.DRAW,
              PSPDFKit.current.ElectronicSignatureCreationMode.IMAGE,
              PSPDFKit.current.ElectronicSignatureCreationMode.TYPE,
            ],
          },
          customRenderers: {
            Annotation: getAnnotationRenderers,
          },
          annotationTooltipCallback,
          styleSheets: ['/viewer.css'], //TODO: review
        };

        if (annotations) {
          input.instantJSON = JSON.parse(annotations);
        }

        // load new instance
        instanceRef.current = await PSPDFKit.current.load(input);
        const viewState = instanceRef?.current?.viewState;
        instanceRef?.current?.setViewState(viewState.set('showToolbar', false));
        if (instanceRef?.current) {
          instanceRef.current.handleDrop = handleDrop;
        }
        if (instanceRef.current) {
          instanceRef.current?.addEventListener(
            'annotations.load',
            (loadedAnnotations: any) => {
              console.log(loadedAnnotations);
            }
          );
          instanceRef.current?.addEventListener(
            'annotations.willChange',
            (event: any) => {
              console.log('The user is drawing...');
              console.log(event);
              const annotations = event.annotations;
              instanceRef.current.update(annotations.get(0));
            }
          );
        }
        onPdfLoad && onPdfLoad();
      })();
      return () => PSPDFKit.current?.unload(container);
    }, [annotations, documentUrl, instanceRef, theme]);

    const handleDrop = useCallback(
      (event: any, clickEvent?: any) => {
        //TODO: type
        if (!PSPDFKit.current || !instanceRef.current) return;
        event.preventDefault();
        event.stopPropagation();

        const createPlaceholderAnnotation = (
          annotationObj: any,
          label: string
        ) => {
          return new PSPDFKit.current.Annotations.TextAnnotation({
            ...annotationObj,
            text: { format: 'plain', value: label },
            opacity: 0,
          });
        };

        (async function () {
          const label =
            event?.dataTransfer?.getData('label') ?? clickEvent?.label;
          const type = event?.dataTransfer?.getData('type') ?? clickEvent?.type;
          const signerUserId =
            event?.dataTransfer?.getData('userId') ?? clickEvent?.userId;
          const signerEntityId =
            event?.dataTransfer?.getData('entityId') ?? clickEvent?.entityId;

          const contactId =
            event?.dataTransfer?.getData('contactId') ?? clickEvent?.contactId;
          const signerType =
            event?.dataTransfer?.getData('signerType') ??
            clickEvent?.signerType;
          const signerName =
            event?.dataTransfer?.getData('signerName') ??
            clickEvent?.signerName;

          let pageIndex = instanceRef.current.viewState.currentPageIndex;
          const isRectInsidePage = (pageIndex: number, rect: any) => {
            const pageInfo = instanceRef.current.pageInfoForIndex(pageIndex);
            const pageRectSize = new PSPDFKit.current.Geometry.Rect({
              left: 0,
              top: 0,
              width: pageInfo.width,
              height: pageInfo.height,
            });

            return pageRectSize.isRectOverlapping(rect);
          };
          const getPageRect = async (pageIndex: number) => {
            const height = type === 'SIGNATURE' ? 55 : 15;
            const width = type === 'SIGNATURE' ? 110 : 80;
            const left = clickEvent
              ? window.innerWidth / 2 - width / 2
              : event.clientX - width / 2;
            const top = clickEvent
              ? window.innerHeight / 2 - height / 2 - 90
              : event.clientY - height / 2;
            const clientRect = new PSPDFKit.current.Geometry.Rect({
              left,
              top,
              height,
              width,
            });

            const pageRect =
              await instanceRef.current.transformContentClientToPageSpace(
                clientRect,
                pageIndex
              );
            if (!isRectInsidePage(pageIndex, pageRect)) {
              throw new Error('page rect is not inside page');
            }
            return pageRect;
          };
          let pageRect;
          try {
            pageRect = await getPageRect(pageIndex);
          } catch (e) {
            try {
              console.log('try to get page rect from next page');
              pageIndex = instanceRef.current.viewState.currentPageIndex - 1;
              pageRect = await getPageRect(pageIndex);
            } catch (e) {
              console.log('try to get page rect from previous page');
              pageIndex = instanceRef.current.viewState.currentPageIndex + 1;
              try {
                pageRect = await getPageRect(pageIndex);
              } catch (e) {
                throw new Error('page rect is not inside page');
              }
            }
          }

          const id = uuidv4();
          const annotationObj = {
            pageIndex,
            boundingBox: pageRect,
            id: id,
            lockedContents: true,
            customData: {
              type,
              signerName: signerName,
              userId: signerUserId,
              entityId: signerEntityId,
              label,
              status: isLoggedInUser(signerUserId) ? 'ACTIONED' : 'PENDING',
              signerType,
              contactId,
              //status: isLoggedInUser(signerUserId)
              //  ? AnnotationStatus.ACTIONED
              //  : AnnotationStatus.PENDING,
            },
            backgroundColor: Color.TRANSPARENT,
            fontSize: 12,
            selected: true,
          };

          let annotation;
          if (isLoggedInUser(signerUserId)) {
            if (type === 'SIGNATURE') {
              if (userSignatureKey) {
                let signatureBlob;
                try {
                  signatureBlob = await getSignatureBlob();
                  console.log('signatureBlob: ', signatureBlob);
                  console.log('type of signatureBlob: ', typeof signatureBlob);
                } catch (e) {
                  console.log('error: ', e);
                }
                try {
                  const attachmentId =
                    await instanceRef.current.createAttachment(signatureBlob);
                  console.log('attachmentId: ', attachmentId);
                  annotation = new PSPDFKit.current.Annotations.ImageAnnotation(
                    {
                      ...annotationObj,
                      contentType: 'image/jpeg',
                      imageAttachmentId: attachmentId,
                    }
                  );
                } catch (e) {
                  console.log('error: ', e);
                }
              } else {
                setShowAddSignModal(annotationObj);
                return;
              }
            } else if (type === 'TEXT') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: {
                  format: 'plain',
                  fontSize: 12,
                  value: label,
                },
                horizontalAlign: 'center',
                verticalAlign: 'center',
              });
            } else if (type === 'DATE') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: {
                  format: 'plain',
                  fontSize: 12,
                  value: new Date().toLocaleDateString(),
                },
                horizontalAlign: 'center',
                verticalAlign: 'center',
              });
            }
          } else {
            annotation = createPlaceholderAnnotation(annotationObj, label);
          }
          try {
            // Check if the annotation's bounding box is inside the page's bounding box

            instanceRef.current.create(annotation);
            instanceRef.current.setSelectedAnnotation(annotation.id);
          } catch (e) {
            console.log(e);
          }
        })();
      },
      [instanceRef, isAssignSignature, userSignatureKey]
    );

    const addSignatureToPdf = async (
      signatureKey: string,
      annotationObj: any
    ) => {
      const signatureBlob = await getSignatureBlob(signatureKey);
      const attachmentId = await instanceRef.current.createAttachment(
        signatureBlob
      );
      const annotation = new PSPDFKit.current.Annotations.ImageAnnotation({
        ...annotationObj,
        contentType: 'image/jpeg',
        imageAttachmentId: attachmentId,
      });
      instanceRef.current.create(annotation);
    };

    const hanldeDeleteOK = () => {
      instanceRef.current.delete(showDeleteDlg?.id);
      onFieldRemoved && onFieldRemoved();
    };

    const signatureAddHandler = (signatureKey?: string | Blob) => {
      if (signatureKey && typeof signatureKey === 'string') {
        addSignatureToPdf(signatureKey, showAddSignModal);
      }
      setShowAddSignModal(null);
    };

    // This div element will render the document to the DOM.
    return (
      <>
        <WBFlex
          flex={1}
          ref={containerRef}
          height={'100%'}
          onDrop={handleDrop}
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
        />
        {!!showDeleteDlg && (
          <ConfirmationDlg
            open={!!showDeleteDlg}
            onClose={() => setShowDeleteDlg(null)}
            onOK={hanldeDeleteOK}
            title={t('deleteConfirmationTitle', { ns: 'taskbox' })}
          >
            <WBTypography>
              {t('deleteConfirmationDescription', { ns: 'taskbox' })}
            </WBTypography>
          </ConfirmationDlg>
        )}
        {showAddSignModal && (
          <AddSignatureModal
            open={showAddSignModal}
            handleClose={() => setShowAddSignModal(null)}
            handleSave={signatureAddHandler}
          />
        )}
      </>
    );
  }
);

export default PdfSignature;
