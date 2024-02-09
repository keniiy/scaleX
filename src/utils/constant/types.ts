import { ADMIN, USER } from './options';

export interface RequestWithUser extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export interface PaginationResult {
  data: any[];
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
