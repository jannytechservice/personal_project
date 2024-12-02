import { Task } from '@admiin-com/ds-graphql';
import React, { useRef } from 'react';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';
import { WBBox, WBButton, WBImage } from '@admiin-com/ds-web';
import PdfViewModal from '../PdfViewModal/PdfViewModal';
import { createCustomSignatureNode } from '../../helpers/signature';
import { AnnotationsUnion } from 'pspdfkit';
import PdfPlaceholder from '../PdfPlaceholder/PdfPlaceholder';
import useResizeObserver from 'libs/hooks/src/lib/hooks/useResizeObserver';
const { VITE_PSPDFKIT_KEY } = import.meta.env;

/* eslint-disable-next-line */
export interface PdfThumbnailProps {
  task: Task | null;
  annotations?: any;
}
const renderConfigurations: Record<any, any> = {};

export const PdfThumbnail = React.forwardRef(
  (props: PdfThumbnailProps, instanceRef: any) => {
    const [image, setImage] = React.useState<string>('');
    const documentUrl = useDocumentUrl(props.task);
    const [containerRef, { width, height }] = useResizeObserver();
    const annotations = props.annotations ?? props.task?.annotations;

    React.useEffect(() => {
      const container = containerRef.current; // This `useRef` instance will render the PDF.
      let PSPDFKit: any;
      const fetchThumbnail = async () => {
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
          const customNode = createCustomSignatureNode(
            placeholderUi,
            customData
          );

          renderConfigurations[annotation.id] = {
            node: customNode,
            append: true,
          };
          return renderConfigurations[annotation.id] || null;
        };
        if (documentUrl) {
          PSPDFKit = await import('pspdfkit');
          PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

          const instance = await PSPDFKit.load({
            container,
            document: documentUrl,
            licenseKey: VITE_PSPDFKIT_KEY,
            baseUrl: `${window.location.origin}/`,
            toolbarItems: [],
            disableTextSelection: false,
            headless: true,
            customRenderers: {
              Annotation: getAnnotationRenderers,
            },
            styleSheets: ['/viewer.css'],
            instantJSON: annotations ? JSON.parse(annotations) : null,
          });
          // Renders the first page (page index 0).
          const src = await instance.renderPageAsImageURL({ width: 400 }, 0);
          // instanceRef.current = instance;
          setImage(src);
        }
      };
      fetchThumbnail();
      return () => {
        if (PSPDFKit) {
          PSPDFKit.unload(container);
        }
      };
    }, [documentUrl, annotations]);

    const [open, setOpen] = React.useState<boolean>(false);
    return (
      <>
        <WBBox ref={containerRef} />
        <WBButton
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          sx={{
            padding: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        >
          {image && (
            <WBImage
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              stretchBackground={true}
              src={image}
              sx={{ maxWidth: '100%' }}
            />
          )}
        </WBButton>
        <PdfViewModal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          annotations={annotations}
          task={props.task}
        />
      </>
    );
  }
);

export default PdfThumbnail;
