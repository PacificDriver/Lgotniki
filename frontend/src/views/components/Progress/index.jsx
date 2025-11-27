import React from 'react'

import Progress from '../../../components/BaseUI/Progress'
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

export default function ProgressUsing() {
  return (
    <AppPage title="Progress">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default progress.</p>
                </Description>

                <Preview>
                  <Progress progress={47} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Progress from "../../../components/BaseUI/Progress";

                                        const ProgressDefaultExample = () => {
                                            return <Progress progress={47} />
                                        };

                                        export default ProgressDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Height">
                <Description>
                  <p>Sets the height of the progress bar</p>
                </Description>

                <Preview>
                  <Progress progress={47} height={10} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Progress from "../../../components/BaseUI/Progress";

                                        const ProgressHeightExample = () => {
                                            return <Progress progress={47} height={10}/>
                                        };

                                        export default ProgressHeightExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Color">
                <Description>
                  <p>Sets the color of the progress indication.</p>
                </Description>

                <Preview>
                  <Progress progress={89} color="#7846b4" />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Progress from "../../../components/BaseUI/Progress";

                                        const ProgressColorExample = () => {
                                            return <Progress progress={89} color='#7846b4'/>
                                        };

                                        export default ProgressColorExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Show progress">
                <Description>
                  <p>Displays the progress percentage next to the bar.</p>
                </Description>

                <Preview>
                  <Progress progress={56} showProgress tooltip={true} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Progress from "../../../components/BaseUI/Progress";

                                        const ProgressShowProgressExample = () => {
                                            return <Progress progress={56} showProgress/>
                                        };

                                        export default ProgressShowProgressExample;
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
