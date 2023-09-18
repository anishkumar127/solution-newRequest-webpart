import React, { useEffect, useLayoutEffect } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
/*                              NOTES - ANISH
type: SweetAlertIcon, title: string, text: string, isBehindVisible: boolean, IsConfirmBtn: boolean

    - type -> success, error, warning, info, question
    - title -> success, error, warning, info, question
    - isBehindVisible -> true, false - Background is visible or not
    - IsConfirmBtn -> true, false - Confirm button is visible or not
    - CustomClass -> Custom Class for popup and title - Will Be In Future.
*/

interface CustomSweetAlertProps {
    type: SweetAlertIcon;
    title: string;
    text: string;
    isBehindVisible: boolean;
    isConfirmBtn: boolean;
    countdown?: number;
    popupCustomClass?: string;
    id?: string;
}

const ReusableSweetAlerts: React.FC<CustomSweetAlertProps> = ({
    type,
    title,
    text,
    isBehindVisible,
    isConfirmBtn,
    countdown,
    popupCustomClass,
    id,
}) => {
    useLayoutEffect(() => {
        const showSweetAlert = () => {
            const config = {
                icon: type,
                text,
                target: id,
                customClass: {
                    popup: popupCustomClass, // Custom Classes Based on our needs. [ANISH]
                    title: 'sweet-custom-title-class',
                },
                backdrop: isBehindVisible, //  overlay based on condiiton.
                showConfirmButton: isConfirmBtn,
                timer: countdown,
                allowOutsideClick: false,
            };

            if (title !== 'Skip' && title !== null && title !== undefined && title !== '') {
                config['title'] = title;
            } else {
                config['title'] = null;
            }

            Swal.fire(config);
        };
        showSweetAlert();
        // Clean up the event - unmounts
        return () => {
            // if it is need. // anish
        };
    }, [type, title, text, isBehindVisible, isConfirmBtn, countdown, popupCustomClass, id]);

    return null;
};

export default ReusableSweetAlerts;


/*                              CSS IF NEED OVERFLOW. ANISH
 // <------------------------ SWEET ALETER Custom overlay style  ---------------------------->
  .custom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); // opacity
    z-index: 9999; //z-index is higher than the SweetAlert popup
    pointer-events: auto; // prevent interactions
  }

*/