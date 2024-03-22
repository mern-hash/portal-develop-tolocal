export interface ITableHeaderItem {
  header: string;
  key: string;
  isSortable?: boolean;
  limit_width?: any;
}

export interface ITableColumnCta {
  icon: string;
  iconDescription: string;
  onClick: (data) => void;
}

export interface ITable<TableItemType> {
  batchSelectionAction?: (data: TableItemType) => void;
  dateFilter?: {
    id: string;
    label_from: string;
    label_to: string;
  }[];
  headerData: ITableHeaderItem[];
  initialFetch: boolean;
  onFilterByDate?: (val) => void;
  onSearch: (term: string) => void;
  rowsData?: TableItemType[];
  sortBy: (term: string, direction: string) => void;
  tableColumnActions?: ITableColumnCta[];
  nameNavigate?: (val: string) => void;
  onResendEmail?: (val: string) => void;
}

// Institutions
export interface IInstitutionTableData {
  id: string;
  name: string;
  creation_date: string;
  admin_email: string;
  no_of_students: number;
  no_of_credentials_issued: number;
  no_of_verifications: number;
  table_actions?: ITableColumnCta[];
}

export interface IIntegrationTableData {
  allowRevoked: boolean;
  createdAt: number;
  email: string;
  id: string;
  name: string;
  updatedAt: number;
}

export interface ITableDefaults {
  page: number;
  pageSize: number;
  orderBy: string;
  order: string;
  term?: string;
  from?: string;
  to?: string;
  //specific uses
  completionDateFrom?: string;
  completionDateTo?: string;
}

export interface ITemplateTableData {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  credential_count: number;
}
