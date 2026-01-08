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
    // NEW QUERIES
    getDriverById: builder.query<any, number>({
      query: (id) => ({ url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}`, method: 'GET' }),
    }),
    getDriverLicense: builder.query<any, number>({
      query: (id) => ({ url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/license`, method: 'GET' }),
    }),
    getDriverTags: builder.query<any, number>({
      query: (id) => ({ url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/tags`, method: 'GET' }),
    }),
    getDeletedDrivers: builder.query<any, void>({
      query: () => ({ url: API_ENDPOINTS.DRIVERS.GET_DELETED, method: 'GET' }),
    }),
    getDriverVehicleHistory: builder.query<any, number>({
      query: (id) => ({ url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/driver-vehicle-history`, method: 'GET' }),
    }),
    getDriverScoringGroup: builder.query<any, void>({
      query: () => ({ url: API_ENDPOINTS.DRIVERS.GET_SCORING_GROUP, method: 'GET' }),
    }),

    // NEW MUTATIONS
    createDriver: builder.mutation<any, any>({
      query: (payload) => ({
        url: API_ENDPOINTS.DRIVERS.CREATE_DRIVER,
        method: 'POST',
        body: payload,
      }),
    }),
    updateDriver: builder.mutation<any, { id: number; payload: any }>({
      query: ({ id, payload }) => ({
        url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),
    deleteDriver: builder.mutation<any, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}`,
        method: 'DELETE',
      }),
    }),
    undeleteDriver: builder.mutation<any, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/undelete-driver`,
        method: 'PUT',
      }),
    }),
    assignVehicle: builder.mutation<any, { id: number; payload: any }>({
      query: ({ id, payload }) => ({
        url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/assign-vehicle`,
        method: 'PUT',
        body: payload,
      }),
    }),
    assignTag: builder.mutation<any, { id: number; payload: any }>({
      query: ({ id, payload }) => ({
        url: `${API_ENDPOINTS.DRIVERS.BASE}/${id}/assign-tag`,
        method: 'PUT',
        body: payload,
      }),
    }),
    deleteAssignedVehicle: builder.mutation<any, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVERS.DELETE_ASSIGNED_VEHICLE}/${id}`,
        method: 'DELETE'
      })
    }),
    createDriverScoringGroup: builder.mutation<any, any>({
      query: (payload) => ({
        url: API_ENDPOINTS.DRIVERS.CREATE_SCORING_GROUP,
        method: 'POST',
        body: payload,
      }),
    }),
    updateDriverScoringGroup: builder.mutation<any, any>({
      query: (payload) => ({
        url: API_ENDPOINTS.DRIVERS.UPDATE_SCORING_GROUP,
        method: 'PUT',
        body: payload,
      }),
    }),
    deleteDriverScoringGroup: builder.mutation<any, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVERS.DELETE_SCORING_GROUP}/${id}`,
        method: 'DELETE'
      })
    })

  }),
  overrideExisting: false
});

export const {
  useGetAllDriversQuery,
  useGetPagedDriversQuery,
  useGetDriverByIdQuery,
  useGetDriverLicenseQuery,
  useGetDriverTagsQuery,
  useGetDeletedDriversQuery,
  useGetDriverVehicleHistoryQuery,
  useGetDriverScoringGroupQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useUndeleteDriverMutation,
  useAssignVehicleMutation,
  useAssignTagMutation,
  useDeleteAssignedVehicleMutation,
  useCreateDriverScoringGroupMutation,
  useUpdateDriverScoringGroupMutation,
  useDeleteDriverScoringGroupMutation
} = driversApi;


