//  ADD NEW TICKETS
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import ContextService from "../loc/Services/ContextService";

interface State {
  SettingsCollection: any;
  ThemesColor: string;
  ExpandScreen: boolean;
  fetchSettingsCollection: () => void;
  getSettingsCollection: () => any;
  setColorMode: (color: string) => void;
  getExpandMode: () => boolean;
  setExpandMode: (isExpand: boolean) => void;

  // <---------------------- GET & SET IS INSTALLED OR NOT APPLICATION ------------------------>
  getIsInstalled: () => any;
  fetchIsInstalled: () => void;
  AddNewWebPartInfo: any;
  setIsInstalled: (Template: any) => void;
}

export const useStore = create(
  // persist(
  immer<State>((set, get) => ({
    SettingsCollection: [],
    ThemesColor: "",
    ExpandScreen: false,
    // <------- AddNewWebPart List Installed Application Info ---------->
    AddNewWebPartInfo: {
      Id: 1,
      IsInstalled: "No",
      SiteUrl: "No",
    },

    fetchSettingsCollection: async () => {
      try {
        ContextService.GetSPContext()
          .get(
            // `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMSettings')/items`,
            `${get()?.AddNewWebPartInfo?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMSettings')/items`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "odata-version": "",
              },
            }
          )
          .then((response: SPHttpClientResponse) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Request failed with status: ${response.status}`);
            }
          })
          .then((items: any) => {
            const data = items?.value[0];
            set({ SettingsCollection: data });
          })
          .catch((error: Error) => {
            console.error("An error occurred:", error.message);
          });
      } catch (error) {
        console.error("A synchronous error occurred:", error);
      }
      console.log("called store fetch data");
    },
    getSettingsCollection: () => get().SettingsCollection,
    setColorMode: (color: string) =>
      set((state) => {
        const themeColors = color;
        if (themeColors) state.ThemesColor = themeColors;
      }),
    setExpandMode: (isExpand) => set({ ExpandScreen: isExpand }),
    getExpandMode: () => get().ExpandScreen,
    // <---------------------- GET IS INSTALLED OR NOT APPLICATION ------------------------>
    getIsInstalled: () => get().AddNewWebPartInfo,
    // <---------------------- Fetch IS INSTALLED OR NOT APPLICATION ------------------------>

    fetchIsInstalled: async () => {
      try {
        ContextService.GetSPContext()
          .get(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMAddNewTicketsWebpart')/items`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "odata-version": "",
              },
            }
          )
          .then((response: SPHttpClientResponse) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Request failed with status: ${response.status}`);
            }
          })
          .then((items: any) => {
            console.log("addNewWebpart", items);
            // const data = items?.value[0];
            const Template = {
              Id: items?.value[0]?.ID,
              IsInstalled: items?.value[0]?.IsInstalled,
              SiteUrl: items?.value[0]?.SiteUrl,
            };
            set({ AddNewWebPartInfo: Template });
          })
          .catch((error: Error) => {
            console.error("An error occurred:", error.message);
          });
      } catch (error) {
        console.error("A synchronous error occurred:", error);
      }
      console.log("called store fetch data");
    },
    // <---------------------- SET IS INSTALLED OR NOT APPLICATION ------------------------>
    setIsInstalled: async (Template) => {
      const TemplateData = {
        IsInstalled: Template?.IsInstalled,
        SiteUrl: Template?.SiteUrl,
      };
      console.log("TemplateData", TemplateData);
      try {
        await ContextService.GetSPContext()
          .post(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMAddNewTicketsWebpart')/items(${
              get()?.AddNewWebPartInfo?.Id
            })`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "Content-type": "application/json;odata=nometadata",
                "odata-version": "",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE",
              },
              body: JSON.stringify(TemplateData),
            }
          )
          .then((response: SPHttpClientResponse) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Request failed with status: ${response.status}`);
            }
          })
          .then((items: any) => {
            console.log("addNewWebpart", items);
            const updatedTemplate = {
              Id: items?.value[0]?.ID,
              IsInstalled: items?.value[0]?.IsInstalled,
              SiteUrl: items?.value[0]?.SiteUrl,
            };
            set({ AddNewWebPartInfo: updatedTemplate });
            // useStore.getState().setIsInstalled(updatedTemplate);
          })
          .catch((error: Error) => {
            console.error("An error occurred:", error.message);
          });
      } catch (error) {
        console.error("A synchronous error occurred:", error);
      }
      console.log("called store fetch data");
    },
  }))
  //   {
  //     name: "SettingsCollection-storage",
  //     getStorage: () => localStorage, // by default
  //   }
  // )
);
