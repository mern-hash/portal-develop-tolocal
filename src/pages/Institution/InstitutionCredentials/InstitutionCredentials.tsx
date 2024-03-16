//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../institution.scss";
//ANCHOR - Api
//ANCHOR - Components
import { EmptyPage } from "@/components/features";
import { Button } from "@/components/ui";
//ANCHOR - Table stuff
//ANCHOR - Util
import { Square } from "@/assets/icons";
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
//ANCHOR - Constants
import {
  ADD_CREDENTIALS_DROPDOWN_TEXT,
  ADD_STUDENTS_DROPDOWN_TEXT,
} from "@/core/constants";
import {
  clearTabs,
  institutionCredentialsHLC,
} from "@/shared/outlet-context/outletContext";
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
