import { WBBox, WBFlex, WBIcon, WBTypography } from '@admiin-com/ds-web';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import { Annotation, AnnotationsUnion, Color, ViewState } from 'pspdfkit';
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
  getSignatureColor,
} from '../../helpers/signature';
import { PdfPlaceholderV2 } from '../PdfPlaceholder/PdfPlaceholder';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';
import { useFormContext, useWatch } from 'react-hook-form';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import StartArrowIcon from '../../../assets/icons/start-arrow.svg';
import FinishArrowIcon from '../../../assets/icons/finish-arrow.svg';
import NextArrowIcon from '../../../assets/icons/next-arrow.svg';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';

const { VITE_PSPDFKIT_KEY } = import.meta.env;

export interface SignatureDropAreaProps {
  documentUrl: string;
  annotations?: any;
  userId?: string;
  onPdfLoad?: () => void;
  onDrop?: (signer: any) => void;
}

interface DeleteAnnotation {
  type: string; // to show different title for different annotation type
  id: string;
}

const renderConfigurations: Record<any, any> = {};

export const SignatureDropArea = forwardRef(
  (
    {
      documentUrl,
      onPdfLoad,
      annotations,
      userId,
      onDrop,
    }: SignatureDropAreaProps,
    instanceRef: any
  ) => {
    const { t } = useTranslation();
    //TODO: valid ref type
    const PSPDFKit = useRef<any>(null); //TODO: types
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const containerRef = useRef(null);
    //let isDragAndDropSupported = false; //TODO: purpose?
    const [showDeleteDlg, setShowDeleteDlg] =
      useState<DeleteAnnotation | null>();
    const [showAddSignModal, setShowAddSignModal] = useState<any>(null);
    const { userSignatureKey, getSignatureBlob } = useUserSignature();

    //TODO: this is rendering each movement / event, should it be so?

    const isLoggedInUser = (signerUserId: string) => {
      return userId === signerUserId;
    };

    const { control } = useFormContext();
    const signers = useWatch({ control, name: 'signers' });
    const user = useCurrentUser();
    const validSigners = React.useMemo(
      () =>
        [
          {
            id: user.id,
            isUser: true,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
        ].concat(signers.filter((signer: any) => signer.name && signer.email)),
      [signers, user]
    );

    const signersRef = useRef(validSigners);

    React.useEffect(() => {
      signersRef.current = validSigners;
    }, [validSigners]);

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
        const placeholderUi = (
          <PdfPlaceholderV2 customData={{ ...customData }} />
        );
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
        tooltipNode.style.cssText = `
        position: absolute;
        top: -20px; /* Adjust to position above the annotation */
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
      `;
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

        const signerNode = document.createElement('div');
        signerNode.style.cssText = `
           position: absolute;
          top: -35px; /* Adjust to position above the annotation */
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display:flex;
          flex-direction:row;
        `;
        signerNode.innerHTML = `<div></div>`;

        const data: any = annotation.customData;
        //@ts-ignore TODO: resolve type issue
        for (let i = 0; i < signersRef.current.length; i++) {
          const colorPicker = document.createElement('div') as HTMLElement;
          colorPicker.style.cssText = `
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: ${
              signersRef.current[i].isUser
                ? '#ffffff'
                : getSignatureColor(i - 1)
            };
            margin-left: ${i > 0 ? '5px' : '0'};
            border: 1px solid ${theme.palette.primary.main};
            `;
          colorPicker.addEventListener('click', () => {
            changeAnnotation(annotation, i);
          });
          //@ts-ignore TODO: resolve type issue
          signerNode.append(colorPicker);
        }

        const signerNodeItem = {
          type: 'custom',
          node: signerNode,
          onPress: function () {
            console.log('color picker clicked');
          },
        };

        const colorChange =
          data && data.type !== 'SIGNATURE' && signersRef.current.length > 1;
        if (colorChange) return [customTooltipItem, signerNodeItem];
        return [customTooltipItem];
      };

      const changeAnnotation = (annotation: Annotation, i: number) => {
        console.log(signersRef.current[i]);
        const label =
          annotation.customData?.type === 'NAME'
            ? signersRef.current[i]?.name ?? annotation.customData?.name
            : annotation.customData?.type === 'DATE' &&
              signersRef.current[i]?.isUser
            ? new Date().toLocaleDateString()
            : 'Date';
        const updatedAnnotation =
          new PSPDFKit.current.Annotations.TextAnnotation({
            pageIndex: annotation.pageIndex,
            boundingBox: annotation.boundingBox,
            id: uuidv4(),
            lockedContents: true,
            fontSize: 12,
            backgroundColor: Color.TRANSPARENT,
            text: {
              format: 'plain',

              value: label,
            },
            horizontalAlign: 'center',
            verticalAlign: 'center',
            customData: {
              ...annotation.customData,
              color: getSignatureColor(i - 1),
              signerId:
                signersRef.current[i]?.id ?? annotation.customData?.signerId,
              name: signersRef.current[i]?.name ?? annotation.customData?.name,
              label: label,
              email:
                i === 0
                  ? annotation.customData?.email
                  : signersRef.current[i]?.email ??
                    annotation.customData?.email,
              status: signersRef.current[i]?.isUser ? 'ACTIONED' : 'PENDING',
            },
          });
        console.log(updatedAnnotation.customData);

        instanceRef.current.delete(annotation).then(() => {
          instanceRef.current.create(updatedAnnotation).then(() => {
            instanceRef.current.setSelectedAnnotation(updatedAnnotation.id);
          });
        });
      };

      (async function () {
        PSPDFKit.current = await import('pspdfkit'); // Load PSPDFKit asynchronously.
        PSPDFKit.current.unload(container); // unload any existing instances

        const input: any = {
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
          disableTextSelection: false,
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
          initialViewState: isMobile
            ? new PSPDFKit.current.ViewState({})
            : new PSPDFKit.current.ViewState({
                //sidebarMode: PSPDFKit.current.SidebarMode.THUMBNAILS,
                sidebarPlacement: PSPDFKit.current.SidebarPlacement.END,
              }),
          annotationTooltipCallback,
          styleSheets: ['/viewer.css'], //TODO: review
        };
        if (annotations) {
          input.instantJSON = JSON.parse(annotations);
        }

        // load new instance
        instanceRef.current = await PSPDFKit.current.load(input);
        const viewState = instanceRef?.current?.viewState;
        instanceRef?.current?.setViewState(
          //viewState.set('showToolbar', isMobile ? false : true)
          viewState.set('showToolbar', false)
        );
        // instanceRef?.current?.setViewState(
        //   viewState.set('zoom', PSPDFKit.current.ZoomMode.FIT_TO_WIDTH)
        // );

        if (instanceRef?.current) {
          instanceRef.current.handleDrop = handleDrop;
          if (!isMobile) {
            instanceRef.current.setViewState((viewState: ViewState) =>
              viewState.set(
                'sidebarMode',
                PSPDFKit.current.SidebarMode.THUMBNAILS
              )
            );
          }
        }
        instanceRef.current?.addEventListener(
          'annotations.willChange',
          (event: any) => {
            console.log('The user is drawing...');
            console.log(event);
            const annotations = event.annotations;
            instanceRef.current.update(annotations.get(0));
          }
        );

        onPdfLoad && onPdfLoad();
      })();
      return () => PSPDFKit.current?.unload(container);
    }, [annotations, documentUrl, instanceRef, theme, isMobile]);

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
            text: {
              format: 'plain',
              background: annotationObj.color,
              value: label,
            },
            opacity: 0,
          });
        };

        (async function () {
          const color =
            event?.dataTransfer?.getData('color') ?? clickEvent?.color;
          const email =
            event?.dataTransfer?.getData('email') ?? clickEvent?.email;
          const label =
            event?.dataTransfer?.getData('label') ?? clickEvent?.label;
          const type = event?.dataTransfer?.getData('type') ?? clickEvent?.type;
          const signerId =
            event?.dataTransfer?.getData('signerId') ?? clickEvent?.signerId;
          const signerEntityId =
            event?.dataTransfer?.getData('entityId') ?? clickEvent?.entityId;

          const signerType =
            event?.dataTransfer?.getData('signerType') ??
            clickEvent?.signerType;
          const name = event?.dataTransfer?.getData('name') ?? clickEvent?.name;
          const signatureKey =
            event?.dataTransfer?.getData('signatureKey') ??
            clickEvent?.signatureKey;

          if (onDrop && type === 'SIGNATURE') {
            onDrop({
              color: color,
              label,
              type: type,
              id: signerId,
              email,
              entityId: signerEntityId,
              signerType: signerType,
              name,
              signatureKey: signatureKey,
            });
          }

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
            const width = type === 'SIGNATURE' ? 110 : 110;
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
            backgroundColor: Color.TRANSPARENT,
            fontSize: 12,
            selected: true,
            customData: {
              type,
              color,
              name,
              email,
              signerId,
              label,
              status: isLoggedInUser(signerId) ? 'ACTIONED' : 'PENDING',
              signerType,
            },
          };

          let annotation;
          if (isLoggedInUser(signerId)) {
            if (type === 'SIGNATURE') {
              if (signatureKey) {
                let signatureBlob;
                try {
                  signatureBlob = await getSignatureBlob(signatureKey);
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
                      isSignature: true,
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
            } else if (type === 'NAME') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: {
                  background: color,
                  format: 'plain',
                  fontSize: 12,
                  value: name,
                },
                horizontalAlign: 'center',
                verticalAlign: 'center',
              });
            } else if (type === 'DATE') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: {
                  background: color,
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
      [instanceRef, userSignatureKey]
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
export default SignatureDropArea;
