import {
  MdBusiness,
  MdCode,
  MdSell,
  MdPeople,
  MdAttachMoney,
  MdSupport,
} from 'react-icons/md'

const mockData = [
  {
    id: 1,
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Marketing',
    totalMembers: 25,
    icon: <MdBusiness />,
  },
  {
    id: 2,
    uuid: 'f1e2d3c4-b5a6-7890-cdef-1234567890ab',
    name: 'Desenvolvimento',
    totalMembers: 30,
    icon: <MdCode />,
  },
  {
    id: 3,
    uuid: 'c1d2e3f4-a5b6-7890-defa-1234567890bc',
    name: 'Vendas',
    totalMembers: 20,
    icon: <MdSell />,
  },
  {
    id: 4,
    uuid: 'b1c2d3e4-f5a6-7890-efab-1234567890cd',
    name: 'Recursos Humanos',
    totalMembers: 15,
    icon: <MdPeople />,
  },
  {
    id: 5,
    uuid: 'd1e2f3a4-b5c6-7890-fabc-1234567890de',
    name: 'Financeiro',
    totalMembers: 18,
    icon: <MdAttachMoney />,
  },
  {
    id: 6,
    uuid: 'e1f2a3b4-c5d6-7890-abcd-1234567890ef',
    name: 'Suporte Técnico',
    totalMembers: 22,
    icon: <MdSupport />,
  },
]

export default mockData
