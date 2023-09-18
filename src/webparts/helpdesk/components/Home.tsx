import * as React from 'react'
import { Web } from 'sp-pnp-js';
import ContextService from '../loc/Services/ContextService';
import { useStore } from '../store/zustand';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ITheme, createTheme } from 'office-ui-fabric-react';
let PriorityOptionsDropDown; // Alternative of State Delay
import './global.scss'
import Header from './tickets/Header';
import SingleLayoutAddNewTicket from './tickets/SingleLayout/SingleLayoutAddNewTicket';
import SingleLayoutHeader from './tickets/SingleLayout/SingleLayoutHeader';
import AddNewTickets from './tickets/AddNewTickets';
import AddNewWebPartInstallation from './tickets/AddNewWebPartInstallation/AddNewWebPartInstallation';
let themeMode = 'theme';
// THEME DARK OR LIGHT COLOR CHECKER.
function isColorDark(color) {
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);

  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness < 128;
}
let ThemesColor;
const ThemeColorsFromWindow: any = (window as any).__themeState__.theme;
const siteTheme: ITheme = createTheme({ //pass this object to your components
  palette: ThemeColorsFromWindow
});
const Home = () => {
  const fetchSettingsCollection = useStore((state) => state.fetchSettingsCollection);
  const SettingsCollection = useStore((state) => state.SettingsCollection);
  const setColorMode = useStore((state) => state.setColorMode);
  const getExpandMode = useStore((state) => state.getExpandMode());
  React.useEffect(() => {

    const fetchfetchSettingsCollectionData = async () => {
      await fetchSettingsCollection();
    }
    fetchfetchSettingsCollectionData();
    console.log("SettingsCollection", SettingsCollection);

  }, []);

  // console.log("SettingsCollection", SettingsCollection);

  React.useEffect(() => {
    themeMode = SettingsCollection?.DarkMode
    if (themeMode) {
      if (themeMode == 'light') {
        setColorMode("light");
        ThemesColor = "light";
        document.documentElement.style.setProperty(
          "--lightdarkBG",
          "#fff",
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGTable",
          "#e9e9e9",
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGGray",
          "#e9e9e9",
        );
        document.documentElement.style.setProperty(
          "--lightdarkColor",
          "#323130",
        );
        document.documentElement.style.setProperty(
          "--lightdarkHoverBG",
          // "#f4f4f4",
          "#e2e2e2",
        );

        document.documentElement.style.setProperty("--textIconColor", "#333");
        document.documentElement.style.setProperty(
          "--pivotSelectedTextColor",
          "#333"
        );
        document.documentElement.style.setProperty(
          "--pivotSelectedBGColor",
          "#d0d0d0"
        );

        //anish - white mode
        document.documentElement.style.setProperty(
          "--lightThemeBGcolorWhite",
          "#fff"
        );

        document.documentElement.style.setProperty(
          "--lightThemeTextColorBlack",
          "#333"
        );
        document.documentElement.style.setProperty(
          "--lightThemeHoverBGColor",
          "#f3f2f1"
        );
        // columns title
        document.documentElement.style.setProperty(
          "--lightThemePivotTextBlack",
          "#333"
        );

        // TEXT SWITCHER
        document.documentElement.style.setProperty(
          "--lightThemeSwitcherTextColor",
          "#333"
        );

        // PANEL BG SWICHER.
        document.documentElement.style.setProperty(
          "--lightThemePanelBGSwitcher",
          "#f5f5f5"
        );

        // PANEL ACTION BUTTON BG SWITCHER.
        document.documentElement.style.setProperty(
          "--lightThemeActionButtonBGBlack",
          "#e9e9e9"
        );

        // COMMENTS PAGE REACT QUIL BORDER 
        document.documentElement.style.setProperty(
          "--lightThemeBorderColor",
          "#ddd"
        );

        // NEW TICKET PERSONA COLOR PERSON
        document.documentElement.style.setProperty(
          "--lightThemePersonaNameColor",
          "#f3f2f1"
        );

        // TOGGLE BUTTON ON
        document.documentElement.style.setProperty(
          "--lightThemeToggleBtnOn",
          "#333"
        );
        // TOGGLE BUTTON OFF
        document.documentElement.style.setProperty(
          "--lightThemeToggleBtnOff",
          "#fff"
        );

        // TOGGLE BUTTON CIRCLE ON
        document.documentElement.style.setProperty(
          "--lightThemeToggleCircleBtnOn",
          "#fff"
        );
        // TOGGLE BUTTON CIRCLE OFF
        document.documentElement.style.setProperty(
          "--lightThemeToggleCircleBtnOff",
          "#333"
        );

        // COMMENTS PRIVATE NOTE COLOR 
        document.documentElement.style.setProperty(
          "--lightThemePrivateNoteColor",
          "#8d20ae"
        );
        // SELECTION ICON COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSelectionIcon",
          "rgb(233 233 233)"
        );

        // SETTINGS PAGE BG COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSettingBgColor",
          "#f8f8f8"
        );
        // SETTINGS PAGE ICON COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSettingIconColor",
          "#333"
        );
        // BORDER-COLOR - ALL APPLICATION
        document.documentElement.style.setProperty(
          "--lightThemeDropDownBorderColor",
          "#d3d1ce"
        );
        // BORDER - BOTTOM - COLOR - HOMEPAGE - DETAIL LIST BELOW
        document.documentElement.style.setProperty(
          "--lightThemeBorderBottomColor",
          "#dbd3d3"
        );
        // DASHBOARD DATA - BG & COLOR 
        document.documentElement.style.setProperty(
          "--lightThemeDashboardBGColor",
          "#ffffff"
        );
        //  ATTACHMENT - BG COLOR
        document.documentElement.style.setProperty(
          "--lightThemeAttachmentBGColor",
          "#e2e2e2"
        );
        // <-------------------- DETAILS LIST -------------------->
        // PRIORITY TEXT COLOR 
        // URGENT COLOR
        document.documentElement.style.setProperty(
          "--lightThemePriorityTextColor",
          "#333"
        );
        // EVEN ODD BG
        document.documentElement.style.setProperty(
          "--lightThemeDetailsListBGEvenOdd",
          "#f5f5f5"
        );
        // PRIORITY 
        // HIGH
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityHigh",
          "rgba(255, 152, 0, 0.21)"
        );
        // URGENT
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityUrgent",
          "rgb(247, 208, 207)"
        );
        // CLOSED
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityClosed",
          "rgb(55, 196, 45,0.15)"
        );
      }
      else if (themeMode == 'dark') {
        ThemesColor = "dark";
        setColorMode("dark");

        // anish - dark mode
        document.documentElement.style.setProperty(
          "--lightThemeBGcolorWhite",
          // "#212121"
          "#1f1f1f"
        );
        document.documentElement.style.setProperty(
          "--lightThemeTextColorBlack",
          // "#fff"
          "#eeeeee"
        );

        document.documentElement.style.setProperty(
          "--lightThemeHoverBGColor",
          "#191919"
        );

        // columns title
        document.documentElement.style.setProperty(
          "--lightThemePivotTextBlack",
          // "#fff"
          "#eeeeee"
        );

        // TEXT SWITCHER
        document.documentElement.style.setProperty(
          "--lightThemeSwitcherTextColor",
          // "#fff"
          "#eeeeee"
        );

        // PANEL BG SWICHER.
        document.documentElement.style.setProperty(
          "--lightThemePanelBGSwitcher",
          "#212121"
        );

        // PANEL ACTION BUTTON BG SWITCHER.
        document.documentElement.style.setProperty(
          "--lightThemeActionButtonBGBlack",
          "#141414"
        );

        // NEW TICKET PERSONA COLOR PERSON
        document.documentElement.style.setProperty(
          "--lightThemePersonaNameColor",
          "#212121"
        );

        // TOGGLE BUTTON ON
        document.documentElement.style.setProperty(
          "--lightThemeToggleBtnOn",
          "#fff"
        );
        // TOGGLE BUTTON OFF
        document.documentElement.style.setProperty(
          "--lightThemeToggleBtnOff",
          "#212121"
        );
        // TOGGLE BUTTON CIRCLE ON
        document.documentElement.style.setProperty(
          "--lightThemeToggleCircleBtnOn",
          "#333"
        );
        // TOGGLE BUTTON CIRCLE OFF
        document.documentElement.style.setProperty(
          "--lightThemeToggleCircleBtnOff",
          "#fff"
        );
        // COMMENTS PRIVATE NOTE COLOR 
        document.documentElement.style.setProperty(
          "--lightThemePrivateNoteColor",
          "#8d20ae"
        );
        // SELECTION ICON COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSelectionIcon",
          "rgb(233 233 233)"
        );
        // SETTINGS PAGE BG COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSettingBgColor",
          "#141414"
        );
        // SETTINGS PAGE ICON COLOR
        document.documentElement.style.setProperty(
          "--lightThemeSettingIconColor",
          "#eeeeee"
        );
        // BORDER-COLOR - ALL APPLICATION
        document.documentElement.style.setProperty(
          "--lightThemeDropDownBorderColor",
          // "#d3d1ceb3"
          "#666666"
        );
        // BORDER - BOTTOM - COLOR - HOMEPAGE - DETAIL LIST BELOW
        document.documentElement.style.setProperty(
          "--lightThemeBorderBottomColor",
          // "#d3d1ceb3"
          "#666666"
        );
        // DASHBOARD DATA - BG & COLOR 
        document.documentElement.style.setProperty(
          "--lightThemeDashboardBGColor",
          "#1b1a19"
        );
        //  ATTACHMENT - BG COLOR
        document.documentElement.style.setProperty(
          "--lightThemeAttachmentBGColor",
          "#1f1f1f"
        );

        // <-------------------- DETAILS LIST -------------------->
        // PRIORITY TEXT COLOR 
        // URGENT COLOR
        document.documentElement.style.setProperty(
          "--lightThemePriorityTextColor",
          "#eeeeee"
        );
        // EVEN ODD BG
        document.documentElement.style.setProperty(
          "--lightThemeDetailsListBGEvenOdd",
          "#f5f5f5"
        );
        // PRIORITY 
        // HIGH
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityHigh",
          "rgba(255, 152, 0, 0.21)"
        );
        // URGENT
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityUrgent",
          "#935150"
        );
        // CLOSED
        document.documentElement.style.setProperty(
          "--lightThemeBGPriorityClosed",
          "#24d81730"
        );

        //
        document.documentElement.style.setProperty(
          "--lightdarkBG",
          "#000"
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGTable",
          "#00000040"
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGGray",
          "#141414"
        );
        document.documentElement.style.setProperty(
          "--lightdarkColor",
          "#fff"
        );
        document.documentElement.style.setProperty(
          "--lightdarkHoverBG",
          "#484848"
        );
        document.documentElement.style.setProperty("--textIconColor", "#333");
        document.documentElement.style.setProperty(
          "--pivotSelectedTextColor",
          "#fff"
        );
        document.documentElement.style.setProperty(
          "--pivotSelectedBGColor",
          "#000"
        );

      }
      else if (themeMode?.toLowerCase() == 'theme') {
        let ColorMode;
        let bodyBackground = siteTheme.semanticColors.bodyBackground;

        if (bodyBackground) {
          let isDark = isColorDark(bodyBackground);
          if (isDark) {
            console.log("Dark variant");
            ColorMode = "dark";
          } else {
            console.log("Light variant");
            ColorMode = "light";
          }
        } else {
          console.log("don't know");
        }

        if (ColorMode === "dark" || siteTheme.semanticColors.bodyBackground === "#1f1f1f" || siteTheme.semanticColors.bodyBackground === "#182534") {
          ThemesColor = "dark"
          setColorMode("dark");

          // dark mode
          document.documentElement.style.setProperty(
            "--lightThemeBGcolorWhite",
            // "#212121"
            "#1f1f1f"
          );
          document.documentElement.style.setProperty(
            "--lightThemeTextColorBlack",
            // "#fff"
            "#eeeeee"
          );
          document.documentElement.style.setProperty(
            "--lightThemeHoverBGColor",
            "#191919"
          );
          // columns title
          document.documentElement.style.setProperty(
            "--lightThemePivotTextBlack",
            // "#fff"
            "#eeeeee"
          );

          // TEXT SWITCHER
          document.documentElement.style.setProperty(
            "--lightThemeSwitcherTextColor",
            // "#fff"
            "#eeeeee"
          );

          // PANEL BG SWICHER.
          document.documentElement.style.setProperty(
            "--lightThemePanelBGSwitcher",
            "#212121"
          );

          // PANEL ACTION BUTTON BG SWITCHER.
          document.documentElement.style.setProperty(
            "--lightThemeActionButtonBGBlack",
            siteTheme.palette.themePrimary + "40"
          );
          // NEW TICKET PERSONA COLOR PERSON
          document.documentElement.style.setProperty(
            "--lightThemePersonaNameColor",
            "#212121"
          );
          // TOGGLE BUTTON ON
          document.documentElement.style.setProperty(
            "--lightThemeToggleBtnOn",
            siteTheme.palette.themeDark
          );
          // TOGGLE BUTTON OFF
          document.documentElement.style.setProperty(
            "--lightThemeToggleBtnOff",
            "#fff"
          );

          // TOGGLE BUTTON CIRCLE ON
          document.documentElement.style.setProperty(
            "--lightThemeToggleCircleBtnOn",
            "#333"
          );
          // TOGGLE BUTTON CIRCLE OFF
          document.documentElement.style.setProperty(
            "--lightThemeToggleCircleBtnOff",
            "#333"
          );
          // COMMENTS PRIVATE NOTE COLOR 
          document.documentElement.style.setProperty(
            "--lightThemePrivateNoteColor",
            "#8d20ae"
          );
          // SELECTION ICON COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSelectionIcon",
            "rgb(25 25 25)"
          );
          // SETTINGS PAGE BG COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSettingBgColor",
            "#141414"
          );
          // SETTINGS PAGE ICON COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSettingIconColor",
            siteTheme.palette.themeDark
          );
          // BORDER-COLOR - ALL APPLICATION
          document.documentElement.style.setProperty(
            "--lightThemeDropDownBorderColor",
            // "#d3d1ceb3"
            "#666666"
          );
          // BORDER - BOTTOM - COLOR - HOMEPAGE - DETAIL LIST BELOW
          document.documentElement.style.setProperty(
            "--lightThemeBorderBottomColor",
            // "#d3d1ceb3"
            "#666666"
          );
          // DASHBOARD DATA - BG & COLOR 
          document.documentElement.style.setProperty(
            "--lightThemeDashboardBGColor",
            "#1b1a19"
          );
          //  ATTACHMENT - BG COLOR
          document.documentElement.style.setProperty(
            "--lightThemeAttachmentBGColor",
            "#1f1f1f"
          );
          // <-------------------- DETAILS LIST -------------------->
          // PRIORITY TEXT COLOR 
          // URGENT COLOR
          document.documentElement.style.setProperty(
            "--lightThemePriorityTextColor",
            "#eeeeee"
          );
          // EVEN ODD BG
          document.documentElement.style.setProperty(
            "--lightThemeDetailsListBGEvenOdd",
            siteTheme.palette.themeDark
          );
          // PRIORITY 
          // HIGH
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityHigh",
            "rgba(255, 152, 0, 0.21)"
          );
          // URGENT
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityUrgent",
            "#935150"
          );
          // CLOSED
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityClosed",
            "#24d81730"
          );

        } else if (siteTheme.semanticColors.bodyBackground === "#fcfcfc" || ColorMode === "light" || siteTheme.semanticColors.bodyBackground === "#ffffff" || siteTheme.semanticColors.bodyBackground === "#f0eed3" || siteTheme.semanticColors.bodyBackground === "#ececec" || siteTheme.semanticColors.bodyBackground === "#cae379") {
          // white mode
          setColorMode("");
          document.documentElement.style.setProperty(
            "--lightThemeBGcolorWhite",
            "#fff"
          );

          document.documentElement.style.setProperty(
            "--lightThemeTextColorBlack",
            "#333"
          );
          document.documentElement.style.setProperty(
            "--lightThemeHoverBGColor",
            "#f3f2f1"
          );
          document.documentElement.style.setProperty(
            "--lightThemePivotTextBlack",
            siteTheme.palette.themeDark
          );

          // TEXT SWITCHER
          document.documentElement.style.setProperty(
            "--lightThemeSwitcherTextColor",
            "#fff"
          );
          // PANEL BG SWICHER.
          document.documentElement.style.setProperty(
            "--lightThemePanelBGSwitcher",
            "#f5f5f5"
          );

          // PANEL ACTION BUTTON BG SWITCHER.
          document.documentElement.style.setProperty(
            "--lightThemeActionButtonBGBlack",
            siteTheme.palette.themePrimary + "40"
          );

          // COMMENTS PAGE REACT QUIL BORDER 
          document.documentElement.style.setProperty(
            "--lightThemeBorderColor",
            "#ddd"
          );

          // NEW TICKET PERSONA COLOR PERSON
          document.documentElement.style.setProperty(
            "--lightThemePersonaNameColor",
            "#f3f2f1"
          );
          // TOGGLE BUTTON ON
          document.documentElement.style.setProperty(
            "--lightThemeToggleBtnOn",
            siteTheme.palette.themeDark
          );
          // TOGGLE BUTTON OFF
          document.documentElement.style.setProperty(
            "--lightThemeToggleBtnOff",
            "#fff"
          );
          // TOGGLE BUTTON CIRCLE ON
          document.documentElement.style.setProperty(
            "--lightThemeToggleCircleBtnOn",
            "#fff"
          );
          // TOGGLE BUTTON CIRCLE OFF
          document.documentElement.style.setProperty(
            "--lightThemeToggleCircleBtnOff",
            "#333"
          );
          // COMMENTS PRIVATE NOTE COLOR 
          document.documentElement.style.setProperty(
            "--lightThemePrivateNoteColor",
            "#8d20ae"
          );

          // SELECTION ICON COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSelectionIcon",
            "#dabede"
          );
          // SETTINGS PAGE BG COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSettingBgColor",
            "#f8f8f8"
          );
          // SETTINGS PAGE ICON COLOR
          document.documentElement.style.setProperty(
            "--lightThemeSettingIconColor",
            siteTheme.palette.themeDark
          );
          // BORDER-COLOR - ALL APPLICATION
          document.documentElement.style.setProperty(
            "--lightThemeDropDownBorderColor",
            "#d3d1ce"
          );
          // BORDER - BOTTOM - COLOR - HOMEPAGE - DETAIL LIST BELOW
          document.documentElement.style.setProperty(
            "--lightThemeBorderBottomColor",
            "#dbd3d3"
          );
          // DASHBOARD DATA - BG & COLOR 
          document.documentElement.style.setProperty(
            "--lightThemeDashboardBGColor",
            "#ffffff"
          );
          //  ATTACHMENT - BG COLOR
          document.documentElement.style.setProperty(
            "--lightThemeAttachmentBGColor",
            "#e2e2e2"
          );
          // <-------------------- DETAILS LIST -------------------->
          // PRIORITY TEXT COLOR 
          // URGENT COLOR
          document.documentElement.style.setProperty(
            "--lightThemePriorityTextColor",
            "#333"
          );
          // EVEN ODD BG
          document.documentElement.style.setProperty(
            "--lightThemeDetailsListBGEvenOdd",
            "#f5f5f5"
          );
          // PRIORITY 
          // HIGH
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityHigh",
            "rgba(255, 152, 0, 0.21)"
          );
          // URGENT
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityUrgent",
            "rgb(247, 208, 207)"
          );
          // CLOSED
          document.documentElement.style.setProperty(
            "--lightThemeBGPriorityClosed",
            "rgb(55, 196, 45,0.15)"
          );

        }


        document.documentElement.style.setProperty(
          "--lightdarkBG",
          siteTheme.palette.themePrimary
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGTable",
          siteTheme.palette.themePrimary + "40"
        );
        document.documentElement.style.setProperty(
          "--lightdarkBGGray",
          siteTheme.palette.themeDark
        );
        document.documentElement.style.setProperty(
          "--lightdarkColor",
          siteTheme.palette.white
        );
        document.documentElement.style.setProperty(
          "--lightdarkHoverBG",
          siteTheme.palette.themeSecondary
        );
        document.documentElement.style.setProperty(
          "--textIconColor",
          siteTheme.palette.themePrimary
        );
        document.documentElement.style.setProperty(
          "--pivotSelectedTextColor",
          siteTheme.palette.white
        );
        document.documentElement.style.setProperty(
          "--pivotSelectedBGColor",
          siteTheme.palette.themePrimary
        );
        //
      }
    }
    else {

      // white mode site anish
      document.documentElement.style.setProperty(
        "--lightThemeBGcolorWhite",
        "#fff"
      );

      document.documentElement.style.setProperty(
        "--lightThemeTextColorBlack",
        "#333"
      );
      document.documentElement.style.setProperty(
        "--lightThemeHoverBGColor",
        "#f3f2f1"
      );
      document.documentElement.style.setProperty(
        "--lightThemePivotTextBlack",
        siteTheme.palette.themeDark
      );

      // TEXT SWITCHER
      document.documentElement.style.setProperty(
        "--lightThemeSwitcherTextColor",
        "#fff"
      );
      // PANEL BG SWICHER.
      document.documentElement.style.setProperty(
        "--lightThemePanelBGSwitcher",
        "#f5f5f5"
      );

      // PANEL ACTION BUTTON BG SWITCHER.
      document.documentElement.style.setProperty(
        "--lightThemeActionButtonBGBlack",
        siteTheme.palette.themePrimary + "40"
      );

      // COMMENTS PAGE REACT QUIL BORDER 
      document.documentElement.style.setProperty(
        "--lightThemeBorderColor",
        "#ddd"
      );

      // NEW TICKET PERSONA COLOR PERSON
      document.documentElement.style.setProperty(
        "--lightThemePersonaNameColor",
        "#f3f2f1"
      );
      // TOGGLE BUTTON ON
      document.documentElement.style.setProperty(
        "--lightThemeToggleBtnOn",
        siteTheme.palette.themeDark
      );
      // TOGGLE BUTTON OFF
      document.documentElement.style.setProperty(
        "--lightThemeToggleBtnOff",
        "#fff"
      );
      // TOGGLE BUTTON CIRCLE ON
      document.documentElement.style.setProperty(
        "--lightThemeToggleCircleBtnOn",
        "#fff"
      );
      // TOGGLE BUTTON CIRCLE OFF
      document.documentElement.style.setProperty(
        "--lightThemeToggleCircleBtnOff",
        "#333"
      );
      // COMMENTS PRIVATE NOTE COLOR 
      document.documentElement.style.setProperty(
        "--lightThemePrivateNoteColor",
        "#8d20ae"
      );

      // SELECTION ICON COLOR
      document.documentElement.style.setProperty(
        "--lightThemeSelectionIcon",
        "#dabede"
      );
      // SETTINGS PAGE BG COLOR
      document.documentElement.style.setProperty(
        "--lightThemeSettingBgColor",
        "#f8f8f8"
      );
      // SETTINGS PAGE ICON COLOR
      document.documentElement.style.setProperty(
        "--lightThemeSettingIconColor",
        siteTheme.palette.themeDark
      );
      // BORDER-COLOR - ALL APPLICATION
      document.documentElement.style.setProperty(
        "--lightThemeDropDownBorderColor",
        "#d3d1ce"
      );
      // BORDER - BOTTOM - COLOR - HOMEPAGE - DETAIL LIST BELOW
      document.documentElement.style.setProperty(
        "--lightThemeBorderBottomColor",
        "#dbd3d3"
      );
      // DASHBOARD DATA - BG & COLOR 
      document.documentElement.style.setProperty(
        "--lightThemeDashboardBGColor",
        "#ffffff"
      );
      //  ATTACHMENT - BG COLOR
      document.documentElement.style.setProperty(
        "--lightThemeAttachmentBGColor",
        "#e2e2e2"
      );
      // <-------------------- DETAILS LIST -------------------->
      // PRIORITY TEXT COLOR 
      // URGENT COLOR
      document.documentElement.style.setProperty(
        "--lightThemePriorityTextColor",
        "#333"
      );
      // EVEN ODD BG
      document.documentElement.style.setProperty(
        "--lightThemeDetailsListBGEvenOdd",
        "#f5f5f5"
      );
      // PRIORITY 
      // HIGH
      document.documentElement.style.setProperty(
        "--lightThemeBGPriorityHigh",
        "rgba(255, 152, 0, 0.21)"
      );
      // URGENT
      document.documentElement.style.setProperty(
        "--lightThemeBGPriorityUrgent",
        "rgb(247, 208, 207)"
      );
      // CLOSED
      document.documentElement.style.setProperty(
        "--lightThemeBGPriorityClosed",
        "rgb(55, 196, 45,0.15)"
      );


    }

  }, [SettingsCollection?.DarkMode])

  function handleOverlayDrag() {
    let overlay = document.querySelectorAll(".ms-Overlay")
    overlay.forEach((item) => {
      item.addEventListener("dragover", () => {
        let wrapper = document.querySelector(".file-input-wrapper")
        wrapper.classList.add("hidden")
      })
    }
    )
  }
  const handleParentDrag = (() => {
    handleOverlayDrag();
    let wrapper = document.querySelector(".file-input-wrapper")
    wrapper.classList.remove("hidden");
  })
  const handleParentDrop = (e: any) => {
    let wrapper = document.querySelector(".file-input-wrapper")
    wrapper.classList.add("hidden")
    wrapper.classList.add("b-w-img")
  }

  console.log("getExpandMode", getExpandMode);
  return (
    <>
      {/* Add New Tickets */}
      {/*       
      <Header ThemesColor ={ThemesColor}/>
      <div onDragOver={handleParentDrag} onDrop={handleParentDrop}>
      <AddNewTickets isTicketMailBox={"Yes"}
        // LicenseType="trial"
        LicenseType="P4"
        lightdarkmode={themeMode}
        userType={"Admin"}
      />
      </div> */}

      {/* Single Layout 
      <div className='single-layout-add-new-ticket-style'>
      <SingleLayoutHeader/>
      <SingleLayoutAddNewTicket/>
      </div> */}

      {
        getExpandMode ?
          <>
            {/* <Header/> */}
            <div onDragOver={handleParentDrag} onDrop={handleParentDrop}>
              <AddNewTickets isTicketMailBox={"Yes"}
                LicenseType="P4"
                lightdarkmode={themeMode}
                userType={"Admin"}
              />
            </div>
          </>
          : <>

            {/* Single Layout  */}
            <div className='single-layout-add-new-ticket-style'>
              {/* <SingleLayoutHeader /> */}
              <SingleLayoutAddNewTicket />
            </div>
          </>
      }
    </>
  )
}

export default Home;