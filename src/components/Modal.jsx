import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
/*
const Modal = forwardRef(function Modal({children}, ref){
    const dialog = useRef()
    useImperativeHandle(ref, ()=>{
        return {
            open: ()=>{
                dialog.current.showModal()
            },
            close: ()=>{
                dialog.current.close()
            }
        }
    })

    return createPortal(
        <dialog className="modal" ref={dialog}>
            {children}
        </dialog>,
        document.getElementById('modal')
    )
})

export default Modal;
*/

// Another way to do the open the modal using the props

export default function Modal({ children, openModal, onCloseModal }) {
  const dialog = useRef();

  useEffect(() => {
    if (openModal) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [openModal]);
  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onCloseModal}>
      {openModal ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}

/*Note: By Passing this via Props modal is open but the Backdrop is not there because 
    Backdrop is visible only when call dialog.open.showModal() to get the backdrop from
    the props we need to use useEffect Hook
*/
