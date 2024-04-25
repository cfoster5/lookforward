import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
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
  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      backdropComponent={RenderBackdrop}
      backgroundStyle={{
        backgroundColor: PlatformColor("secondarySystemBackground"),
      }}
      handleIndicatorStyle={{
        backgroundColor: PlatformColor("systemGray"),
      }}
    >
      {children}
    </BottomSheetModal>
  );
}
