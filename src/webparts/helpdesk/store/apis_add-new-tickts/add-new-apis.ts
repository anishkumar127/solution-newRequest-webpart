import { Web } from "sp-pnp-js";
import { create } from "zustand";
import { useStore as useBorrowDataStore } from "../zustand";
import { devtools } from 'zustand/middleware'

import { immer } from "zustand/middleware/immer";
import ContextService from "../../loc/Services/ContextService";
interface State {
  // INITIAL STATE
  TeamsDepartmentData: any[];
  AddNewWebPartInfo: any;
  RequestTypeData: any[];
  PriorityData: any[];
  ServiceData: any[];
  SubServiceData: any[];
  RequestFieldsCheckboxData:any[];
  // FETCH
  fetchTeamsDepartmentApi: () => Promise<void>;
  fetchPriorityApi: () => Promise<void>;
  fetchRequestType: () => Promise<void>;
  fetchService: () => Promise<void>;
  fetchSubService: () => Promise<void>;
  initializeDataAddNewWebPart: () => Promise<void>;
  fetchRequestFieldsCheckbox:()=>Promise<void>;

  // GET
  getTeamsDepartmentApi: () => any[];
  getRequestType: () => any[];
  getPriorityApi: () => any[];
  getService: () => any[];
  getSubService: () => any[];
  getRequestFieldsCheckbox:()=>any[];
}

const storeData = (set, get) => ({
  // INITIAL STATE DATA
  TeamsDepartmentData: [],
  PriorityData: [],
  RequestTypeData: [],
  ServiceData: [],
  SubServiceData: [],
  AddNewWebPartInfo: null,
  RequestFieldsCheckboxData:[],
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
  fetchRequestFieldsCheckbox:async()=>{
    try {
      let web = new Web(ContextService.GetUrl());
      web.lists
        .getByTitle("HR365HDMAddNewTicketsWebpart").select('items/RequestTicketsCheckedFields')
        .items.get()
        .then((data) => {
          console.log("RequestFieldsCheckboxData",data)
          set({RequestFieldsCheckboxData:data})
        });

    } catch (error) {
      console.error("Error fetching Request Fields Checkbox",error);
    }
  },
  getRequestFieldsCheckbox: () => get().RequestFieldsCheckboxData,
  // <------------------- GETTING DATA ------------------------>
  getTeamsDepartmentApi: () => get().TeamsDepartmentData,
  getPriorityApi: () => get().PriorityData,
  getRequestType: () => get().RequestTypeData,
  getService: () => get().ServiceData,
  getSubService: () => get().SubServiceData,
});

export const useAddNewApiStore = create(
 devtools( immer<State>((set, get) => storeData(set, get)),{name:"add-new-api-store"})
);
