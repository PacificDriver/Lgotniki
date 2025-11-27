import React from 'react'

import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import {
  Panel,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../../../components/BaseUI/Tabs'
import AppPage from '../../../components/CustomUI/AppPage'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'
import Money from '../../../components/CustomUI/Money'

export default function Tables() {
  const columns = [
    { name: 'Name', dataType: 'text' },
    { name: 'Price', dataType: 'between' },
    { name: 'Quantity', dataType: 'between' },
  ]

  const data = [
    { id: 1, name: 'Chocolate Vanilla Cake', price: 49.9, quantity: 12 },
    { id: 2, name: 'Passion Fruit Juice', price: 9.2, quantity: 38 },
    { id: 3, name: 'Apple Pie with Granola', price: 59.9, quantity: 21 },
    { id: 4, name: 'Shrimp Risotto', price: 119.9, quantity: 28 },
  ]

  return (
    <AppPage title="Table and Pagination">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <ComponentInfo title="Default">
              <Description>
                <p>This is standard progress.</p>
              </Description>

              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-one"
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>

              <Snippet>
                {`
                                    import React from 'react';

                                    import { Table, Tr, Td } from "../../../components/BaseUI/Table";

                                    const TableDefaultExample = () => {
                                         const columns = [
                                            { name: "Name", dataType: 'text'},
                                            { name: "Price", dataType: 'between'},
                                            { name: "Quantity", dataType: 'between'},
                                        ];

                                        const data = [
                                            { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                                            { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                                            { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                                            { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                                        ];

                                        return  <Table
                                            title='Lista de produtos'
                                            columns={columns}
                                            tableId="table-one"
                                        >
                                            {data.map((item, index) => (
                                                <Tr key={index} id={item?.id || index}>
                                                    <Td>{item.name}</Td>
                                                    <Td>
                                                        <Money value={item.price} />
                                                    </Td>
                                                    <Td>{item.quantity}</Td>
                                                </Tr>
                                            ))}
                                        </Table>
                                    };

                                    export default TableDefaultExample;
                                `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Checkbox Selection">
              <Description>
                <p>
                  If true, the table will display an extra column with
                  checkboxes to select rows.
                </p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-checkbox-selection"
                  checkboxSelection
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableCheckboxSelectionExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-checkbox-selection"
                        checkboxSelection
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableCheckboxSelectionExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Column Header Height">
              <Description>
                <p>Sets the height in pixels of the table header columns.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-column-header-height"
                  columnHeaderHeight={52}
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableColumnHeaderHeightExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-column-header-height"
                        columnHeaderHeight={52}
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableColumnHeaderHeightExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Autosize">
              <Description>
                <p>
                  If true, automatic resizing of columns on table load will be
                  disabled.
                </p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-autosize"
                  disableAutosize
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableAutosizeExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-autosize"
                        disableAutosize
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableAutosizeExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Column Filter">
              <Description>
                <p>If true, column filters are disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-column-filter"
                  disableColumnFilter
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableColumnFilterExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-column-filter"
                        disableColumnFilter
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableColumnFilterExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Column Resize">
              <Description>
                <p>If true, resizing columns is disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-column-resize"
                  disableColumnResize
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableColumnResizeExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-column-resize"
                        disableColumnResize
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableColumnResizeExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Column Sorting">
              <Description>
                <p>If true, sorting of columns is disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-column-sorting"
                  disableColumnSorting
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableColumnSortingExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-column-sorting"
                        disableColumnSorting
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableColumnSortingExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Hide Footer">
              <Description>
                <p>If true, the footer of the table will be hidden.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-hide-footer"
                  hideFooter
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableHideFooterExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-hide-footer"
                        hideFooter
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableHideFooterExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Column Menu">
              <Description>
                <p>If true, the column menu will be disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-column-menu"
                  disableColumnMenu
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableColumnMenuExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-column-menu"
                        disableColumnMenu
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableColumnMenuExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Search Filter">
              <Description>
                <p>If true, the search filter will be disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-search-filter"
                  disableSearchFilter
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableSearchFilterExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-search-filter"
                        disableSearchFilter
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableSearchFilterExample;
        `}
              </Snippet>
            </ComponentInfo>

            <ComponentInfo title="Disable Export">
              <Description>
                <p>If true, the export functionality will be disabled.</p>
              </Description>
              <Preview>
                <Table
                  title="Lista de produtos"
                  columns={columns}
                  tableId="table-disable-export"
                  disableExport
                  checkboxSelection
                >
                  {data.map((item, index) => (
                    <Tr key={index} id={item?.id || index}>
                      <Td>{item.name}</Td>
                      <Td>
                        <Money value={item.price} />
                      </Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Table>
              </Preview>
              <Snippet>
                {`
            import React from 'react';
            import { Table, Tr, Td } from "../../../components/BaseUI/Table";

            const TableDisableExportExample = () => {
                const columns = [
                    { name: "Name", dataType: 'text' },
                    { name: "Price", dataType: 'between' },
                    { name: "Quantity", dataType: 'between' },
                ];

                const data = [
                    { id: 1, name: "Chocolate Vanilla Cake", price: 49.9, quantity: 12 },
                    { id: 2, name: "Passion Fruit Juice", price: 9.2, quantity: 38 },
                    { id: 3, name: "Apple Pie with Granola", price: 59.9, quantity: 21 },
                    { id: 4, name: "Shrimp Risotto", price: 119.9, quantity: 28 },
                ];

                return (
                    <Table
                        title='Lista de produtos'
                        columns={columns}
                        tableId="table-disable-export"
                        disableExport
                    >
                        {data.map((item, index) => (
                            <Tr key={index} id={item?.id || index}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Money value={item.price} />
                                </Td>
                                <Td>{item.quantity}</Td>
                            </Tr>
                        ))}
                    </Table>
                );
            };

            export default TableDisableExportExample;
        `}
              </Snippet>
            </ComponentInfo>
          </Panel>
        </TabPanel>
      </Tabs>
    </AppPage>
  )
}
