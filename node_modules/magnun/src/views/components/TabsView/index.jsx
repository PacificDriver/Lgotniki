import React from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Panel,
} from '../../../components/BaseUI/Tabs'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'

export default function TabsView() {
  return (
    <AppPage title="Tabs">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>The default form of tabs.</p>
                </Description>

                <Preview>
                  <Tabs>
                    <TabList>
                      <Tab>Tab 1</Tab>
                      <Tab>Tab 2</Tab>
                      <Tab>Tab 3</Tab>
                    </TabList>

                    <TabPanel>
                      <Panel>Panel 1</Panel>
                      <Panel>Panel 2</Panel>
                      <Panel>Panel 3</Panel>
                    </TabPanel>
                  </Tabs>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import { Tabs, TabList, Tab, TabPanel, Panel } from "../../../components/BaseUI/Tabs";

                                        const TabsDefaultExample = () => {
                                            return <Tabs>
                                                <TabList>
                                                    <Tab>Tab 1</Tab>
                                                    <Tab>Tab 2</Tab>
                                                    <Tab>Tab 3</Tab>
                                                </TabList>

                                                <TabPanel>
                                                    <Panel>Panel 1</Panel>
                                                    <Panel>Panel 2</Panel>
                                                    <Panel>Panel 3</Panel>
                                                </TabPanel>
                                            </Tabs>
                                        }
                                        export default TabsDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Selected">
                <Description>
                  <p>
                    A value can be passed to initialize the tabs with one
                    selected.
                  </p>
                </Description>

                <Preview>
                  <Tabs selected={3}>
                    <TabList>
                      <Tab>Tab 1</Tab>
                      <Tab>Tab 2</Tab>
                      <Tab>Tab 3</Tab>
                    </TabList>

                    <TabPanel>
                      <Panel>Panel 1</Panel>
                      <Panel>Panel 2</Panel>
                      <Panel>Panel 3</Panel>
                    </TabPanel>
                  </Tabs>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import { Tabs, TabList, Tab, TabPanel, Panel } from "../../../components/BaseUI/Tabs";

                                        const TabsSelectedExample = () => {
                                            return <Tabs selected={3}>
                                                <TabList>
                                                    <Tab>Tab 1</Tab>
                                                    <Tab>Tab 2</Tab>
                                                    <Tab>Tab 3</Tab>
                                                </TabList>

                                                <TabPanel>
                                                    <Panel>Panel 1</Panel>
                                                    <Panel>Panel 2</Panel>
                                                    <Panel>Panel 3</Panel>
                                                </TabPanel>
                                            </Tabs>
                                        }

                                        export default TabsSelectedExample;
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
