import React from 'react'

import Breadcrumbs from '../../../components/BaseUI/Breadcrumbs'
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

export default function Breadcrumb() {
  return (
    <AppPage title="Breadcrumb">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default breadcrumb.</p>
                </Description>

                <Preview>
                  <Breadcrumbs
                    options={[
                      { label: 'Magnun', url: '' },
                      { label: 'Core', url: '' },
                      { label: 'Breadcrumb' },
                    ]}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Breadcrumbs from "../../../components/BaseUI/Breadcrumbs";

                                        const BreadcrumbsDefaultExample = () => {
                                            return <Breadcrumbs options={[
                                                { label: "Magnun", url: "" },
                                                { label: "Core", url: "" },
                                                { label: "Breadcrumb" },
                                            ]}/>
                                        };

                                        export default BreadcrumbsDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Max Label Length">
                <Description>
                  <p>
                    Used to truncate long labels. When activated, the full label
                    name will be displayed as a tooltip. Labels have a maximum
                    width of 250px, after which automatic truncation occurs.
                  </p>
                </Description>

                <Preview>
                  <Breadcrumbs
                    options={[
                      { label: 'Magnun', url: '' },
                      { label: 'Photografies', url: '' },
                      {
                        label:
                          'Core For Design System Build It By New Oxford Well People By Rest',
                        url: '',
                      },
                      {
                        label:
                          'Breadcrumb UX/UI User Friendly The Firts Big Text Long Are You Best',
                      },
                    ]}
                    maxLabelLength={18}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Breadcrumbs from "../../../components/BaseUI/Breadcrumbs";

                                        const BreadcrumbsMaxLabelLengthExample = () => {
                                            return <Breadcrumbs options={[
                                                { label: "Magnun", url: "" },
                                                { label: "Photografies", url: "" },
                                                { label: "Core For Design System Build It By New Oxford Well People By Rest", url: "" },
                                                { label: "Breadcrumb UX/UI User Friendly The Firts Big Text Long Are You Best" },
                                            ]} 
                                            maxLabelLength={18}/>
                                        };

                                        export default BreadcrumbsMaxLabelLengthExample;
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
