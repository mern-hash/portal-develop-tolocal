//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { integrationsListHLC } from "@/shared/outlet-context/outletContext";
import { Helmet } from "react-helmet-async";
//ANCHOR - API
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getIntegrations, deleteIntegration } from "@/api";
//ANCHOR - Carbon
import { TrashCan } from "@carbon/icons-react";
import { Loading, Pagination } from "carbon-components-react";
//ANCHOR - Components
import { EmptyPage, ErrorPage, Table } from "@/components/features";
import { Button } from "@/components/ui";
//ANCHOR - Utils
import { ContextData, ContextTypes } from "@/shared/types/ContextTypes";
import { IIntegrationTableData, ITableDefaults } from "@/shared/types";
import {
  TABLE_ORDER,
  TABLE_ORDER_BY,
  TABLE_PAGE_SIZES,
} from "@/core/constants";
import { forDeletingTableData } from "@/shared/query-setup/forDeletingTableData";
import { deleteMsg } from "@/shared/util";
import { Sponge } from "@/assets/icons";
import { integrationsHeaderData } from "@/shared/table-data/tableHeaders";
import { deleteModal, onSortTable } from "@/shared/table-data/tableMethods";
import { forGettingTableData } from "@/shared/query-setup/forGettingTableData";
//!SECTION

const IntegrationsList: FunctionComponent = (): ReactElement => {
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
  const [itemsFetched, setItemsFetched] = useState<IIntegrationTableData[]>([]);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    updateContext(ContextTypes.HLC, integrationsListHLC(navigate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SECTION - API
  const allIntegrations = useInfiniteQuery(
    [
      "integrations",
      {
        ...tableInfo,
        term: tableInfo.term ? tableInfo.term : undefined,
      },
    ],
    getIntegrations,
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

  const deleteIntegrationEntry = useMutation(
    (data: string) => deleteIntegration(data),
    {
      ...forDeletingTableData({
        refetch: () =>
          queryClient.invalidateQueries({
            queryKey: [
              "integrations",
              {
                ...tableInfo,
              },
            ],
          }),
        updateContext,
        entity: deleteMsg(1, "Integration"),
      }),
    }
  );
  //!SECTION

  //ANCHOR - Table CTA
  const tableCTA = [
    {
      icon: TrashCan,
      iconDescription: "Delete",
      onClick: (cellData) =>
        deleteModal(
          updateContext,
          `Delete ${cellData.name}`,
          `Are you sure you want to delete ${cellData.name}?`,
          () => deleteIntegrationEntry.mutate(cellData.id)
        ),
    },
  ];

  const renderFetchedIntegrations = () => {
    if (!allIntegrations.isLoading) return allIntegrations.data?.pages[0].data;
    return itemsFetched.length ? itemsFetched : [];
  };

  const isEmptyPage = (): boolean =>
    !allIntegrations.data?.pages[0]?.data.length &&
    !itemsFetched.length &&
    !tableInfo.term;

  if (allIntegrations.isError) return <ErrorPage title="Integrations" />;

  if (initialFetch && allIntegrations.isLoading)
    return <Loading withOverlay={false} />;

  if (isEmptyPage())
    return (
      <>
        <Helmet>
          <title>Integrations</title>
        </Helmet>
        <EmptyPage
          icon={<Sponge />}
          heading="Start by adding integrations"
          desc="Before viewing integrations you need to add some first."
          button={
            <Button
              label="Create integration"
              type="button"
              clickFn={() => navigate("create")}
              icon="add"
              kind="primary"
            />
          }
        />
      </>
    );

  return (
    <>
      <Helmet>
        <title>Integrations</title>
      </Helmet>
      <Table
        headerData={integrationsHeaderData}
        initialFetch={initialFetch}
        onSearch={(searchTerm) =>
          setTableInfo({ ...tableInfo, term: searchTerm, page: 1 })
        }
        rowsData={renderFetchedIntegrations()}
        sortBy={(term: string, direction: string) =>
          onSortTable({ term, direction, tableInfo, setTableInfo })
        }
        tableColumnActions={tableCTA}
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

export default IntegrationsList;
