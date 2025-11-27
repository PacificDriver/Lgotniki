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
import Range from '../../../components/BaseUI/Range'

export default function Ranges() {
  return (
    <AppPage title="Range">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default range.</p>
                </Description>

                <Preview>
                  <Range value={47} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeDefaultExample = () => {
                                            return <Range value={47}/>
                                        };

                                        export default RangeDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Minimum value">
                <Description>
                  <p>Sets the minimum acceptable value for the range.</p>
                </Description>

                <Preview>
                  <Range value={18} min={10} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeMinExample = () => {
                                            return <Range value={18} min={10}/>
                                        };

                                        export default RangeMinExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Maximum value">
                <Description>
                  <p>Sets the maximum acceptable value for the range.</p>
                </Description>

                <Preview>
                  <Range value={10} max={80} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeMaxExample = () => {
                                            return <Range value={10} max={80}/>
                                        };

                                        export default RangeMaxExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Step">
                <Description>
                  <p>Sets the interval between allowed values for the range.</p>
                </Description>

                <Preview>
                  <Range value={10} step={5} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeStepExample = () => {
                                            return <Range value={10} step={5}/>
                                        };

                                        export default RangeStepExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Disabled">
                <Description>
                  <p>Disables interaction with the range.</p>
                </Description>

                <Preview>
                  <Range value={80} disabled={true} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeStepExample = () => {
                                            return <Range value={10} step={5}/>
                                        };

                                        export default RangeStepExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Show progress">
                <Description>
                  <p>
                    Displays the progress in a tooltip when hovering over the
                    slider area.
                  </p>
                </Description>

                <Preview>
                  <Range
                    value={80}
                    max={100}
                    showValue={true}
                    beforeValue="R$"
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Range from "../../../components/BaseUI/Range";

                                        const RangeShowValueExample = () => {
                                            return <Range 
                                                value={80} 
                                                min={18} 
                                                max={90} 
                                                showValue={true}
                                            />
                                        };

                                        export default RangeShowValueExample;
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
