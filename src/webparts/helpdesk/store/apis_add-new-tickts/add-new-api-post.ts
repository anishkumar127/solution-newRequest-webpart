import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import ContextService from "../../loc/Services/ContextService";
import { useStore } from "../zustand";
interface State {
  setRequestFieldsCheckbox: (selectedCheckbox) => void;
  setDefaultRequestSettings: (defaultsSetting) => void;
  setWebpartTitle:(title)=>void;
}
export const useRequestPost = create(
  immer<State>((set) => ({
    setRequestFieldsCheckbox: async (selectedCheckbox) => {
      const TemplateData = {
        RequestTicketsCheckedFields: JSON.stringify(selectedCheckbox),
      };
      const { AddNewWebPartInfo } = useStore?.getState();
      const Id = AddNewWebPartInfo?.Id;
      console.log("Id", Id);
      try {
        if (Id) {
          await ContextService.GetSPContext().post(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMWPSettings')/items(${Id})`,
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
          );
          // .then((response: SPHttpClientResponse) => {
          //   if (response.ok) {
          //     return response.json();
          //   } else {
          //     throw new Error(
          //       `Request failed with status: ${response.status}`
          //     );
          //   }
          // });
        }
      } catch (error) {
        console.error("Posting RequestCheckbox Error", error);
      }
    },
    setDefaultRequestSettings: async (defaultsSetting) => {
      const TemplateData = {
        RequestTicketsDefaultSettings: JSON.stringify(defaultsSetting),
      };
      const { AddNewWebPartInfo } = useStore?.getState();
      const Id = AddNewWebPartInfo?.Id;
      console.log("Id", Id);
      try {
        if (Id) {
          await ContextService.GetSPContext().post(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMWPSettings')/items(${Id})`,
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
          );
          // .then((response: SPHttpClientResponse) => {
          //   if (response.ok) {
          //     return response.json();
          //   } else {
          //     throw new Error(
          //       `Request failed with status: ${response.status}`
          //     );
          //   }
          // });
        }
      } catch (error) {
        console.error("Posting RequestCheckbox Error", error);
      }
    },
    setWebpartTitle: async (title) => {
      const TemplateData = {
        WebpartTitle: title,
      };
      const { AddNewWebPartInfo } = useStore?.getState();
      const Id = AddNewWebPartInfo?.Id;
      console.log("Id", Id);
      try {
        if (Id) {
          await ContextService.GetSPContext().post(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMWPSettings')/items(${Id})`,
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
          );
          // .then((response: SPHttpClientResponse) => {
          //   if (response.ok) {
          //     return response.json();
          //   } else {
          //     throw new Error(
          //       `Request failed with status: ${response.status}`
          //     );
          //   }
          // });
        }
      } catch (error) {
        console.error("Posting RequestCheckbox Error", error);
      }
    },
  }))
);
