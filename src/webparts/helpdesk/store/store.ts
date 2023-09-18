
// MY TICKETS STORE 

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import ContextService from "../loc/Services/ContextService";

interface State {
  MyTicketsData: any;
  ThemesColor: string;
  fetchMyTicketsData: () => void;
  getMyTicketsData: () => any;
  setColorMode: (color: string) => void;
  SettingsCollection: any;
  fetchSettingsCollection: () => void;
  getSettingsCollection: () => any;
}

export const useStore = create(
  // persist(
    immer<State>((set, get) => ({
      SettingsCollection: [],
      MyTicketsData: [],
      ThemesColor: "",
      fetchSettingsCollection: async () => {
        try {
          ContextService.GetSPContext()
            .get(
              `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMSettings')/items`,
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
                throw new Error(
                  `Request failed with status: ${response.status}`
                );
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
      fetchMyTicketsData: async () => {
        try {
          var currentuserId = ContextService.GetCurentUserId();
          ContextService.GetSPContext()
            .get(
              `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMTickets')/items/?$select=ID,DepartmentName,ReadStatus,Created,TicketCreatedDate,Title,Priority,RequestType,SLAResolveDone,RequesterEmail,Services,SubServices,TicketDescription,SubServicesL3,UserViewTicketData,SubServicesL2,Status,AssignedTomail,RequesterName,RequesterId,AssignedTo,TicketProperties,ActionOnTicket,TicketSeqnumber,Requester/Title,AssignedTo/Title&$expand=AssignedTo/ID,Requester/ID&$top=5000&$orderby=TicketCreatedDate desc&$filter=AssignedToId eq '${currentuserId}'`,
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
                throw new Error(
                  `Request failed with status: ${response.status}`
                );
              }
            })
            .then((items: any) => {
              const data = items?.value;
              console.log("MyTickets=>",items.value)
              set({ MyTicketsData: data });
            })
            .catch((error: Error) => {
              console.error("An error occurred:", error.message);
            });
        } catch (error) {
          console.error("A synchronous error occurred:", error);
        }
        console.log("called store fetch data");
      },
      getMyTicketsData: () => get().MyTicketsData,
      setColorMode: (color: string) =>
        set((state) => {
          const themeColors = color;
          if (themeColors) state.ThemesColor = themeColors;
        }),
    })),
    // {
    //   name: "SettingsCollection-storage",
    //   getStorage: () => localStorage, // by default
    // }
  // )
);
