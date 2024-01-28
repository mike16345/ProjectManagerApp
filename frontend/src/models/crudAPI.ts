export interface CrudApi {
  addRequest: (row: any) => Promise<unknown>;
  EditRequest: (row: any) => Promise<unknown>;
  DeleteRequest: (id: any) => Promise<unknown>;
  BulkAddItemsRequest: (rows: any[]) => Promise<unknown>;
  refreshData: () => void;
}
