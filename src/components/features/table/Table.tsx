// Core
import {
  ChangeEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from "react";
import "./table.scss";
import { format } from "date-fns";
// Carbon
import {
  Button,
  DataTable,
  Loading,
  Link,
  Table as CTable,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from "carbon-components-react";
import { Close, SettingsAdjust, TrashCan } from "@carbon/icons-react";
// Util
import { ITable, ITableHeaderItem } from "@/shared/types";
import { debounceEvent } from "@/shared/util";

import DateFilter from "./components/DateFilter";

/**
 * @description - Table component that has couple of "sections":
 * - TableToolbar
 * -- TableBatchActions - hidden header that shows cta buttons for managing selected multiple
 * row items
 * -- TableToolbarContent - input field for searching/filtering, cta button that displays date filter
 * - Table (head, rows) + column with cta buttons for each rows
 * - Pagination components
 * @link https://github.com/weareneopix/certie-fe/blob/1043dd3/src/components/features/table/Table.tsx#L1
 *
 * @interface ```tsx
 * interface ITable {
 *  batchSelectionAction: (data: T) => void;
 *  headerData: {header: string, key: string, is_sortable: boolean};
 *  onSearch: (term: string) => void;
 *  rowsData: T[];
 *  sortBy: string; // 'id', 'createdAt'
 *  tableColumnActions?: {icon: string, iconDescription: string, onClick: (data) => void}
 * }
 * ```
 *
 * @param param0
 */

const Table = <TableItemType,>({
  batchSelectionAction,
  dateFilter,
  headerData,
  initialFetch,
  onFilterByDate,
  onSearch,
  rowsData,
  sortBy,
  tableColumnActions,
  nameNavigate,
  onResendEmail,
}: PropsWithChildren<ITable<TableItemType>>): ReactElement => {
  const [batchSelected, setBatchSelected] = useState<TableItemType[]>([]);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  const onSearchChange = debounceEvent(onSearch, 700);

  // Selecting multiple items - add/remove existing one
  const onSelectBatchItem = (cellItem): void => {
    // Checking if the entire object is included bugs out after sorting/filtering/
    // changing the entire row of elements
    batchSelected.find((i: any) => i.id === cellItem.id)
      ? setBatchSelected(
          batchSelected.filter((el: any) => el.id !== cellItem.id)
        )
      : setBatchSelected([...batchSelected, cellItem]);
  };

  useEffect(() => {
    // Scroll to top of table, not top of page every time
    window.scrollTo(0, 200);
    // Required to check new 10 elements in case of
    // - sorting while having batch selected, which could cause some of the selected items
    // to go off the screen to another page
    // - deleting single institution while batch is selected, which could cause an error in case
    // of deleting a batch selected institution
    setBatchSelected(
      batchSelected.filter((i: any) =>
        rowsData?.find((e: any) => e.id === i.id)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsData]);

  return (
    <section className="datatable">
      <DataTable headers={headerData} rows={rowsData} isSortable>
        {({
          rows,
          headers,
          getBatchActionProps,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getTableContainerProps,
          getTableProps,
          getToolbarProps,
          selectAll,
        }) => {
          const batchActionProps = getBatchActionProps();
          const selectAllFields = () => {
            batchSelected.length
              ? setBatchSelected([])
              : rowsData && setBatchSelected(rowsData);
            selectAll(rows);
          };

          return (
            <TableContainer {...getTableContainerProps()}>
              {dateFilter && onFilterByDate && (
                <DateFilter
                  filterVisible={filterVisible}
                  toggleFilter={() => setFilterVisible(!filterVisible)}
                  dateFilter={dateFilter}
                  onFilterByDate={onFilterByDate}
                />
              )}

              {/** Table toolbar, includes:
               * - TableBatchActions - upon selecting one or all, displays previously
               * hidden header with cta buttons (in this case just delete and cancel)
               * - TableToolbarContent - input field for searching and one that (will)
               * display date filter pop up
               */}
              <TableToolbar {...getToolbarProps()}>
                {batchSelectionAction && (
                  <TableBatchActions
                    {...batchActionProps}
                    onCancel={() => {
                      setBatchSelected([]);
                      selectAll();
                    }}
                  >
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={TrashCan}
                      onClick={() =>
                        batchSelectionAction(batchSelected as TableItemType)
                      }
                    >
                      Delete
                    </TableBatchAction>
                  </TableBatchActions>
                )}
                <TableToolbarContent
                  aria-hidden={batchActionProps.shouldShowBatchActions}
                >
                  <TableToolbarSearch
                    onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                      onSearchChange(evt.currentTarget?.value)
                    }
                    placeholder="Search input text"
                    persistent
                  />
                  {dateFilter && (
                    <Button
                      renderIcon={filterVisible ? Close : SettingsAdjust}
                      iconDescription="Adjust date filter"
                      hasIconOnly
                      kind="ghost"
                      onClick={() => setFilterVisible(!filterVisible)}
                    />
                  )}
                </TableToolbarContent>
              </TableToolbar>

              <CTable {...getTableProps()}>
                {/** Table head, includes: * - TableSelectAll - first column,
                checbox that marks all rows as selected * - TableHeader - th of
                every column, to be "sortable" must have "isSortable" * next to
                header and key */}
                <TableHead className="datatable__thead">
                  <TableRow>
                    {batchSelectionAction && (
                      <TableSelectAll
                        {...getSelectionProps()}
                        onSelect={selectAllFields}
                      />
                    )}
                    {headers.map((header: ITableHeaderItem, i: number) => (
                      <TableHeader
                        key={i}
                        className={
                          header.limit_width ? "datatable__minw" : null
                        }
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                          onClick: (e) => {
                            e.preventDefault();
                            const direction =
                              e.target.parentElement.getAttribute("aria-sort");
                            header.isSortable && sortBy(header.key, direction);
                          },
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                    {/* Renders empty TableHeader for column with action buttons */}
                    {tableColumnActions ? (
                      <TableHeader className="datatable__btns" />
                    ) : undefined}
                  </TableRow>
                </TableHead>
                {/** Table body, includes rows, and each row:
                 * Cell with checkbox, which adds element to batch and toggles batch actions toolbar
                 * Table cells with data
                 * Cell with action buttons, if required object is passed
                 */}
                <TableBody>
                  {/* For first fetch display loading, if search returns empty display text */}
                  {!rows.length && (
                    <TableRow>
                      <TableCell colSpan="50">
                        {initialFetch ? (
                          <Loading withOverlay={false} small={true} />
                        ) : (
                          "No institution matches this search."
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row, i: number) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      {batchSelectionAction && (
                        <TableSelectRow
                          {...getSelectionProps({ row })}
                          onChange={() =>
                            rowsData && onSelectBatchItem(rowsData[i])
                          }
                        />
                      )}
                      {row.cells.map((cell) => {
                        if (cell.info.header === "resend_email") {
                          return (
                            <TableCell
                              key={cell.id}
                              onClick={() =>
                                onResendEmail?.(cell.id.split(":")[0])
                              }
                            >
                              <Link
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                Resend email
                              </Link>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === "name") {
                          return (
                            <TableCell
                              key={cell.id}
                              className={nameNavigate && "datatable__name"}
                              onClick={() =>
                                // cell.id looks like id:name, and we need just id
                                nameNavigate?.(cell.id.split(":")[0])
                              }
                            >
                              {cell.value}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={cell.id}>
                            {cell.info.header === "createdAt"
                              ? format(cell.value, "MM/dd/yyyy")
                              : cell.value}
                          </TableCell>
                        );
                      })}
                      {tableColumnActions ? (
                        <TableCell style={{ textAlign: "right" }}>
                          {tableColumnActions.map((action, j) => (
                            <Button
                              key={j}
                              renderIcon={action.icon}
                              iconDescription={action.iconDescription}
                              onClick={() =>
                                rowsData && action.onClick(rowsData[i])
                              }
                              hasIconOnly={true}
                              kind="ghost"
                              size="sm"
                              tooltipAlignment="end"
                            />
                          ))}
                        </TableCell>
                      ) : undefined}
                    </TableRow>
                  ))}
                </TableBody>
              </CTable>
            </TableContainer>
          );
        }}
      </DataTable>
    </section>
  );
};

export default Table;
