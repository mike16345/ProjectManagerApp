export interface CrudApi {
  addRequest: (item: any) => Promise<unknown>;
  editRequest: (item: any) => Promise<unknown>;
  deleteRequest: (id: any) => Promise<unknown>;
  bulkAddItemsRequest: (rows: any[]) => Promise<unknown>;
  refreshData: () => void;
}
