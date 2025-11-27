import React from 'react'

import ListGroup from '../../../components/BaseUI/ListGroup'
import ListItem from '../../../components/BaseUI/ListGroup/ListItem'
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

export default function ListGroups() {
  const exampleOne = [
    { name: 'Moto G200', quantity: 782, active: true },
    { name: 'Galaxy S21 Ultra', quantity: 702 },
    { name: 'iPhone X', quantity: 452 },
    { name: 'Moto Razr', quantity: 376 },
  ]

  return (
    <AppPage title="List Group">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default list.</p>
                </Description>

                <Preview>
                  <div className="w-40">
                    <ListGroup>
                      {exampleOne?.map((product, index) => (
                        <ListItem key={index}>
                          <div>{product.name}</div>
                        </ListItem>
                      ))}
                    </ListGroup>
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';
                                        import ListGroup from "../../../components/BaseUI/ListGroup";
                                        import ListItem from "../../../components/BaseUI/ListGroup/ListItem";

                                        const ListGroupDefaultExample = () => {
                                            const example = [
                                                { name: "Moto G200", quantity: 782, active: true },
                                                { name: "Galaxy S21 Ultra", quantity: 702 },
                                                { name: "iPhone X", quantity: 452 },
                                                { name: "Moto Razr", quantity: 376 },
                                            ];

                                            return <ListGroup>
                                                {example?.map((product, index) => (
                                                    <ListItem key={index}>
                                                        <div>{product.name}</div>
                                                    </ListItem>
                                                ))}
                                            </ListGroup>;
                                        };

                                        export default ListGroupDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Borderless">
                <Description>
                  <p>
                    When borderless is activated, all list borders will be
                    removed.
                  </p>
                </Description>

                <Preview>
                  <div className="w-40">
                    <ListGroup borderless={true}>
                      {exampleOne?.map((product, index) => (
                        <ListItem key={index}>
                          <div>{product.name}</div>
                        </ListItem>
                      ))}
                    </ListGroup>
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';
                                        import ListGroup from "../../../components/BaseUI/ListGroup";
                                        import ListItem from "../../../components/BaseUI/ListGroup/ListItem";

                                        const ListGroupBorderlessExample = () => {
                                            const example = [
                                                { name: "LG K62", quantity: 287 },
                                                { name: "Xiaomi Redmi", quantity: 217 },
                                                { name: "Galaxy A02", quantity: 152 },
                                                { name: "Moto E22", quantity: 144 },
                                            ];

                                            return <ListGroup borderless={true}>
                                                {example?.map((product, index) => (
                                                    <ListItem key={index}>
                                                        <div>{product.name}</div>
                                                    </ListItem>
                                                ))}
                                            </ListGroup>;
                                        };

                                        export default ListGroupBorderlessExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Active">
                <Description>
                  <p>Highlights a list item when provided.</p>
                </Description>

                <Preview>
                  <div className="w-40">
                    <ListGroup>
                      {exampleOne?.map((product, index) => (
                        <ListItem key={index} active={product.active}>
                          <div>{product.name}</div>
                        </ListItem>
                      ))}
                    </ListGroup>
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';
                                        import ListGroup from "../../../components/BaseUI/ListGroup";
                                        import ListItem from "../../../components/BaseUI/ListGroup/ListItem";

                                        const ListGroupActiveExample = () => {
                                            const example = [
                                                { name: "LG K62", quantity: 287, active: true },
                                                { name: "Xiaomi Redmi", quantity: 217 },
                                                { name: "Galaxy A02", quantity: 152 },
                                                { name: "Moto E22", quantity: 144 },
                                            ];

                                            return <ListGroup>
                                                {example?.map((product, index) => (
                                                    <ListItem key={index} active={product.active}>
                                                        <div>{product.name}</div>
                                                    </ListItem>
                                                ))}
                                            </ListGroup>;
                                        };

                                        export default ListGroupActiveExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>
          </Panel>
        </TabPanel>
      </Tabs>
    </AppPage>
  )
}
