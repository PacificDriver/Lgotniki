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
import Radio from '../../../components/BaseUI/Radio'

export default function Radios() {
  return (
    <AppPage title="Radio">
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
                    By default, the radio options list will be displayed
                    stacked.
                  </p>
                </Description>

                <Preview>
                  <Radio
                    options={[
                      { value: '1', label: 'Default radio' },
                      { value: '2', label: 'Default radio 2' },
                    ]}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Radio from "../../../components/BaseUI/Radio";

                                        const RadioDefaultExample = () => {
                                            return <Radio 
                                                options={[
                                                    {value: '1', label: 'Default radio'},
                                                    {value: '2', label: 'Default radio 2'},
                                                ]}
                                            />
                                        };

                                        export default RadioDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Direction">
                <Description>
                  <p>
                    Sets the direction in which the radio options will be
                    arranged.
                  </p>
                </Description>

                <Preview>
                  <Radio
                    options={[
                      { value: '1', label: 'Direction radio 1' },
                      { value: '2', label: 'Direction radio 2' },
                    ]}
                    direction="row"
                    onChange={value => console.log('radio selected', value)}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Radio from "../../../components/BaseUI/Radio";

                                        const RadioDirectionExample = () => {
                                            return <Radio 
                                                options={[
                                                    {value: '1', label: 'Direction radio 1'},
                                                    {value: '2', label: 'Direction radio 2'},
                                                ]}
                                                direction='row'
                                                onChange={(value) => console.log('radio selected', value)}
                                            />
                                        };

                                        export default RadioDirectionExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Selected">
                <Description>
                  <p>Marks an option in the list.</p>
                </Description>

                <Preview>
                  <Radio
                    options={[
                      { value: '1', label: 'Selected radio 1' },
                      { value: '2', label: 'Selected radio 2' },
                    ]}
                    direction="row"
                    selected="2"
                    onChange={value => console.log('radio selected', value)}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Radio from "../../../components/BaseUI/Radio";

                                        const RadioSelectedExample = () => {
                                            return <Radio 
                                                options={[
                                                    {value: '1', label: 'Selected radio 1'},
                                                    {value: '2', label: 'Selected radio 2'},
                                                ]}
                                                direction='row'
                                                selected='2'
                                                onChange={(value) => console.log('radio selected', value)}
                                            />
                                        };

                                        export default RadioSelectedExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Disabled">
                <Description>
                  <p>Disables items in the options list.</p>
                </Description>

                <Preview>
                  <Radio
                    options={[
                      { value: '1', label: 'Disabled radio 1' },
                      { value: '2', label: 'Disabled radio 2' },
                      { value: '3', label: 'Disabled radio 3' },
                      { value: '4', label: 'Disabled radio 4' },
                      { value: '5', label: 'Disabled radio 5' },
                    ]}
                    disabled={['2', '5']}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Radio from "../../../components/BaseUI/Radio";

                                        const RadioDisabledExample = () => {
                                            return <Radio 
                                                options={[
                                                    {value: '1', label: 'Disabled radio 1'},
                                                    {value: '2', label: 'Disabled radio 2'},
                                                    {value: '3', label: 'Disabled radio 3'},
                                                    {value: '4', label: 'Disabled radio 4'},
                                                    {value: '5', label: 'Disabled radio 5'},
                                                ]}
                                                disabled={['2', '5']}
                                            />
                                        };

                                        export default RadioDisabledExample;
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
