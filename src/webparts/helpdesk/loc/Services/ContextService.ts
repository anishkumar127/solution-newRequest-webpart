import {
    HttpClient,
    SPHttpClient,
    MSGraphClientFactory,
  } from "@microsoft/sp-http";
  export default class ContextService {
    private static httpClient: HttpClient;
    private static spClient: SPHttpClient;
    private static graphClient: MSGraphClientFactory;
    private static url: string;
    private static currentUser: any;
    private static currentUserId: number;
    private static context: any;
    private static siteId: string;
    private static tenantId:string;
    static pageContext: any;
    public static Init(
      spClient: SPHttpClient,
      httpClient: HttpClient,
      graphClient: MSGraphClientFactory,
      url: string,
      currentUser: any,
      currentUserId: number,
      context: any,
      siteId: string,
      tenantId:string,
    ) {
      this.spClient = spClient;
      this.httpClient = httpClient;
      this.graphClient = graphClient;
      this.url = url;
      this.currentUser = currentUser;
      this.currentUserId = currentUserId;
      this.context = context;
      this.siteId = siteId;
      this.tenantId = tenantId;

    }
    public static GetAdminUrl() {
      return (
        this.url
          .replace(".sharepoint.com", "-admin.sharepoint.com")
          .split(".com")[0] + ".com"
      );
    }
    public static GetFullContext() {
      return this.context;
    }
    public static GetHttpContext() {
      return this.httpClient;
    }
    public static GetSPContext() {
      return this.spClient;
    }
    public static GetGraphContext() {
      return this.graphClient;
    }
    public static GetUrl(): string {
      return this.url;
    }
    public static GetCurrentUser(): any {
      return this.currentUser;
    }
    public static GetCurentUserId(): number {
      return this.currentUserId;
    }
    public static GetSiteId(): string {
      return this.siteId;
    }
    public static GetTenantId(): string {
      return this.tenantId;
    }
    public static async Get(url: string): Promise<any> {
      var response = await this.httpClient.get(url, HttpClient.configurations.v1);
      return await response.json();
    }
  }
  