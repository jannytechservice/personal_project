import { TaskGuest } from '@admiin-com/ds-graphql';
import PSPDFKit, { AnnotationsUnion } from 'pspdfkit';
import React from 'react';

const PdfScrollContext = React.createContext<any>(null);

export const PdfScrollProvider = ({
  annotations,
  children,
  onSave,
  taskGuest,
}: {
  taskGuest: TaskGuest;
  onSave?: (annotations: string) => Promise<void>;
  annotations: string;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = React.useState(false);
  const completed = taskGuest.status === 'COMPLETED';
  const pdfInstanceRef = React.useRef<any>(null);
  const [indicatorIndex, setIndicatorIndex] = React.useState<number>(0);
  const [actionedSignatures, setActionedSignatures] = React.useState<number>(0);
  const [totalSignatures, setTotalSignatures] = React.useState<number>(0);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [signedSignatures, setSignedSignatures] = React.useState<Array<string>>(
    []
  );
  const [indicatorTop, setIndicatorTop] = React.useState(0);
  const isFinish =
    (totalSignatures > 0 && indicatorIndex >= totalSignatures) ||
    (actionedSignatures > 0 && actionedSignatures === totalSignatures);
  const [signatureToAll, setSignatureToAll] = React.useState(false);
  const signedAll =
    actionedSignatures > 0 && actionedSignatures === totalSignatures;

  React.useEffect(() => {
    if (signedAll) {
      setTimeout(() => setOpenConfirmation(true), 200);
    }
  }, [signedAll]);

  const annotationData = JSON.parse(annotations)?.annotations;

  const annotationHeights = annotationData
    .filter(
      (annotation: AnnotationsUnion) =>
        annotation.customData?.type === 'SIGNATURE' &&
        annotation.customData?.status === 'PENDING' &&
        annotation.isSignersAnnotation
    )
    .map((annotation: any) => {
      const bbox = annotation.bbox;
      const data = {
        height: bbox[1] + bbox[3],
        id: annotation.id,
        pageIndex: annotation.pageIndex,
        bbox: bbox,
      };
      return data;
    })
    .sort((a: any, b: any) => {
      if (a.pageIndex < b.pageIndex) return -1;
      if (a.pageIndex > b.pageIndex) return 1;
      if (a.height < b.height) return -1;
      if (a.height > b.height) return 1;
      return 0;
    });

  React.useEffect(() => {
    const totalSignatures = annotationData.filter(
      (annotation: any) =>
        annotation.customData?.status === 'PENDING' &&
        annotation.isSignersAnnotation &&
        annotation.customData?.type === 'SIGNATURE'
    ).length;
    setTotalSignatures(totalSignatures);
  }, [annotations]);

  const handleMoveIndicator = (height: number) => {
    if (isFinish) {
      setOpenConfirmation(true);
    } else {
      const nextIndicator = Math.min(indicatorIndex + 1, totalSignatures);
      console.log(annotationHeights[indicatorIndex], nextIndicator);
      const newPageIndex = annotationHeights[indicatorIndex].pageIndex;
      // pdfInstanceRef.current.setViewState((viewState: any) => viewState.set('currentPageIndex',
      //   newPageIndex
      // ));
      const pageInfo = pdfInstanceRef.current.pageInfoForIndex(newPageIndex);

      const normalPageHeight = pageInfo.height;

      const pageHeight =
        nextIndicator > 0 ? annotationHeights[indicatorIndex].height ?? 0 : 0;
      console.log(height, pageHeight, normalPageHeight);
      const indicatorTop = Math.min(
        Math.round((height * pageHeight) / normalPageHeight),
        height - 50
      );
      setIndicatorTop(indicatorTop);
      setIndicatorIndex(nextIndicator);
      pdfInstanceRef.current.jumpToRect(
        newPageIndex,
        new PSPDFKit.Geometry.Rect({
          left: annotationHeights[indicatorIndex].bbox[0],
          top: annotationHeights[indicatorIndex].bbox[1], // The vertical position you want to scroll to
          width: annotationHeights[indicatorIndex].bbox[2],
          height: annotationHeights[indicatorIndex].bbox[3],
        })
      );
    }
    if (isFinish || indicatorIndex + 1 === totalSignatures) {
      return false;
    } else return true;
  };
  const disableNextButton =
    submitted ||
    (!submitted && isFinish && actionedSignatures !== totalSignatures);

  const getAnnotationData = async () => {
    const allAnnotations = await Promise.all(
      Array.from({ length: pdfInstanceRef.current?.totalPageCount }).map(
        (_, pageIndex) => pdfInstanceRef.current.getAnnotations(pageIndex)
      )
    );

    const flattenedAnnotations = allAnnotations.flat();
    if (pdfInstanceRef.current) {
      const instantJSON = await pdfInstanceRef.current.exportInstantJSON(
        flattenedAnnotations
      );
      return JSON.stringify(instantJSON);
    } else return null;
  };

  const updateAnnotations = async () => {
    try {
      setLoading(true);
      const annotations = await getAnnotationData();
      if (annotations) if (onSave) await onSave(annotations);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <PdfScrollContext.Provider
      value={{
        ref: pdfInstanceRef,
        isFinish,
        indicatorIndex,
        completed,
        setIndicatorIndex,
        actionedSignatures,
        setActionedSignatures,
        totalSignatures,
        setTotalSignatures,
        openConfirmation,
        setOpenConfirmation,
        updateAnnotations,
        setSignatureToAll,
        signatureToAll,
        submitted,
        setSubmitted,
        indicatorTop,
        signedSignatures,
        setSignedSignatures,
        disableNextButton,
        setIndicatorTop,
        loading,
        handleMoveIndicator,
      }}
    >
      {children}
    </PdfScrollContext.Provider>
  );
};

export const usePdfScroll = () => {
  const context = React.useContext(PdfScrollContext);
  if (!context) {
    throw new Error('usePdfScroll must be used within a PdfScrollProvider');
  }
  return context;
};
