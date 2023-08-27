import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { cloneElement, useMemo } from "react";

import { Colors } from "@/constants/Colors";

const RenderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

export function DynamicHeightModal({
  modalRef,
  children,
}: {
  modalRef;
  children: BottomSheetModalProps["children"];
}) {
  const snapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={RenderBackdrop}
      backgroundStyle={{
        backgroundColor: Colors.secondaryBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: Colors.gray,
      }}
      children={cloneElement(children, { onLayout: handleContentLayout })}
    />
  );
}
