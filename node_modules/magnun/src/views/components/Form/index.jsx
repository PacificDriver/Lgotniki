import React from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import Input from '../../../components/BaseUI/Input'
import CardContainer from '../../../components/CustomUI/CardContainer'
import DatePicker from '../../../components/CustomUI/DatePicker'
import Button from '../../../components/BaseUI/Button'
import Select from '../../../components/BaseUI/Select'

import { MdLockOutline } from 'react-icons/md'
import { MdMailOutline } from 'react-icons/md'
import { MdOutlineNotifications } from 'react-icons/md'
import { MdOutlineArrowForward } from 'react-icons/md'
import { MdOutlinePersonOutline } from 'react-icons/md'
import DateTimerPicker from '../../../components/CustomUI/DateTimerPicker'
import RichTextEditor from '../../../components/CustomUI/RichTextEditor'

export default function Form() {
  const options = [
    { value: '1', label: 'Ana Clara' },
    { value: '2', label: 'Clara' },
    { value: '3', label: 'Laura Lima' },
    { value: '4', label: 'Leticia Sabatela de Carvalho' },
    { value: '5', label: 'Luisa Melo' },
    { value: '6', label: 'Caroline Sousa' },
  ]

  const content = `
        <h1>Título Principal</h1>

        <p>Este é um exemplo de conteúdo HTML com várias tags diferentes, incluindo <strong>negrito</strong>, <em>itálico</em>, uma lista não ordenada e um bloco de código:</p>
        
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        
        <code>function helloWorld() {
            console.log("Olá, mundo!");
        }</code>
        
        <blockquote>
            <p>Esta é uma citação interessante que exemplifica a utilidade do elemento blockquote.</p>
        </blockquote>
    `

  return (
    <AppPage title="Form">
      <CardContainer className="p-4">
        <div className="w-100 d-flex gap-2">
          <div className="w-50">
            <Input label="Text Input" placeholder="Text Placeholder" />
          </div>

          <div className="w-50">
            <Input
              label="Text Required"
              placeholder="Text Placeholder"
              required="true"
            />
          </div>
        </div>

        <div className="w-100 d-flex gap-2">
          <div className="w-50">
            <Input
              label="Success"
              placeholder="Text Placeholder"
              valid="true"
              message="Success Text"
            />
          </div>

          <div className="w-50">
            <Input
              label="Error"
              placeholder="Text Placeholder"
              valid="false"
              message="Error Text"
            />
          </div>
        </div>

        <div className="w-100 d-flex gap-2 mt-3">
          <div className="w-50">
            <Input
              label="Success"
              placeholder="Text Placeholder"
              useIcon={{
                direction: 'left',
                icon: <MdLockOutline />,
              }}
            />
          </div>

          <div className="w-50">
            <Input
              label="Error"
              placeholder="Text Placeholder"
              useIcon={{
                direction: 'right',
                icon: <MdMailOutline />,
              }}
            />
          </div>
        </div>

        <div className="w-100 d-flex gap-2 mt-3">
          <div className="w-30">
            <DatePicker
              label="Start Date"
              value="15/11/2023"
              minDate="09/11/2023"
              maxDate="18/12/2023"
              onChange={value => console.log('datepicker', value)}
            />
          </div>

          <div className="w-30">
            <DateTimerPicker
              label="Date timer picker"
              onChange={value => console.log('datepicker', value)}
            />
          </div>
        </div>

        <div className="w-100 d-flex gap-2 mt-3">
          <Button appearance="primary">Button Text</Button>

          <Button
            appearance="soft-primary"
            useIcon={{
              direction: 'left',
              icon: <MdOutlinePersonOutline />,
            }}
            disabled={true}
          >
            Button Text
          </Button>

          <Button
            appearance="outline-primary"
            useIcon={{
              direction: 'right',
              icon: <MdOutlineArrowForward />,
            }}
            disabled={true}
          >
            Button Text
          </Button>

          <Button appearance="small" type="primary">
            <MdOutlineNotifications />
          </Button>

          <Button size="medium" appearance="outline-danger" disabled={true}>
            <MdLockOutline />
          </Button>

          <Button size="large" appearance="primary">
            <MdMailOutline />
          </Button>
        </div>

        <div className="w-100 d-flex gap-2 mt-3">
          <div className="w-30">
            <Select label="User List" options={options} />
          </div>
        </div>

        <div>
          <RichTextEditor
            placeholder={'Editar descrição'}
            content={content}
            onSaved={value => console.log('onSaved', value)}
          />
        </div>
      </CardContainer>
    </AppPage>
  )
}
