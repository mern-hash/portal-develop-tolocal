//SECTION - Imports
//ANCHOR - Core
import { format, isValid } from "date-fns";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../institution.scss";
//ANCHOR - Api
import { deleteStudent, getStudents, resendCredentialEmail } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
//ANCHOR - Components
import { EmptyPage, ErrorPage, Table } from "@/components/features";
import { HeaderButton } from "@/components/ui";
import { Loading, Pagination } from "carbon-components-react";
//ANCHOR - Table stuff
import {
  configDateForFilter,
  confirmModal,
  deleteModal,
  onSortTable,
  toastNotification,
} from "@/shared/table-data/tableMethods";
//ANCHOR - Util
import { Square } from "@/assets/icons";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { deleteMsg, formatDateWithoutTimezone, pluralize } from "@/shared/util";
import { Edit, TrashCan } from "@carbon/icons-react";
//ANCHOR - Constants
import {
  ADD_STUDENTS_DROPDOWN_TEXT,
  TABLE_ORDER,
  TABLE_ORDER_BY,
  TABLE_PAGE_SIZES,
  TOAST_NOTIFICATION_KINDS,
  TOAST_NOTIFICATION_TITLES,
} from "@/core/constants";
import { errorMessages } from "@/shared/errorText";
import {
  clearModal,
  clearTabs,
  institutionStudentsHLC,
} from "@/shared/outlet-context/outletContext";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
import { successMessages } from "@/shared/successText";
import { ITableDefaults } from "@/shared/types";
//!SECTION

