//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import "../institution.scss";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, isValid } from "date-fns";
//ANCHOR - Api
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteStudent,
  getStudents,
  getInstitutionTableFields,
  resendCredentialEmail,
} from "@/api";
//ANCHOR - Components
import { HeaderButton } from "@/components/ui";
import { EmptyPage, ErrorPage, Table } from "@/components/features";
import { Loading, Pagination } from "carbon-components-react";
//ANCHOR - Table stuff
import {
  configDateForFilter,
  deleteModal,
  confirmModal,
  onSortTable,
  toastNotification,
} from "@/shared/table-data/tableMethods";
//ANCHOR - Util
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { deleteMsg, pluralize, formatDateWithoutTimezone } from "@/shared/util";
import { Square } from "@/assets/icons";
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
import {
  clearTabs,
  institutionCredentialsHLC,
  institutionStudentsHLC,
} from "@/shared/outlet-context/outletContext";
import { ITableDefaults } from "@/shared/types";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
import { clearModal } from "@/shared/outlet-context/outletContext";
import { errorMessages } from "@/shared/errorText";
import { successMessages } from "@/shared/successText";
//!SECTION

const InstitutionCredentials: FunctionComponent = (): ReactElement => {
  const { updateContext } = useOutletContext<{
    updateContext: (state: string, data: ContextData) => void;
  }>();

  const navigate = useNavigate();

  //ANCHOR - useEffect outlet
  useEffect(() => {
    updateContext(ContextTypes.HLC, institutionCredentialsHLC(navigate));
    updateContext(ContextTypes.TABS, clearTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SECTION - query
  //ANCHOR - get all

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

  //ANCHOR - empty
  if (true) {
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
        <title>Credentials list</title>
      </Helmet>
      {/* {!institutionTableFields.isLoading && (
        <Table
          batchSelectionAction={batchSelectionAction}
          dateFilter={configDateFilterFields()}
          headerData={configHeadersForTable(institutionTableFields.data)}
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
      )}
      <Pagination
        totalItems={itemCount || 0}
        onChange={({ _, page, pageSize }) =>
          setTableInfo({ ...tableInfo, page, pageSize })
        }
        page={tableInfo.page}
        pageSizes={TABLE_PAGE_SIZES}
      /> */}
    </>
  );
};

export default InstitutionCredentials;
