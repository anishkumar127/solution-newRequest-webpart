import React from "react";
import { useEffect, useRef } from "react";
import Types from "../../TypeSafety/Types";
// ----------- Type Safety ['ANISH'] ------------------
type Props = {
  title: string | undefined; // Choice Based.
  isOpened: boolean;
  onClose: () => void;
  modelStyle: string;
  children: React.ReactNode;
};

const ReusableDialogModal = React.memo(
  ({
    title,
    isOpened,
    onClose,
    modelStyle,
    children,
  }: Props) => {
    const ref = useRef(null);

    useEffect(() => {
      if (isOpened) {
        ref.current?.showModal();
        document.body.classList.add("modal-open"); // prevent bg scroll ['anish']
        let visible = document.getElementById("modal-style");
        visible?.classList.add("modal-visible-transition");
      } else {
        ref.current?.close();
        document.body.classList.remove("modal-open");
        let visible = document.getElementById("modal-style");
        visible?.classList.remove("modal-visible-transition");
      }
    }, [isOpened]);
    // console.log(className", modelStyle);
    return (
      <dialog
        id="modal-style" // avoid Scroll when modal open!.
        className={modelStyle}  // Dynamic Classes.
        ref={ref}
        onCancel={onClose}
      >
        <h2>{title !== Types.Skip ? title : ""}</h2>
        {children}
      </dialog>
    );
  }
);

export default ReusableDialogModal;