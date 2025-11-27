import React from 'react'
import Button from '../../../components/BaseUI/Button'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../components/BaseUI/Dropdown'
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

import { MdOutlineMoreHoriz } from 'react-icons/md'

export default function Dropdowns() {
  return (
    <AppPage title="Dropdowns">
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
                    By default, the dropdown will align to the left and below
                    the trigger.
                  </p>
                </Description>

                <Preview>
                  <Dropdown trigger="Menu actions">
                    <DropdownContent>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <DropdownItem key={index}>Item {item}</DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import {
                                            Dropdown,
                                            DropdownContent,
                                            DropdownItem,
                                        } from "../../../components/BaseUI/Dropdown";

                                        const DropdownDefaultExample = () => {
                                            return <Dropdown trigger='Menu actions'>
                                                <DropdownContent>
                                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                                        <DropdownItem key={index}>Item {item}</DropdownItem>
                                                    ))}
                                                </DropdownContent>
                                            </Dropdown>
                                        };

                                        export default DropdownDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Hide dropdown icon">
                <Description>
                  <p>This property hides the dropdown icon from the trigger.</p>
                </Description>

                <Preview>
                  <Dropdown trigger="Hide icon" hideDropdownIcon={true}>
                    <DropdownContent>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <DropdownItem key={index}>
                          Item hide icon {item}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import {
                                            Dropdown,
                                            DropdownContent,
                                            DropdownItem,
                                        } from "../../../components/BaseUI/Dropdown";

                                        const DropdownHideDropdownIconExample = () => {
                                            return <Dropdown 
                                                trigger='Hide icon'
                                                hideDropdownIcon={true}
                                            >
                                                <DropdownContent>
                                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                                        <DropdownItem key={index}>Item hide icon {item}</DropdownItem>
                                                    ))}
                                                </DropdownContent>
                                            </Dropdown>
                                        };

                                        export default DropdownHideDropdownIconExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Placement">
                <Description>
                  <p>
                    Sets the direction and alignment of the container in
                    relation to the trigger.
                  </p>
                </Description>

                <Preview>
                  <Dropdown trigger="Menu actions" placement="right">
                    <DropdownContent>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <DropdownItem key={index}>
                          Item placement {item}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import {
                                            Dropdown,
                                            DropdownContent,
                                            DropdownItem,
                                        } from "../../../components/BaseUI/Dropdown";

                                        const DropdownPlacementExample = () => {
                                            return <Dropdown 
                                                trigger='Menu actions'
                                                placement='top-end'
                                            >
                                                <DropdownContent>
                                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                                        <DropdownItem key={index}>Item placement {item}</DropdownItem>
                                                    ))}
                                                </DropdownContent>
                                            </Dropdown>
                                        };

                                        export default DropdownPlacementExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="With icon">
                <Description>
                  <p>
                    The dropdown component also accepts icons to be triggers.
                  </p>
                </Description>

                <Preview>
                  <Dropdown
                    trigger={<MdOutlineMoreHoriz />}
                    hideDropdownIcon={true}
                  >
                    <DropdownContent>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <DropdownItem key={index}>
                          Item with icon {item}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import {
                                            Dropdown,
                                            DropdownContent,
                                            DropdownItem,
                                        } from "../../../components/BaseUI/Dropdown";

                                        import { MdOutlineMoreHoriz } from "react-icons/md";

                                        const DropdownWithIconExample = () => {
                                            return <Dropdown 
                                                trigger={<MdOutlineMoreHoriz />} 
                                                hideDropdownIcon={true}
                                            >
                                                <DropdownContent>
                                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                                        <DropdownItem key={index}>Item with icon {item}</DropdownItem>
                                                    ))}
                                                </DropdownContent>
                                            </Dropdown>
                                        };

                                        export default DropdownWithIconExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="With elements">
                <Description>
                  <p>
                    In addition to using icons to trigger the dropdowns, it's
                    also possible to use HTML elements.
                  </p>
                </Description>

                <Preview>
                  <Dropdown
                    trigger={
                      <Button appearance="warning" title="Menu actions" />
                    }
                    hideDropdownIcon={true}
                  >
                    <DropdownContent>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <DropdownItem key={index}>
                          Item elements {item}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import {
                                            Dropdown,
                                            DropdownContent,
                                            DropdownItem,
                                        } from "../../../components/BaseUI/Dropdown";

                                        const DropdownWithElementsExample = () => {
                                            return <Dropdown 
                                                trigger={<Button appearance="warning" title='Menu actions'/>} 
                                                hideDropdownIcon={true}
                                            >
                                                <DropdownContent>
                                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                                        <DropdownItem key={index}>Item elements {item}</DropdownItem>
                                                    ))}
                                                </DropdownContent>
                                            </Dropdown>
                                        };

                                        export default DropdownWithElementsExample;
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
