import http from 'service/http';
import type {
  InventoryFilters,
  IInventoryPaginationResponse,
} from '../../../domain/models/InventoryModel';

export const getInventories = async (
  filters: InventoryFilters
): Promise<IInventoryPaginationResponse> => {
  const response = (await http.get('/inventories', {
    params: filters,
  })) as unknown;

  if (typeof response !== 'object' || response === null) {
    throw new Error('Respons daftar inventaris tidak valid.');
  }

  const payload = response as Record<string, unknown>;
  const nestedPayload =
    typeof payload.data === 'object' &&
    payload.data !== null &&
    !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : payload;
  const inventories = Array.isArray(payload.inventories)
    ? payload.inventories
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(nestedPayload.inventories)
        ? nestedPayload.inventories
        : [];
  const page = nestedPayload.page ?? payload.page;

  return { inventories, page } as IInventoryPaginationResponse;
};
