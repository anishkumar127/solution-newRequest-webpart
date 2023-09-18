import React from 'react';
import { themeContext } from '../../context/userThemeContext';
export const useCustomStyles = (lightdarkmode) => {
    // console.log("Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh jai shree ram")
    let ThemesColor = React.useContext(themeContext)

    const customStylesselect = {
        control: (provided, state) => ({
            ...provided,
            // border: state.isFocused ? lightdarkmode == 'light' ? '2px var(--lightdarkColor) solid' : '2px var(--lightdarkBG) solid' : provided.border,
            border: state.isFocused ? lightdarkmode == 'light' ? '2px var(--lightdarkColor) solid' : '2px var(--lightdarkBG) solid' : ThemesColor ==="dark" ? "1px #666666 solid" : provided.border,
            minHeight: state.isFocused ? '32px !important' : '32px !important',
            boxShadow: state.isFocused ? lightdarkmode == 'light' ? '0 0 3px var(--lightdarkColor) solid' : '0 0 3px var(--lightdarkBGTable)' : provided.boxShadow,
            borderRadius: state.isFocused ? '0px' : '0px',
            backgroundColor: ThemesColor == 'dark' ? '#333' : 'white',

            ':hover': {
                border: state.isFocused ? lightdarkmode == 'light' ? '2px var(--lightdarkColor) solid' : '2px var(--lightdarkBG) solid' : provided.border,
                minHeight: state.isFocused ? '32px !important' : '32px !important',
                borderRadius: state.isFocused ? '0px' : '0px',

            }
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: ThemesColor == 'dark' ? '#333' : 'white',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? lightdarkmode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBG)' : ThemesColor == 'dark' ? '#333' : 'white',
            borderRadius: state.isFocused ? '0px' : '0px',
            color:ThemesColor == 'dark' ? '#fff' : state.isSelected ? '#fff' :  '#333',
            fontSize:"14px !important",
            ':hover': {
                backgroundColor: state.isSelected ? lightdarkmode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBG)' : 'var(--lightdarkBGTable)',
                borderRadius: state.isFocused ? '0px' : '0px',
                color:ThemesColor == 'dark' ? '#fff' :state.isSelected ? '#fff' :  '#333',

            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: ThemesColor === "dark" ? "#fff" : "#333",
            fontSize:"14px !important"
          }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : ThemesColor == 'dark' ? '#fff' : '#333',
            backgroundColor: state.isSelected ? 'var(--lightdarkBG)' : ThemesColor == 'dark' ? '#333' : 'white',
            fontSize:"14px !important"
        })
    };
    return customStylesselect;
};
