//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
//ANCHOR - Carbon
import { Loading, Pagination } from "carbon-components-react";
//ANCHOR - Api
import { deleteInstitutions } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
//ANCHOR - Components
import { EmptyPage, ErrorPage, Table } from "@/components/features";
import { Button } from "@/components/ui";
//ANCHOR - Table stuff
import { fieldHeaderData } from "@/shared/table-data/tableHeaders";
import {
  configDateForFilter,
  deleteModal,
  onSortTable,
} from "@/shared/table-data/tableMethods";
//ANCHOR - Util
import { Sponge } from "@/assets/icons";
import { fieldsListHLC } from "@/shared/outlet-context/outletContext";
import { IInstitutionTableData, ITableDefaults } from "@/shared/types";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { deleteMsg, pluralize } from "@/shared/util";
//ANCHOR - Constants
import { fetchFields } from "@/api/fields/fields";
import {
  TABLE_ORDER,
  TABLE_ORDER_BY,
  TABLE_PAGE_SIZES,
} from "@/core/constants";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
//!SECTION

/**
 * @description Displays table with institutions and lots of cta-s
 * @param param0
 */
const FieldList: FunctionComponent = (): ReactElement => {
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
    updateContext(ContextTypes.HLC, fieldsListHLC(navigate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SECTION - query
  /**
   * ANCHOR get all
   * Fetch all institutions data based on tableInfo params (page, size, order etc.)
   */
  const allInstitutions = useInfiniteQuery(
    [
      "fields",
      {
        ...tableInfo,
        term: tableInfo.term ? tableInfo.term : undefined,
      },
    ],
    fetchFields,
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
    setDeletedItemsCount(data?.length);
    deleteModal(
      updateContext,
      pluralize(data, `Delete ${data?.length} item`),
      `${pluralize(
        data,
        `Are you sure you want to delete ${data?.length} item`
      )}?`,
      () => deleteInstitutionEntry.mutate(data)
    );
  };

  /**
   * ANCHOR tableCTA
   * Last column table row buttons (edit/delete)
   */
  // const tableCTA = [
  //   {
  //     icon: Edit,
  //     iconDescription: "Edit",
  //     onClick: (cellData) => navigate(`edit/${cellData.id}`),
  //   },
  //   {
  //     icon: TrashCan,
  //     iconDescription: "Delete",
  //     onClick: (cellData) =>
  //       deleteModal(
  //         updateContext,
  //         `Delete ${cellData.name}`,
  //         `Are you sure you want to delete ${cellData.name}?`,
  //         () => deleteInstitutionEntry.mutate([cellData])
  //       ),
  //   },
  // ];

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
      ? itemsFetched?.length
        ? itemsFetched
        : []
      : // else, display new ones
        allInstitutions.data?.pages[0][0]?.data;
  };
  //ANCHOR - isEmptyPage
  const isEmptyPage = (): boolean =>
    // If there is no new fetched data

    !allInstitutions.data?.pages[0][0]?.data?.length &&
    // There is no previously fetched data (sorting works better with this)
    !itemsFetched?.length &&
    // Wasn't searched for anything (empty search req should display
    // "Create new institution" page)
    !tableInfo.term &&
    (!tableInfo.from || !tableInfo.to);

  //SECTION - render()
  /**
   * ANCHOR error
   * Render page
   */
  if (allInstitutions.isError) return <ErrorPage title="Fields" />;

  //ANCHOR - loading
  if (initialFetch && allInstitutions.isLoading)
    return <Loading withOverlay={false} />;
  //ANCHOR - empty
  // If there isn't data and there isn't search term or date filter
  if (allInstitutions.data?.pages[0][0]?.data?.length < 1 || isEmptyPage())
    return (
      <>
        <Helmet>
          <title>Institutions</title>
        </Helmet>
        <EmptyPage
          icon={<Sponge />}
          heading="Start building your template"
          desc="You can build a template for credentials that issuers and verifiers use. A credential template allows you to define the structure and the attributes included in the credentials."
          button={
            <Button
              label="Build a temnplate"
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
        headerData={fieldHeaderData}
        initialFetch={initialFetch}
        onFilterByDate={onFilterByDate}
        onSearch={(searchTerm) => {
          setTableInfo({ ...tableInfo, term: searchTerm, page: 1 });
        }}
        rowsData={renderFetchedInstitutions()}
        sortBy={(term: string, direction: string) =>
          onSortTable({ term, direction, tableInfo, setTableInfo })
        }
        // tableColumnActions={tableCTA}
        nameNavigate={(val) => {
          // navigate(`edit/${val}`)
        }}
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

export default FieldList;
