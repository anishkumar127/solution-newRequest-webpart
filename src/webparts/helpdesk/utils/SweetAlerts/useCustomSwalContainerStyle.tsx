import { useEffect, useLayoutEffect } from 'react';

//anish
interface CustomSweetAlertProps {
    desiredWidth: string;
    saved?: boolean;
    error?: boolean;
    newerror?: boolean;
    saveddelete?: boolean;
    errordelete?: boolean;
}

const useCustomSwalContainerStyle = ({
    desiredWidth,
    saved,
    error,
    newerror,
}: CustomSweetAlertProps) => {
    useLayoutEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        // console.log('anish', container);
        if (container && (saved || error || newerror)) {
            container.style.position = "absolute";
            container.style.top = "50%";
            container.style.right = "0";
            container.style.transform = "translateY(-50%)"; //anish
        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            // console.log("CleanUp");
            if (container) {
                container.style.position = "absolute";
                container.style.top = "50%";
                container.style.right = "0";
                container.style.transform = "translateY(-50%)";
            }
        };
    }, [desiredWidth, saved, error, newerror]); // ..anish
}
// anish
const useCustomSwalContainerStyleSpecialCase = ({ desiredWidth, saveddelete, errordelete }: CustomSweetAlertProps) => {
    useEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        // console.log('anish', container);
        if (container && (saveddelete || errordelete)) {
            container.style.position = "absolute";
            container.style.top = "50%";
            container.style.right = "0";
            container.style.transform = "translateY(-50%)";
        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            if (container) {
                container.style.position = "absolute";
                container.style.top = "50%";
                container.style.right = "0";
                container.style.transform = "translateY(-50%)";
            }
        };
    }, [desiredWidth, saveddelete, errordelete]);
}

export { useCustomSwalContainerStyle, useCustomSwalContainerStyleSpecialCase };


// <------------------------ REMOVED BCZ OPTIMIZED BY ABOVE FUNCTION. ------------------------>

/*

interface CustomSweetAlertPropsBgRemover {
    saved?: boolean;
    error?: boolean;
    newerror?: boolean;
    saveddelete?: boolean;
    errordelete?: boolean;
}
// [ANISH]
// <-------------------------- BG REMOVER HOMEPAGE ---------------------------- >
const useCustomSwalContainerStyleBgRemover = ({ saved, error, newerror}: CustomSweetAlertPropsBgRemover) => {
    useEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        console.log('anish cleanup', container);
        if (container && (saved || error || newerror)) {
            container.style.position = "absolute";
            container.style.top = "50%";
            container.style.right = "0";
            container.style.transform = "translateY(-50%)"; //anish
        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            if (container) {
                container.style.position = "absolute";
                container.style.top = "50%";
                container.style.right = "0";
                container.style.transform = "translateY(-50%)";
                container.style.backgroundColor = "unset !important";
                container.style.setProperty('background-color', 'unset !important');

            }
        };
    }, [saved, error, newerror]); // ..anish
}
*/