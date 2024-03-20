//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../institution.scss";
//ANCHOR - Api
//ANCHOR - Components
import { EmptyPage, ErrorPage, Table } from "@/components/features";
import { Button } from "@/components/ui";
//ANCHOR - Table stuff
//ANCHOR - Util
import { Square } from "@/assets/icons";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
//ANCHOR - Constants
import {
  ADD_CREDENTIALS_DROPDOWN_TEXT,
  TABLE_ORDER,
  TABLE_ORDER_BY,
  TABLE_PAGE_SIZES,
} from "@/core/constants";
import {
  clearTabs,
  institutionCredentialsHLC,
} from "@/shared/outlet-context/outletContext";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ITableDefaults, ITableHeaderItem } from "@/shared/types";
import { deleteInstitutions, getStudents } from "@/api";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
import { Edit, TrashCan } from "@carbon/icons-react";
import {
  configDateForFilter,
  deleteModal,
  onSortTable,
} from "@/shared/table-data/tableMethods";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
import { deleteMsg, pluralize } from "@/shared/util";
import { Loading, Pagination } from "carbon-components-react";
import { getCredentials } from "@/api/credentials/credential";

//!SECTION

const templateHeaderData: ITableHeaderItem[] = [
  {
    header: "Name",
    key: "name",
    isSortable: false,
  },
  {
    header: "Date Created",
    key: "createdAt",
    isSortable: true,
  },
  {
    header: "Student name",
    key: "studentName",
    isSortable: false,
  },
  {
    header: "Student email",
    key: "studentEmail",
    isSortable: false,
  },
];

const InstitutionCredentials: FunctionComponent = (): ReactElement => {
  const [tableInfo, setTableInfo] = useState<ITableDefaults>({
    page: 1,
    pageSize: 10,
    orderBy: TABLE_ORDER_BY.CREATEDAT,
    order: TABLE_ORDER.DEFAULT,
  });
  const [itemCount, setItemCount] = useState<number>();
  const [itemsFetched, setItemsFetched] = useState<any>([]);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  const [deletedItemsCount, setDeletedItemsCount] = useState<number>(0);
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allCredentials = useInfiniteQuery(
    [
      "allCredential",
      { ...tableInfo, term: tableInfo.term ? tableInfo.term : undefined },
    ],
    getCredentials,
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

  const deleteInstitutionEntry = useMutation(
    (data: any) => deleteInstitutions(data),
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

  //ANCHOR - useEffect outlet
  useEffect(() => {
    updateContext(ContextTypes.HLC, institutionCredentialsHLC(navigate));
    updateContext(ContextTypes.TABS, clearTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableCTA = [
    // {
    //   icon: Edit,
    //   iconDescription: "Edit",
    //   onClick: (cellData) => navigate(`edit/${cellData.id}`),
    // },
    {
      icon: TrashCan,
      iconDescription: "Delete",
      onClick: (cellData) =>
        deleteModal(
          updateContext,
          `Delete ${cellData.firstName} ${cellData.lastName}`,
          `Are you sure you want to delete ${cellData.firstName} ${cellData.lastName}?`,
          () => {
            // deleteStudentEntry.mutate([cellData])
          }
        ),
    },
  ];
  //SECTION - render()
  //ANCHOR - error
  // if (allStudents.isError) return <ErrorPage title="Institutions" />;

  //ANCHOR - loading
  // if (initialFetch && allStudents.isLoading) {
  //   return (
  //     <div className="institution-students__loader">
  //       <Loading withOverlay={false} />
  //     </div>
  //   );
  // }

  const batchSelectionAction = (data: any) => {
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
  const renderFetchedCredentials = () => {
    // if loading and some items already fetched (visible), display them
    return allCredentials.isLoading
      ? itemsFetched.length
        ? itemsFetched.map((item) => ({
            ...item,
            studentName: item?.user?.name,
            studentEmail: item?.user?.email,
            user: null,
          }))
        : []
      : // else, display new ones
        allCredentials.data?.pages[0].data.map((item) => ({
          ...item,
          studentName: item?.user?.name,
          studentEmail: item?.user?.email,
          user: null,
        }));
  };

  const isEmptyPage = (): boolean =>
    // If there is no new fetched data
    !allCredentials.data?.pages[0].data.length &&
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
  if (allCredentials.isError) return <ErrorPage title="Credentials" />;

  //ANCHOR - loading
  if (initialFetch && allCredentials.isLoading)
    return <Loading withOverlay={false} />;

  //ANCHOR - empty
  if (isEmptyPage()) {
    return (
      <>
        <Helmet>
          <title>Credentials list</title>
        </Helmet>
        <EmptyPage
          icon={<Square />}
          heading="Start by adding credentials"
          desc="Your credentials will be linked to a student and selected template."
          button={
            <Button
              label={ADD_CREDENTIALS_DROPDOWN_TEXT}
              icon="add"
              type="button"
              clickFn={() => navigate("create")}
              kind="primary"
            />
          }
        />
      </>
    );
  }

  //ANCHOR - table
  return (
    <>
      <Helmet>
        <title>Credentials list</title>
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
        headerData={templateHeaderData}
        initialFetch={initialFetch}
        onFilterByDate={onFilterByDate}
        onSearch={(searchTerm) =>
          setTableInfo({
            ...tableInfo,
            term: searchTerm,
            page: 1,
          })
        }
        rowsData={renderFetchedCredentials()}
        sortBy={(term: string, direction: string) =>
          onSortTable({ term, direction, tableInfo, setTableInfo })
        }
        tableColumnActions={tableCTA}
        // onResendEmail={(val) => onResendEmail(val)}
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
};

export default InstitutionCredentials;
