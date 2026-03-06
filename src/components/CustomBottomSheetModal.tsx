import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { RefObject } from "react";

import { colors } from "@/theme/colors";

const RenderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

export function CustomBottomSheetModal({
  modalRef,
  children,
}: {
  modalRef: RefObject<BottomSheetModal>;
  children: BottomSheetModalProps["children"];
}) {
  return (
    <BottomSheetModal
      ref={modalRef}
      backdropComponent={RenderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.secondarySystemBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.systemGray,
      }}
    >
      {children}
    </BottomSheetModal>
  );
}