const InstitutionStudents: FunctionComponent = (): ReactElement => {
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
  const [itemsFetched, setItemsFetched] = useState<any>([]);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  const [deletedItemsCount, setDeletedItemsCount] = useState<number>(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //ANCHOR - useEffect outlet
  useEffect(() => {
    updateContext(ContextTypes.HLC, institutionStudentsHLC(navigate));
    updateContext(ContextTypes.TABS, clearTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SECTION - query
  //ANCHOR - get all
  const allStudents = useInfiniteQuery(
    [
      "allStudents",
      { ...tableInfo, term: tableInfo.term ? tableInfo.term : undefined },
    ],
    getStudents,
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

  //ANCHOR - delete one
  const deleteStudentEntry = useMutation((data: any) => deleteStudent(data), {
    ...forDeletingTableData({
      refetch: () =>
        queryClient.invalidateQueries({
          queryKey: ["allStudents", { ...tableInfo }],
        }),
      updateContext,
      entity: deleteMsg(deletedItemsCount, "Student"),
      setCount: setDeletedItemsCount,
    }),
  });

  const resendCredential = useMutation(
    (data: string) => resendCredentialEmail(data),
    {
      onSuccess: () => {
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.SUCCESS,
          kind: TOAST_NOTIFICATION_KINDS.SUCCESS,
          subtitle: successMessages.email_sent,
        });
      },
      onError: () => {
        toastNotification({
          updateContext,
          title: TOAST_NOTIFICATION_TITLES.ERROR,
          kind: TOAST_NOTIFICATION_KINDS.ERROR,
          subtitle: errorMessages.try_again,
        });
      },
      onSettled: () => {
        //@ts-ignore
        updateContext(ContextTypes.MODAL, clearModal);
      },
    }
  );

  //!SECTION

  //ANCHOR batch action
  const batchSelectionAction = (data) => {
    setDeletedItemsCount(data.length);
    deleteModal(
      updateContext,
      pluralize(data, `Delete ${data?.length} item`),
      `${pluralize(
        data,
        `Are you sure you want to delete ${data?.length} item`
      )}?`,
      () => deleteStudentEntry.mutate(data)
    );
  };

  const onResendEmail = (data) => {
    confirmModal(
      updateContext,
      "Resend email?",
      "Are you sure you want to resend the email?",
      () => {
        resendCredential.mutate(data);
      }
    );
  };

  //ANCHOR tableCTA
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
          `Delete ${cellData.firstName} ${cellData.lastName}`,
          `Are you sure you want to delete ${cellData.firstName} ${cellData.lastName}?`,
          () => deleteStudentEntry.mutate([cellData])
        ),
    },
  ];

  //ANCHOR date filter
  const onFilterByDate = (val) => {
    const { pageSize, orderBy, order, term } = tableInfo;
    // Required for default state, for reseting the filter
    const filterParams = { page: 1, pageSize, orderBy, order, term };

    for (let obj in val) {
      if (obj === "date") {
        filterParams["from"] = configDateForFilter(val[obj], 0);
        filterParams["to"] = configDateForFilter(val[obj], 1);
      } else if (obj.startsWith("fields.")) {
        // Custom fields will have the form of fields.someDate and will be sent as
        // someDate[from] and someDate[to], so we slice away the fields. and repeat the
        // logic above
        filterParams[`${obj.replace("fields.", "")}[from]`] =
          configDateForFilter(val[obj], 0);
        filterParams[`${obj.replace("fields.", "")}[to]`] = configDateForFilter(
          val[obj],
          1
        );
      }
    }

    setTableInfo({
      ...filterParams,
    });
  };

  //ANCHOR - items list
  const renderFetchedStudents = () => {
    const destroy = (items) => {
      let x: any = {};
      for (let key in items) {
        x[`fields.${key}`] = isValid(items[key])
          ? format(
              formatDateWithoutTimezone(new Date(items[key])),
              "LL/dd/yyyy"
            )
          : items[key];
      }
      return x;
    };

    const fixName = (arr) =>
      // "firstName lastName" should be displayed as "name" in table
      arr.map((i) => ({
        ...i,
        name: `${i.firstName} ${i.lastName}`,
        ...destroy(i["fields"]),
      }));

    // if loading and some items already fetched (visible), display them
    return allStudents.isLoading
      ? itemsFetched.length
        ? fixName(itemsFetched)
        : []
      : // else, display new ones
        fixName(allStudents.data?.pages[0].data);
  };

  const configHeadersForTable = () => [
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
      header: "Email",
      key: "email",
      isSortable: false,
    },
    {
      header: "Resend email",
      key: "resend_email",
      isSortable: false,
    },
  ];
  //ANCHOR - isEmptyPage
  const isEmptyPage = () => {
    const notFilteredByDate = () => {
      for (let key in tableInfo) {
        if (key.includes("from") || key.includes("to")) {
          return false;
        }
      }
      return true;
    };
    // If there is no new fetched data
    return (
      !allStudents.data?.pages[0].data?.length &&
      // There is no previously fetched data (sorting works better with this)
      !itemsFetched?.length &&
      // Wasn't searched for anything (empty search req should display
      // "Create new institution" page)
      !tableInfo.term &&
      notFilteredByDate()
    );
  };

  //ANCHOR - Date fields
  const configDateFilterFields = () => {
    const fields = [
      {
        id: "date",
        label_from: "Date created from",
        label_to: "Date created to",
      },
    ];
    return fields;
  };

  //SECTION - render()
  //ANCHOR - error
  if (allStudents.isError) return <ErrorPage title="Institutions" />;

  //ANCHOR - loading
  if (allStudents.isLoading) {
    return (
      <div className="institution-students__loader">
        <Loading withOverlay={false} />
      </div>
    );
  }

  //ANCHOR - empty
  if (isEmptyPage()) {
    return (
      <>
        <Helmet>
          <title>Students list</title>
        </Helmet>
        <EmptyPage
          icon={<Square />}
          heading="Start by adding students"
          desc="Before you can create digital certificates, you need to add students first."
          button={
            <HeaderButton
              id="add-student"
              buttonText={ADD_STUDENTS_DROPDOWN_TEXT}
              iconType="add"
              items={[
                {
                  text: "Manually",
                  onClick: () => navigate("create"),
                },
                {
                  text: "Bulk upload",
                  onClick: () => navigate("bulk"),
                },
              ]}
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
        <title>Students</title>
      </Helmet>

      <Table
        batchSelectionAction={batchSelectionAction}
        dateFilter={configDateFilterFields()}
        headerData={configHeadersForTable()}
        initialFetch={initialFetch}
        onFilterByDate={onFilterByDate}
        onSearch={(searchTerm) =>
          setTableInfo({
            ...tableInfo,
            term: searchTerm,
            page: 1,
          })
        }
        rowsData={renderFetchedStudents()}
        sortBy={(term: string, direction: string) =>
          onSortTable({ term, direction, tableInfo, setTableInfo })
        }
        tableColumnActions={tableCTA}
        nameNavigate={(val) => navigate(`edit/${val}`)}
        onResendEmail={(val) => onResendEmail(val)}
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

export default InstitutionStudents;
