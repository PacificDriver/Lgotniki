import React, { useState } from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../../components/BaseUI/Modal'

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
import Button from '../../../components/BaseUI/Button'
import ButtonGroup from '../../../components/BaseUI/ButtonGroup'
import Input from '../../../components/BaseUI/Input'
import DatePicker from '../../../components/CustomUI/DatePicker'
import Select from '../../../components/BaseUI/Select'

import { MdLockOutline } from 'react-icons/md'
import { MdMailOutline } from 'react-icons/md'

export default function Modals() {
  const [state, setState] = useState({
    open: false,
    width: '',
    scrollBehavior: '',
    onClose: false,
  })

  const options = [
    { value: '1', label: 'Ana Clara' },
    { value: '2', label: 'Clara' },
    { value: '3', label: 'Laura Lima' },
    { value: '4', label: 'Leticia Sabatela de Carvalho' },
    { value: '5', label: 'Luisa Melo' },
    { value: '6', label: 'Caroline Sousa' },
  ]

  const displayOnClose = state.onClose
    ? {
        onClose: () =>
          setState({
            width: '',
            scrollBehavior: '',
            open: false,
            onClose: false,
          }),
      }
    : {}

  return (
    <AppPage title="Modals">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>The default modal style.</p>
                </Description>

                <Preview>
                  <Button
                    onClick={() =>
                      setState({ ...state, open: !state.open, onClose: true })
                    }
                    appearance="primary"
                  >
                    Open modal
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, {useState} from 'react';

                                        import { Modal, ModalHeader, ModalBody, ModalFooter} from "../../../components/BaseUI/Modal";
                                        import Button from "../../../components/BaseUI/Button";

                                        const ModalDefaultExample = () => {
                                            const [state, setState] = useState({
                                                open: false
                                            })

                                            return <div>
                                                <Button onClick={() => setState({...state, open: !state.open})} appearance="primary">Open modal</Button>

                                                <Modal 
                                                    isOpen={state.open} 
                                                    onClose={setState({...state, open: false })}
                                                >
                                                    <ModalHeader>
                                                        Confirm action
                                                    </ModalHeader>
                                                        
                                                    <ModalBody>
                                                        <p>In the serene twilight, whispers of forgotten dreams linger, embracing the essence of a world painted in hues of endless possibilities.</p> 
                                                    </ModalBody>
                                    
                                                    <ModalFooter>
                                                            <Button appearance="soft" onClick={() => setState({ open: false})}>Cancel</Button>
                                                            <Button appearance="primary" onClick={() => setState({ open: false})}>Confirm</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </div>
                                        export default ModalDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Width">
                <Description>
                  <p>Set the width of the modal.</p>
                </Description>

                <Preview>
                  <ButtonGroup appearance="primary">
                    <Button
                      onClick={() => setState({ open: true, width: 'small' })}
                    >
                      Small
                    </Button>
                    <Button
                      onClick={() => setState({ open: true, width: 'medium' })}
                    >
                      Medium
                    </Button>
                    <Button
                      onClick={() => setState({ open: true, width: 'large' })}
                    >
                      Large
                    </Button>
                    <Button
                      onClick={() => setState({ open: true, width: 'x-large' })}
                    >
                      X-large
                    </Button>
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React, {useState} from 'react';

                                        import { Modal, ModalHeader, ModalBody, ModalFooter} from "../../../components/BaseUI/Modal";
                                        import Button from "../../../components/BaseUI/Button";
                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";

                                        const ModalWidthExample = () => {
                                            const [state, setState] = useState({
                                                open: false,
                                                width: ''
                                            })
                                        
                                            return <div>
                                                <ButtonGroup appearance="primary">
                                                    <Button onClick={() => setState({open: true, width: 'small'})}>Small</Button>
                                                    <Button onClick={() => setState({open: true, width: 'medium'})}>Medium</Button>
                                                    <Button onClick={() => setState({open: true, width: 'large'})}>Large</Button>
                                                    <Button onClick={() => setState({open: true, width: 'x-large'})}>X-large</Button>
                                                </ButtonGroup>

                                                <Modal 
                                                    isOpen={state.open} 
                                                    width={state.width} 
                                                >
                                                    <ModalHeader>
                                                        Confirm action
                                                    </ModalHeader>
                                                        
                                                    <ModalBody>
                                                        <p>In the serene twilight, whispers of forgotten dreams linger, embracing the essence of a world painted in hues of endless possibilities.</p> 
                                                    </ModalBody>
                                    
                                                    <ModalFooter>
                                                            <Button appearance="soft" onClick={() => setState({width: '', open: false})}>Cancel</Button>
                                                            <Button appearance="primary" onClick={() => setState({width: '', open: false})}>Confirm</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </div>
                                        export default ModalWidthExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Scrolling behavior">
                <Description>
                  <p>Define the scrolling behavior of the modal.</p>
                </Description>

                <Preview>
                  <ButtonGroup appearance="primary">
                    <Button
                      onClick={() =>
                        setState({
                          open: true,
                          width: 'medium',
                          scrollBehavior: 'inside',
                        })
                      }
                    >
                      Scroll inside
                    </Button>
                    <Button
                      onClick={() =>
                        setState({
                          open: true,
                          width: 'medium',
                          scrollBehavior: 'outside',
                        })
                      }
                    >
                      Scroll outside
                    </Button>
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React, {useState} from 'react';

                                        import { Modal, ModalHeader, ModalBody, ModalFooter} from "../../../components/BaseUI/Modal";
                                        import Button from "../../../components/BaseUI/Button";
                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";
                                        import Input from '../../../components/BaseUI/Input';
                                        import DatePicker from '../../../components/CustomUI/DatePicker';
                                        import Select from '../../../components/BaseUI/Select';
                                        
                                        import { MdLockOutline } from "react-icons/md";
                                        import { MdMailOutline } from "react-icons/md";

                                        const ModalScrollBehaviorExample = () => {
                                            const [state, setState] = useState({
                                                open: false,
                                                scrollBehavior: '',
                                            })

                                            return <div>
                                                <ButtonGroup appearance="primary">
                                                    <Button onClick={() => setState({open: true, scrollBehavior: 'inside'})}>Scroll inside</Button>
                                                    <Button onClick={() => setState({open: true, scrollBehavior: 'outside'})}>Scroll outside</Button>
                                                </ButtonGroup>

                                                <Modal 
                                                    isOpen={state.open} 
                                                    scrollBehavior={state.scrollBehavior}
                                                >
                                                    <ModalHeader>
                                                        Confirm action
                                                    </ModalHeader>
                                                        
                                                    <ModalBody>
                                                        <div>
                                                            <div className="w-100">
                                                                <Input 
                                                                    label='Text Input'
                                                                    placeholder='Text Placeholder'
                                                                />
                                                            </div>

                                                            <div className="w-100">
                                                                <Input 
                                                                    label='Text Required'
                                                                    placeholder='Text Placeholder'
                                                                    required='true'
                                                                />
                                                            </div>

                                                            <div className="w-100">
                                                                <Input 
                                                                    label='Success'
                                                                    placeholder='Text Placeholder'
                                                                    valid='true'
                                                                    message='Success Text'
                                                                />
                                                            </div>
                                                    
                                                            <div className="w-100 my-4">
                                                                <Input 
                                                                    label='Error'
                                                                    placeholder='Text Placeholder'
                                                                    valid='false'
                                                                    message='Error Text'
                                                                />
                                                            </div>

                                                            <div className="w-100 mt-1">
                                                                <Input 
                                                                    label='Success'
                                                                    placeholder='Text Placeholder'
                                                                    useIcon={{
                                                                        direction: 'left',
                                                                        icon: <MdLockOutline />
                                                                    }}
                                                                />
                                                            </div>
                                                    
                                                            <div className="w-100">
                                                                <Input 
                                                                    label='Error'
                                                                    placeholder='Text Placeholder'
                                                                    useIcon={{
                                                                        direction: 'right',
                                                                        icon: <MdMailOutline />
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="w-100">
                                                                <DatePicker 
                                                                    label='Start Date'
                                                                    value='15/11/2023'
                                                                    minDate='09/11/2023'
                                                                    maxDate='18/12/2023'
                                                                    onChange={(value) => console.log('datepicker', value)}
                                                                />
                                                            </div>

                                                            <div className="w-100">
                                                                <Select 
                                                                    label='User List'
                                                                    options={options}
                                                                />
                                                            </div>
                                                        </div>
                                                    </ModalBody>

                                                    <ModalFooter>
                                                            <Button appearance="soft" onClick={() => setState({scrollBehavior: '', open: false})}>Cancel</Button>
                                                            <Button appearance="primary" onClick={() => setState({scrollBehavior: '', open: false})}>Confirm</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </div>

                                        export default ModalScrollBehaviorExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>
          </Panel>
        </TabPanel>
      </Tabs>

      <Modal
        isOpen={state.open}
        width={state.width}
        scrollBehavior={state.scrollBehavior}
        {...displayOnClose}
      >
        <ModalHeader>Confirm action</ModalHeader>

        <ModalBody>
          {!state.scrollBehavior ? (
            <p>
              In the serene twilight, whispers of forgotten dreams linger,
              embracing the essence of a world painted in hues of endless
              possibilities.
            </p>
          ) : (
            <div>
              <div className="w-100">
                <Input label="Text Input" placeholder="Text Placeholder" />
              </div>

              <div className="w-100">
                <Input
                  label="Text Required"
                  placeholder="Text Placeholder"
                  required="true"
                />
              </div>

              <div className="w-100">
                <Input
                  label="Success"
                  placeholder="Text Placeholder"
                  valid="true"
                  message="Success Text"
                />
              </div>

              <div className="w-100 my-4">
                <Input
                  label="Error"
                  placeholder="Text Placeholder"
                  valid="false"
                  message="Error Text"
                />
              </div>

              <div className="w-100 mt-1">
                <Input
                  label="Success"
                  placeholder="Text Placeholder"
                  useIcon={{
                    direction: 'left',
                    icon: <MdLockOutline />,
                  }}
                />
              </div>

              <div className="w-100">
                <Input
                  label="Error"
                  placeholder="Text Placeholder"
                  useIcon={{
                    direction: 'right',
                    icon: <MdMailOutline />,
                  }}
                />
              </div>

              <div className="w-100">
                <DatePicker
                  label="Start Date"
                  value="15/11/2023"
                  minDate="09/11/2023"
                  maxDate="18/12/2023"
                  onChange={value => console.log('datepicker', value)}
                />
              </div>

              <div className="w-100">
                <Select label="User List" options={options} />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            appearance="soft"
            onClick={() =>
              setState({ width: '', scrollBehavior: '', open: false })
            }
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={() =>
              setState({ width: '', scrollBehavior: '', open: false })
            }
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </AppPage>
  )
}
