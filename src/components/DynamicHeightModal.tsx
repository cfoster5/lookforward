import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { cloneElement, useMemo } from "react";
import { PlatformColor } from "react-native";

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
        backgroundColor: PlatformColor("secondarySystemBackground"),
      }}
      handleIndicatorStyle={{
        backgroundColor: PlatformColor("systemGray"),
      }}
      children={cloneElement(children, { onLayout: handleContentLayout })}
    />
  );
}
