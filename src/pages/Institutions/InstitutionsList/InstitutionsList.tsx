//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
//ANCHOR - Carbon
import { Loading, Pagination } from "carbon-components-react";
import { Edit, TrashCan } from "@carbon/icons-react";
//ANCHOR - Api
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteInstitutions, getInstitutions } from "@/api";
//ANCHOR - Components
import { Button } from "@/components/ui";
import { EmptyPage, ErrorPage, Table } from "@/components/features";
//ANCHOR - Table stuff
import {
  deleteModal,
  configDateForFilter,
  onSortTable,
} from "@/shared/table-data/tableMethods";
import { institutionsHeaderData } from "@/shared/table-data/tableHeaders";
//ANCHOR - Util
import { ContextTypes, ContextData } from "@/shared/types/ContextTypes";
import { IInstitutionTableData, ITableDefaults } from "@/shared/types";
import { deleteMsg, pluralize } from "@/shared/util";
import { Sponge } from "@/assets/icons";
import { institutionsListHLC } from "@/shared/outlet-context/outletContext";
//ANCHOR - Constants
import {
  TABLE_ORDER,
  TABLE_ORDER_BY,
  TABLE_PAGE_SIZES,
} from "@/core/constants";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
//!SECTION

/**
 * @description Displays table with institutions and lots of cta-s
 * @param param0
 */
const InstitutionsList: FunctionComponent = (): ReactElement => {
  // <Outlet /> context to update HeaderLayout data
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const [tableInfo, setTableInfo] = useState<ITableDefaults>({
    page: 1,
    pageSize: 10,
    orderBy: TABLE_ORDER_BY.CREATEDAT,
    order: TABLE_ORDER.DEFAULT,
  });
  const [itemCount, setItemCount] = useState<number>();
  // Used to keep displaying current page while fetching next one
  const [itemsFetched, setItemsFetched] = useState<IInstitutionTableData[]>([]);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  const [deletedItemsCount, setDeletedItemsCount] = useState<number>(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //ANCHOR - useEffect outlet
  useEffect(() => {
    updateContext(ContextTypes.HLC, institutionsListHLC(navigate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SECTION - query
  /**
   * ANCHOR get all
   * Fetch all institutions data based on tableInfo params (page, size, order etc.)
   */
  const allInstitutions = useInfiniteQuery(
    [
      "institutions",
      {
        ...tableInfo,
        term: tableInfo.term ? tableInfo.term : undefined,
      },
    ],
    getInstitutions,
    {
      ...forGettingTableData({
        setItemsFetched,
        updateContext,
        setInitialFetch,
        itemCount,
        setItemCount,
      }),
    }
  );

  /**
   * ANCHOR delete one
   * Delete an institution from the table - accessible via TrashCan in each row
   * or by selecting a batch of items and clicking button in toolbar
   * and refetch all institutions to live update the view
   */
  const deleteInstitutionEntry = useMutation(
    (data: IInstitutionTableData[]) => deleteInstitutions(data),
    {
      ...forDeletingTableData({
        refetch: () =>
          queryClient.invalidateQueries({
            queryKey: [
              "institutions",
              {
                ...tableInfo,
              },
            ],
          }),
        updateContext,
        entity: deleteMsg(deletedItemsCount, "Institution"),
        setCount: setDeletedItemsCount,
      }),
    }
  );
  //!SECTION

  /**
   * ANCHOR batch action
   * Modal pop-up for batch selected items, to delete multiple table rows at once
   */
  const batchSelectionAction = (data: IInstitutionTableData[]) => {
    setDeletedItemsCount(data.length);
    deleteModal(
      updateContext,
      pluralize(data, `Delete ${data.length} item`),
      `${pluralize(
        data,
        `Are you sure you want to delete ${data.length} item`
      )}?`,
      () => deleteInstitutionEntry.mutate(data)
    );
  };

  /**
   * ANCHOR tableCTA
   * Last column table row buttons (edit/delete)
   */
  const tableCTA = [
    {
      icon: Edit,
      iconDescription: "Edit",
      onClick: (cellData) => navigate(`edit/${cellData.id}`),
    },
    {
      icon: TrashCan,
      iconDescription: "Delete",
      onClick: (cellData) =>
        deleteModal(
          updateContext,
          `Delete ${cellData.name}`,
          `Are you sure you want to delete ${cellData.name}?`,
          () => deleteInstitutionEntry.mutate([cellData])
        ),
    },
  ];

  /**
   * ANCHOR date filter
   * Carbon's date range retuns array with 2 date string
   * Configuring date for filter takes that value and adds
   * it to it's designated state
   */
  const onFilterByDate = (val: { date: Date[] }) => {
    setTableInfo({
      ...tableInfo,
      page: 1,
      from: configDateForFilter(val["date"], 0),
      to: configDateForFilter(val["date"], 1),
    });
  };

  //ANCHOR - items list
  const renderFetchedInstitutions = () => {
    // if loading and some items already fetched (visible), display them
    return allInstitutions.isLoading
      ? itemsFetched.length
        ? itemsFetched
        : []
      : // else, display new ones
        allInstitutions.data?.pages[0].data;
  };

  //ANCHOR - isEmptyPage
  const isEmptyPage = (): boolean =>
    // If there is no new fetched data
    !allInstitutions.data?.pages[0].data.length &&
    // There is no previously fetched data (sorting works better with this)
    !itemsFetched.length &&
    // Wasn't searched for anything (empty search req should display
    // "Create new institution" page)
    !tableInfo.term &&
    (!tableInfo.from || !tableInfo.to);

  //SECTION - render()
  /**
   * ANCHOR error
   * Render page
   */
  if (allInstitutions.isError) return <ErrorPage title="Institutions" />;

  //ANCHOR - loading
  if (initialFetch && allInstitutions.isLoading)
    return <Loading withOverlay={false} />;

  //ANCHOR - empty
  // If there isn't data and there isn't search term or date filter
  if (isEmptyPage())
    return (
      <>
        <Helmet>
          <title>Institutions</title>
        </Helmet>
        <EmptyPage
          icon={<Sponge />}
          heading="Start by adding institutions"
          desc="Before viewing institutions you need to add some first."
          button={
            <Button
              label="Create institution"
              type="button"
              clickFn={() => navigate("create")}
              icon="add"
              kind="primary"
            />
          }
        />
      </>
    );

  //ANCHOR - table
  // Every other case
  return (
    <>
      <Helmet>
        <title>Institutions</title>
      </Helmet>
      <Table
        batchSelectionAction={batchSelectionAction}
        dateFilter={[
          {
            id: "date",
            label_from: "Date created from",
            label_to: "Date created to",
          },
        ]}
        headerData={institutionsHeaderData}
        initialFetch={initialFetch}
        onFilterByDate={onFilterByDate}
        onSearch={(searchTerm) => {
          setTableInfo({ ...tableInfo, term: searchTerm, page: 1 });
        }}
        rowsData={renderFetchedInstitutions()}
        sortBy={(term: string, direction: string) =>
          onSortTable({ term, direction, tableInfo, setTableInfo })
        }
        tableColumnActions={tableCTA}
        nameNavigate={(val) => navigate(`edit/${val}`)}
      />
      <Pagination
        totalItems={itemCount || 0}
        onChange={({ _, page, pageSize }) =>
          setTableInfo({ ...tableInfo, page, pageSize })
        }
        page={tableInfo.page}
        pageSizes={TABLE_PAGE_SIZES}
      />
    </>
  );
  //!SECTION
};

export default InstitutionsList;
