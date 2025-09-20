import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import * as Colors from "@bacons/apple-colors";

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
        backgroundColor: Colors.secondarySystemBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: Colors.systemGray,
      }}
    >
      {children}
    </BottomSheetModal>
  );
}
