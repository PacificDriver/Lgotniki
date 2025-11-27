import React from 'react'

import Button from '../../../components/BaseUI/Button'
import {
  Panel,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../../../components/BaseUI/Tabs'
import Tooltip from '../../../components/BaseUI/Tooltip'
import AppPage from '../../../components/CustomUI/AppPage'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'

export default function Tooltips() {
  return (
    <AppPage title="Tooltips">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>
                    By default, if no positioning is defined for the tooltip, it
                    will assume the bottom position.
                  </p>
                </Description>

                <Preview>
                  <Tooltip content="Bottom">
                    <Button title="Hover over me" appearance="primary" />
                  </Tooltip>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Tooltip from "../../../components/BaseUI/Tooltip";

                                        const TooltipDefaultExample = () => {
                                            return <Tooltip content='Bottom'>
                                                <Button title="Hover over me" appearance="primary"/>
                                            </Tooltip>

                                        export default TooltipDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Position">
                <Description>
                  <p>
                    Defines the positioning where the tooltip will be visible.
                    For 'top' and 'bottom' positions, if the tooltip content is
                    longer than the available space on the left or right, it
                    will align respectively to the trigger.
                  </p>
                </Description>

                <Preview>
                  <div className="d-flex gap-2">
                    <Tooltip content="Left" position="left">
                      <Button title="Left" />
                    </Tooltip>

                    <Tooltip
                      content="In the serene twilight, whispers of forgotten dreams linger, embracing the essence of a world painted in hues of endless possibilities."
                      position="top"
                    >
                      <Button title="Top" />
                    </Tooltip>

                    <Tooltip content="Right" position="right">
                      <Button title="Right" />
                    </Tooltip>

                    <Tooltip content="Bottom" position="bottom">
                      <Button title="Bottom" />
                    </Tooltip>
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Tooltip from "../../../components/BaseUI/Tooltip";

                                        const TooltipPositionExample = () => {
                                            return <div className="d-flex gap-2">
                                                <Tooltip content='Left' position='left'>
                                                    <Button title="Left"/>
                                                </Tooltip>
            
                                                <Tooltip content='Top' position='top'>
                                                    <Button title="Top"/>
                                                </Tooltip>
            
                                                <Tooltip content='Right' position='right'>
                                                    <Button title="Right"/>
                                                </Tooltip>
            
                                                <Tooltip content='Bottom' position='bottom'>
                                                    <Button title="Bottom"/>
                                                </Tooltip>
                                            </div>

                                        export default TooltipPositionExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Custom tooltip">
                <Description>
                  <p>You can customize the style of the tooltip.</p>
                </Description>

                <Preview>
                  <Tooltip
                    content="In the serene twilight, whispers of forgotten dreams linger, embracing the essence of a world painted in hues of endless possibilities."
                    customStyle={{
                      background: '#fff',
                      borderRadius: '4px',
                      boxShadow: '0px 0px 0.625rem 0.25rem rgba(18,38,63, 0.1)',
                      boxSizing: 'content-box',
                      padding: '8px 12px',
                      color: '#162949',
                    }}
                    position="bottom"
                  >
                    <Button title="Hover over me" appearance="warning" />
                  </Tooltip>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Tooltip from "../../../components/BaseUI/Tooltip";

                                        const TooltipCustomStyleExample = () => {
                                            return <Tooltip 
                                                content='In the serene twilight, whispers of forgotten dreams linger, embracing the essence of a world painted in hues of endless possibilities.' 
                                                customStyle={{
                                                    background: '#fff',
                                                    borderRadius: '4px',
                                                    boxShadow: '0px 0px 0.625rem 0.25rem rgba(18,38,63, 0.1)',
                                                    boxSizing: 'content-box',
                                                    padding: '8px 12px',
                                                    color: '#162949'
                                                }}
                                                position='bottom'
                                            >
                                                <Button title="Hover over me" appearance="warning"/>
                                            </Tooltip>

                                        export default TooltipCustomStyleExample;
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
