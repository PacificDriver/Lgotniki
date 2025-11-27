import React from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import { Tabs, TabContent } from '../../../components/BaseUI/Tabs'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'

export default function Tab() {
  return (
    <AppPage title="Tabs">
      <Tabs tabs={[{ title: 'Examples' }]}>
        <TabContent>
          <div className="mt-3">
            <ComponentInfo title="Default">
              <Description>
                <p>The default form of tabs.</p>
              </Description>

              <Preview>
                <Tabs
                  tabs={[
                    { title: 'Tab 1' },
                    { title: 'Tab 2' },
                    { title: 'Tab 3' },
                  ]}
                >
                  <TabContent>Tab 1 content</TabContent>
                  <TabContent>Tab 2 content</TabContent>
                  <TabContent>Tab 3 content</TabContent>
                </Tabs>
              </Preview>

              <Snippet>
                {`
                                    import React from 'react';

                                    import { Tabs, TabContent } from "../../../components/BaseUI/Tabs";

                                    const TabsDefaultExample = () => {
                                        return <Tabs tabs={[{ title: "Tab 1" }, { title: "Tab 2" }, {title: 'Tab 3'}]}>
                                            <TabContent>Tab 1 content</TabContent>
                                            <TabContent>Tab 2 content</TabContent>
                                            <TabContent>Tab 3 content</TabContent>
                                        </Tabs>

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
                <Tabs
                  tabs={[
                    { title: 'Tab 1' },
                    { title: 'Tab 2' },
                    { title: 'Tab 3' },
                  ]}
                  selected={3}
                >
                  <TabContent>Tab 1 content</TabContent>
                  <TabContent>Tab 2 content</TabContent>
                  <TabContent>Tab 3 content</TabContent>
                </Tabs>
              </Preview>

              <Snippet>
                {`
                                    import React from 'react';

                                    import { Tabs, TabContent } from "../../../components/BaseUI/Tabs";

                                    const TabsSelectedExample = () => {
                                            return  <Tabs 
                                            tabs={[{ title: "Tab 1" }, { title: "Tab 2" }, {title: 'Tab 3'}]}
                                            selected={3}
                                        >
                                            <TabContent>Tab 1 content</TabContent>
                                            <TabContent>Tab 2 content</TabContent>
                                            <TabContent>Tab 3 content</TabContent>
                                        </Tabs>

                                    export default TabsSelectedExample;
                                `}
              </Snippet>
            </ComponentInfo>
          </div>
        </TabContent>

        <TabContent></TabContent>
      </Tabs>
    </AppPage>
  )
}
