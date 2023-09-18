import ContextService from "./ContextService";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions,
  HttpClient,
  HttpClientResponse,
} from "@microsoft/sp-http";
export default class PropsUser {
 
  private static urole: string;
  private static upermission: string;
  private static uSupTeam:string;
  private static uAgentTeam:string;
  public static Init(
    urole:string,
    upermission :string,
    uSupTeam:string,
    uAgentTeam:string,
  ) {
   
    this.upermission=upermission;
    this.urole=urole;
    this.uSupTeam=uSupTeam;
    this.uAgentTeam=uAgentTeam;
  }  
 
 
  public static GetUPermission() {
    return this.upermission;
  }
  public static GetURole() {
    return this.urole;
  }
  public static GetUSupTeam() {
    return this.uSupTeam;
  }
  public static GetUAgentTeam() {
    return this.uAgentTeam;
  }
 
}
