import { api } from "./api";
import { API_ENDPOINTS } from "./constants";

export interface GetAllDriverResponse {
  id: number;
  name: string;
  cpr: string;
  phone: string;
  vehicle_name: string;
  employee_id: string;
  created_on: string;
  rfid: string;
  road: string;
  block: string;
  building: string;
  area: string;
  email: string;
  department_id: number | null;
  department: string;
  start_date: string | null;
  end_date: string | null;
}

export interface GetPagedDriversResponse {
  items: GetAllDriverResponse[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export interface GetPagedDriversParams {
  pageIndex: number;
  pageSize: number;
  searchText?: string;
}


export const driversApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query<GetAllDriverResponse[], void>({
      query: () => ({
        url: API_ENDPOINTS.DRIVERS.BASE,
        method: "GET",
      }), 
    }),
    getPagedDrivers: builder.query<GetPagedDriversResponse, GetPagedDriversParams>({
      query: ({ pageIndex, pageSize, searchText }) => ({
        url: API_ENDPOINTS.DRIVERS.GET_PAGED,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          searchText,
        },
      }),
    }),
  }),
  overrideExisting: false
});

export const { useGetAllDriversQuery, useGetPagedDriversQuery } = driversApi;


