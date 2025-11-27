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
import InlineEdit from '../../../components/BaseUI/InlineEdit'

export default function InlineText() {
  return (
    <AppPage title="Inline Edit">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default inline editor.</p>
                </Description>

                <Preview>
                  <InlineEdit
                    value="As the sun sets, casting a warm glow on the horizon, we reflect on the day's moments."
                    onConfirm={value => console.log(value)}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import InlineEdit from "../../../components/BaseUI/InlineEdit";

                                        const InlineEditDefaultExample = () => {
                                            return <InlineEdit 
                                                value="As the sun sets, casting a warm glow on the horizon, we reflect on the day's moments."
                                                onConfirm={(value) => console.log(value)}
                                            />

                                        export default InlineEditDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Custom style">
                <Description>
                  <p>You can customize the style of the inline edit.</p>
                </Description>

                <Preview>
                  <InlineEdit
                    value="Each experience, a thread in the intricate fabric of life, weaves a story of resilience and growth."
                    onConfirm={value => console.log(value)}
                    customStyle={{
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontWeight: '600',
                    }}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import InlineEdit from "../../../components/BaseUI/InlineEdit";

                                        const InlineEditCustomStyleExample = () => {
                                            return <InlineEdit 
                                                value="Each experience, a thread in the intricate fabric of life, weaves a story of resilience and growth."
                                                onConfirm={(value) => console.log(value)}
                                                customStyle={{
                                                    fontSize: '18px',
                                                    lineHeight: '28px',
                                                    fontWeight: '600',
                                                }}
                                            />

                                        export default InlineEditCustomStyleExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Invalid">
                <Description>
                  <p>Highlights the field indicating an error.</p>
                </Description>

                <Preview>
                  <InlineEdit
                    value="Embrace the beauty of simplicity, for within it, profound lessons often unfold."
                    onConfirm={value => console.log(value)}
                    invalid={true}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import InlineEdit from "../../../components/BaseUI/InlineEdit";

                                        const InlineEditInvalidExample = () => {
                                            return <InlineEdit 
                                                value="Embrace the beauty of simplicity, for within it, profound lessons often unfold."
                                                onConfirm={(value) => console.log(value)}
                                                invalid={true}
                                            />

                                        export default InlineEditInvalidExample;
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
