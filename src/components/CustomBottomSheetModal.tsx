import * as Colors from "@bacons/apple-colors";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";

const RenderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

export function CustomBottomSheetModal({
  modalRef,
  children,
}: {
  modalRef;
  children: BottomSheetModalProps["children"];
}) {
  return (
    <BottomSheetModal
      ref={modalRef}
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
