import { Web } from "sp-pnp-js";
import { create } from "zustand";
import { useStore as useBorrowDataStore } from "../zustand";
import { devtools } from "zustand/middleware";

import { immer } from "zustand/middleware/immer";
import ContextService from "../../loc/Services/ContextService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
interface State {
  // INITIAL STATE
  TeamsDepartmentData: any[];
  AddNewWebPartInfo: any;
  RequestTypeData: any[];
  PriorityData: any[];
  ServiceData: any[];
  SubServiceData: any[];
  RequestFieldsCheckboxData: any[];
  EmailTemplateData: any[];
  UserListsData: any[];
  // FETCH
  fetchTeamsDepartmentApi: () => Promise<void>;
  fetchPriorityApi: () => Promise<void>;
  fetchRequestType: () => Promise<void>;
  fetchService: () => Promise<void>;
  fetchSubService: () => Promise<void>;
  initializeDataAddNewWebPart: () => Promise<void>;
  fetchRequestFieldsCheckbox: () => Promise<void>;
  fetchEmailTemplate: () => Promise<void>;
  fetchUserLists: (siteURL) => Promise<void>;

  // GET
  getTeamsDepartmentApi: () => any[];
  getRequestType: () => any[];
  getPriorityApi: () => any[];
  getService: () => any[];
  getSubService: () => any[];
  getRequestFieldsCheckbox: () => any[];
  getEmailTemplate: () => any[];
  getUserLists: () => any[];
}

const storeData = (set, get) => ({
  // INITIAL STATE DATA
  TeamsDepartmentData: [],
  PriorityData: [],
  RequestTypeData: [],
  ServiceData: [],
  SubServiceData: [],
  AddNewWebPartInfo: null,
  RequestFieldsCheckboxData: [],
  EmailTemplateData: [],
  UserListsData: [],
  // <----------------- FETCHING DATA ------------------------->
  initializeDataAddNewWebPart: async () => {
    try {
      await useBorrowDataStore.getState().fetchIsInstalled();
      const data = useBorrowDataStore.getState().AddNewWebPartInfo;
      set({ AddNewWebPartInfo: data });
    } catch (err) {
      console.error("error initializing data", err);
    }
  },
  fetchTeamsDepartmentApi: async () => {
    try {
      //   await useBorrowDataStore.getState().fetchIsInstalled();
      //   const data = useBorrowDataStore.getState().AddNewWebPartInfo;
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let web = new Web(data?.SiteUrl);
        web.lists
          .getByTitle("HR365HDMDepartments")
          .items.select(
            "*,Supervisor1/Title,Supervisor1/Id&$filter=EscalationTeam eq 'No'&$expand=Supervisor1"
          )
          .get()
          .then((data) => {
            console.log("%c Ok", "color: red", data);
            if (data) {
              set({ TeamsDepartmentData: data });
            }
            // console.log("OK", data);
          });
      }
    } catch (err) {
      console.error("error api calls", err);
    }
  },
  fetchPriorityApi: async () => {
    try {
      //   await useBorrowDataStore.getState().fetchIsInstalled();
      //   const data = useBorrowDataStore.getState().AddNewWebPartInfo;
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let web = new Web(data?.SiteUrl);
        web.lists
          .getByTitle("HR365HDMPriority")
          .items.select("Title,DefaultType")
          .get()
          .then((data) => {
            console.log("Priority", data);
            if (data) {
              set({ PriorityData: data });
            }
          });
      }
    } catch (err) {}
  },
  fetchRequestType: async () => {
    try {
      //   await useBorrowDataStore.getState().fetchIsInstalled();
      //   const data = useBorrowDataStore.getState().AddNewWebPartInfo;
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let web = new Web(data?.SiteUrl);
        web.lists
          .getByTitle("HR365HDMRequestType")
          .items.select("Title,DefaultRequest")
          .get()
          .then((data) => {
            console.log("request type", data);
            if (data) {
              set({ RequestTypeData: data });
            }
          });
      }
    } catch (err) {
      console.error("error request type fetching", err);
    }
  },
  fetchService: async () => {
    try {
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let web = new Web(data?.SiteUrl);
        web.lists
          .getByTitle("HR365HDMServices")
          .items.get()
          .then((data) => {
            console.log("Service", data);
            if (data) {
              set({ ServiceData: data });
            }
          });
      }
    } catch (err) {
      console.error("error service fetching", err);
    }
  },
  fetchSubService: async () => {
    try {
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let web = new Web(data?.SiteUrl);
        web.lists
          .getByTitle("HR365HDMSubServices")
          .items.get()
          .then((data) => {
            console.log("SubService", data);
            if (data) {
              set({ SubServiceData: data });
            }
          });
      }
    } catch (err) {
      console.error("error subservice fetching", err);
    }
  },
  fetchRequestFieldsCheckbox: async () => {
    try {
      let web = new Web(ContextService.GetUrl());
      web.lists
        .getByTitle("HR365HDMWPSettings")
        .select("items/RequestTicketsCheckedFields")
        .items.get()
        .then((data) => {
          console.log("RequestFieldsCheckboxData", data);
          set({ RequestFieldsCheckboxData: data });
        });
    } catch (error) {
      console.error("Error fetching Request Fields Checkbox", error);
    }
  },
  fetchEmailTemplate: async () => {
    try {
      const data = get()?.AddNewWebPartInfo;
      if (data?.SiteUrl) {
        let allItems = [];
        ContextService.GetSPContext()
          .get(
            `${data?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMEmailNotifications')/items`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "odata-version": "",
              },
            }
          )
          .then((response: SPHttpClientResponse) => {
            return response.json();
          })
          .then((items: any) => {
            items?.value?.map((templ) => {
              let finaltemp = {
                ID: templ.ID,
                Title: templ.Title,
                Body: templ.Body,
                IsActive: templ.IsActive,
                Subject: templ.Subject,
                EmailSentTo: templ.EmailSentTo,
                CustomFormTemplate: templ.CustomFormTemplate,
              };
              allItems.push(finaltemp);
            });
            console.log("fetching mail template...");
            set({ EmailTemplateData: allItems });
          });
      }
    } catch (error) {
      console.error("fetching email template error", error);
    }
  },
  fetchUserLists: async (siteURL) => {
    try {
      const data = get()?.AddNewWebPartInfo;
      // if (data?.SiteUrl) {
      if (siteURL) {
        let web = new Web(siteURL);
        web.lists
          .getByTitle("HR365HDMUsers")
          .items.select(
            "*,ID,Roles,Users/Id,Users/Title,UsersId,Email,Department,Roles,TicketCount&$expand=Users"
          )
          .get()
          .then((data) => {
            set({ UserListsData: data });
          });
      }
    } catch (error) {
      console.error("Error fetching user lists", error);
    }
  },

  // <------------------- GETTING DATA ------------------------>
  getRequestFieldsCheckbox: () => get().RequestFieldsCheckboxData,
  getTeamsDepartmentApi: () => get().TeamsDepartmentData,
  getPriorityApi: () => get().PriorityData,
  getRequestType: () => get().RequestTypeData,
  getService: () => get().ServiceData,
  getSubService: () => get().SubServiceData,
  getEmailTemplate: () => get().EmailTemplateData,
  getUserLists: () => get().UserListsData,
});

export const useAddNewApiStore = create(
  devtools(
    immer<State>((set, get) => storeData(set, get)),
    { name: "add-new-api-store" }
  )
);
