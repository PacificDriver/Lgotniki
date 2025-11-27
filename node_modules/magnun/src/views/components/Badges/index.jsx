import React from 'react'

import Badge from '../../../components/BaseUI/Badge'
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

import { MdNotificationsNone } from 'react-icons/md'

export default function Badges() {
  return (
    <AppPage title="Badge">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>Default badge when no appearance is defined.</p>
                </Description>

                <Preview>
                  <Badge content={5} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        const BadgeDefaultExample = () => {
                                            return <Badge content={5}/>;
                                        };

                                        export default BadgeDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Primary">
                <Preview>
                  <Badge content={9} appearance="primary" />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        const BadgePrimaryExample = () => {
                                            return <Badge content={9} appearance='primary'/>;
                                        };

                                        export default BadgePrimaryExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Warning">
                <Preview>
                  <Badge content={50} appearance="warning" />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        const BadgeWarningExample = () => {
                                            return <Badge content={50} appearance='warning'/>;
                                        };

                                        export default BadgeWarningExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Danger">
                <Preview>
                  <Badge content={99} appearance="danger" />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        const BadgeDangerExample = () => {
                                            return <Badge content={99} appearance='danger'/>;
                                        };

                                        export default BadgeDangerExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Max value">
                <Description>
                  <p>Limits the display.</p>
                </Description>

                <Preview>
                  <Badge content={850} appearance="success" max={70} />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        const BadgeMaxExample = () => {
                                            return <Badge content={850} appearance='success' max={70}/>;
                                        };

                                        export default BadgeMaxExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="With Icon">
                <Description>
                  <p>You can also wrap the badge with an icon.</p>
                </Description>

                <Preview>
                  <Badge content={4} appearance="success">
                    <MdNotificationsNone style={{ fontSize: '24px' }} />
                  </Badge>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Badge from "../../../components/BaseUI/Badge";

                                        import { MdNotificationsNone } from "react-icons/md";

                                        const BadgeWithIconExample = () => {
                                            return <Badge content={4} appearance='success'>
                                                <MdNotificationsNone style={{fontSize: '24px'}}/>
                                            </Badge>;
                                        };

                                        export default BadgeWithIconExample;
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
