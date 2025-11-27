import { useRequire as loadFile } from '../../utils/utils'

import audio1 from '../../assets/files/audio/dark-future-logo-196217.mp3'
import audio2 from '../../assets/files/audio/inspiring-trailer-15-sec-203615.mp3'

const initialData = {
  users: [
    {
      name: 'Sophia Amelia Johnson',
      image:
        'https://images.unsplash.com/photo-1646198008289-41e33db7a209?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'sophia.johnson@example.com',
      bio: 'Especialista em marketing digital, apaixonada por tecnologia e inovação. Com mais de 10 anos de experiência, busca criar soluções criativas e eficazes para grandes marcas.',
    },
    {
      name: 'Oliver Benjamin Smith',
      image:
        'https://images.unsplash.com/photo-1583692331507-fc0bd348695d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'oliver.smith@example.com',
      bio: 'Desenvolvedor full-stack com forte conhecimento em JavaScript e PHP. Ama resolver problemas complexos e está sempre atualizado com as últimas tendências de tecnologia.',
    },
    {
      name: 'Mia Isabella Jackson',
      image:
        'https://images.unsplash.com/photo-1614436086835-d18683eb24f8?q=80&w=1914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'mia.jackson@example.com',
      bio: 'Engenheira de software com foco em IA e aprendizado de máquina. Adora criar soluções inovadoras que automatizam processos e melhoram a eficiência das empresas.',
    },
    {
      name: 'Ava Emily Thomas',
      image:
        'https://images.unsplash.com/photo-1613365765813-e29fea16ecaa?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'ava.thomas@example.com',
      bio: 'Gestora de projetos com mais de 8 anos de experiência no setor de TI. Sua especialidade é coordenar equipes para entregar projetos com alta qualidade e dentro do prazo.',
    },
    {
      name: 'Isabella Ava Davies',
      image:
        'https://images.unsplash.com/photo-1630255733038-0eaa251036c9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'isabella.davies@example.com',
      bio: 'Analista de dados com paixão por extrair insights valiosos de grandes volumes de informações. Expert em SQL, Python e visualização de dados.',
    },
    {
      name: 'Amelia Emily Brown',
      image:
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      active: true,
      email: 'amelia.brown@example.com',
      bio: 'Especialista em segurança da informação, focada em proteger dados e sistemas. Certificada em CISSP e sempre à frente das novas ameaças cibernéticas.',
    },
    {
      name: 'Liam Jacob Williams',
      image: '',
      active: true,
      email: 'liam.williams@example.com',
      bio: 'Designer gráfico com foco em UX/UI. Criativo e com atenção aos detalhes, trabalha para criar interfaces bonitas e funcionais para aplicativos e sites.',
    },
    {
      name: 'Noah Ethan Taylor',
      image: '',
      active: true,
      email: 'noah.taylor@example.com',
      bio: 'Consultor de TI com vasta experiência em redes e infraestrutura. Ajuda empresas a melhorar a eficiência dos seus sistemas e processos tecnológicos.',
    },
    {
      name: 'Jacob William Wilson',
      image: '',
      active: true,
      email: 'jacob.wilson@example.com',
      bio: 'Desenvolvedor mobile com foco em apps iOS e Android. Trabalha em projetos inovadores, sempre buscando as melhores práticas e tecnologias.',
    },
    {
      name: 'Lucas Ethan Roberts',
      image: '',
      active: true,
      email: 'lucas.roberts@example.com',
      bio: 'Arquiteto de soluções, responsável por projetar e implementar infraestruturas escaláveis e seguras em grandes empresas de tecnologia.',
    },
    {
      name: 'Ethan Noah Evans',
      image: '',
      active: true,
      email: 'ethan.evans@example.com',
      bio: 'Product Manager com ampla experiência em startups e produtos digitais. Adora construir produtos centrados no usuário que resolvam problemas reais.',
    },
    {
      name: 'Harper Sophia Johnson',
      image: '',
      active: true,
      email: 'harper.johnson@example.com',
      bio: 'Engenheira de DevOps especializada em automatização de pipelines e implementação de sistemas ágeis. Trabalha para garantir a estabilidade e eficiência no ciclo de desenvolvimento.',
    },
    {
      name: 'William Jacob Moore',
      image: '',
      active: true,
      email: 'william.moore@example.com',
      bio: 'Cientista de dados apaixonado por inteligência artificial e machine learning. Ajuda as empresas a tomar decisões baseadas em dados robustos.',
    },
    {
      name: 'James Alexander Martinez',
      image: '',
      active: true,
      email: 'james.martinez@example.com',
      bio: 'Analista de segurança cibernética, focado em proteger as informações e sistemas contra ameaças e ataques. Certificado em várias áreas de segurança.',
    },
    {
      name: 'Avery Charlotte Garcia',
      image: '',
      active: true,
      email: 'avery.garcia@example.com',
      bio: 'Gerente de marketing com experiência em campanhas digitais e estratégias de crescimento. Focada em impulsionar a presença online e engajamento da marca.',
    },
  ],
  messages: [
    {
      uuid: '2a2b3c4d-5e6f-7g8h-9i0j-k1lmnopqrs',
      senderId: 220,
      receiverId: 5, // Avery Charlotte Garcia
      content: 'Avery, have you finalized the new marketing strategy?',
      createdAt: '2024-08-14T20:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '3b4c5d6e-7f8g-9h0i-1j2k-3l4m5n6o7p8q',
      senderId: 220, // Avery Charlotte Garcia
      receiverId: 5,
      content: 'Yes, I sent it over yesterday. Did you receive it?',
      createdAt: '2024-08-14T21:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '4c5d6e7f-8g9h-0i1j-2k3l-4m5n6o7p8q9r',
      senderId: 220,
      receiverId: 6, // Ethan Noah Evans
      content: 'Ethan, any updates on the product roadmap?',
      createdAt: '2024-08-14T21:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '5d6e7f8g-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
      senderId: 220,
      receiverId: 6, // Ethan Noah Evans
      content:
        "We're finalizing it by the end of this week. I'll send it to you soon.",
      createdAt: '2024-08-14T22:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '6e7f8g9h-0i1j-2k3l-4m5n-6o7p8q9r0s1t',
      senderId: 220,
      receiverId: 8, // Jacob William Wilson
      content: 'Jacob, please review the updated financial projections.',
      createdAt: '2024-08-14T22:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '7f8g9h0i-1j2k-3l4m-5n6o-7p8q9r0s1t2u',
      senderId: 220,
      receiverId: 8, // Jacob William Wilson
      content: "I'll take a look at them tomorrow morning and get back to you.",
      createdAt: '2024-08-14T23:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '8g9h0i1j-2k3l-4m5n-6o7p-8q9r0s1t2u3v',
      senderId: 220,
      receiverId: 9, // Lucas Ethan Roberts
      content: 'Lucas, can you send over the latest network diagrams?',
      createdAt: '2024-08-14T23:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '9h0i1j2k-3l4m-5n6o-7p8q-9r0s1t2u3v4w',
      senderId: 220,
      receiverId: 9, // Lucas Ethan Roberts
      content:
        "I'll have them ready for you by tomorrow. Is there anything else you need?",
      createdAt: '2024-08-15T00:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '0i1j2k3l-4m5n-6o7p-8q9r-0s1t2u3v4w5x',
      senderId: 220,
      receiverId: 7, // Liam Jacob Williams
      content: 'Liam, could you share the updated UI designs?',
      createdAt: '2024-08-15T00:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '1j2k3l4m-5n6o-7p8q-9r0s-1t2u3v4w5x6y',
      senderId: 220,
      receiverId: 7, // Liam Jacob Williams
      content:
        'The designs are almost done. I’ll send them over by the end of the day.',
      createdAt: '2024-08-15T01:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '2k3l4m5n-6o7p-8q9r-0s1t-2u3v4w5x6y7z',
      senderId: 220,
      receiverId: 2, // Oliver Benjamin Smith
      content: 'Oliver, have you checked the latest server logs?',
      createdAt: '2024-08-15T01:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '3l4m5n6o-7p8q-9r0s-1t2u-3v4w5x6y7z8a',
      senderId: 220, // Oliver Benjamin Smith
      receiverId: 2,
      content: "I’m reviewing them now. I'll update you shortly.",
      createdAt: '2024-08-15T02:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '4m5n6o7p-8q9r-0s1t-2u3v-4w5x6y7z8a9b',
      senderId: 220,
      receiverId: 3, // Mia Isabella Jackson
      content: "Mia, how's the AI model training going?",
      createdAt: '2024-08-15T02:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '5n6o7p8q-9r0s-1t2u-3v4w-5x6y7z8a9b0c',
      senderId: 220, // Mia Isabella Jackson
      receiverId: 3,
      content:
        "It's progressing well. I'll have the preliminary results by next week.",
      createdAt: '2024-08-15T03:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '6o7p8q9r-0s1t-2u3v-4w5x-6y7z8a9b0c1d',
      senderId: 220,
      receiverId: 4, // Ava Emily Thomas
      content: 'Ava, can you update me on the project timeline?',
      createdAt: '2024-08-15T03:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '7p8q9r0s-1t2u-3v4w-5x6y-7z8a9b0c1d2e',
      senderId: 220, // Ava Emily Thomas
      receiverId: 4,
      content:
        'The timeline is on track. I’ll send a detailed update by the end of the day.',
      createdAt: '2024-08-15T04:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '8q9r0s1t-2u3v-4w5x-6y7z-8a9b0c1d2e3f',
      senderId: 220,
      receiverId: 5, // Avery Charlotte Garcia
      content: 'Avery, please confirm the schedule for the upcoming campaign.',
      createdAt: '2024-08-15T04:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '9r0s1t2u-3v4w-5x6y-7z8a-9b0c1d2e3f4g',
      senderId: 220, // Avery Charlotte Garcia
      receiverId: 5,
      content: 'I’ll send the finalized schedule tomorrow morning.',
      createdAt: '2024-08-15T05:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '0s1t2u3v-4w5x-6y7z-8a9b-0c1d2e3f4g5h',
      senderId: 220,
      receiverId: 6, // Ethan Noah Evans
      content: 'Ethan, are we on track for the next milestone?',
      createdAt: '2024-08-15T05:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '1t2u3v4w-5x6y-7z8a-9b0c-1d2e3f4g5h6i',
      senderId: 220, // Ethan Noah Evans
      receiverId: 6,
      content: 'Yes, we’re on track. I’ll update the milestones accordingly.',
      createdAt: '2024-08-15T06:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '2u3v4w5x-6y7z-8a9b-0c1d-2e3f4g5h6i7j',
      senderId: 220,
      receiverId: 7, // Liam Jacob Williams
      content: 'Liam, could you provide an update on the graphic designs?',
      createdAt: '2024-08-15T06:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '3v4w5x6y-7z8a-9b0c-1d2e-3f4g5h6i7j8k',
      senderId: 220, // Liam Jacob Williams
      receiverId: 7,
      content: 'The designs are nearly finished. I’ll share them soon.',
      createdAt: '2024-08-15T07:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '4w5x6y7z-8a9b-0c1d-2e3f-4g5h6i7j8k9l',
      senderId: 220,
      receiverId: 8, // Jacob William Wilson
      content: 'Jacob, when will you be able to submit the financial analysis?',
      createdAt: '2024-08-15T07:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '5x6y7z8a-9b0c-1d2e-3f4g-5h6i7j8k9l0m',
      senderId: 220, // Jacob William Wilson
      receiverId: 8,
      content: 'I’ll have the analysis ready by the end of the day.',
      createdAt: '2024-08-15T08:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '6y7z8a9b-0c1d-2e3f-4g5h-6i7j8k9l0m1n',
      senderId: 220,
      receiverId: 9, // Lucas Ethan Roberts
      content: 'Lucas, please provide the latest updates on network security.',
      createdAt: '2024-08-15T08:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '7z8a9b0c-1d2e-3f4g-5h6i-7j8k9l0m1n2o',
      senderId: 220, // Lucas Ethan Roberts
      receiverId: 9,
      content:
        'We’re implementing some new protocols. I’ll send the details later.',
      createdAt: '2024-08-15T09:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: '8a9b0c1d-2e3f-4g5h-6i7j-8k9l0m1n2o3p',
      senderId: 220,
      receiverId: 10, // Amelia Emily Brown
      content: 'Amelia, do you need any support with the upcoming audit?',
      createdAt: '2024-08-15T09:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: '9b0c1d2e-3f4g-5h6i-7j8k-9l0m1n2o3p4q',
      senderId: 220, // Amelia Emily Brown
      receiverId: 10,
      content: 'I’m all set for the audit. Thanks for checking in!',
      createdAt: '2024-08-15T10:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'a1b2c3d4-5e6f-7g8h-9i0j-k1lmnopqrst',
      senderId: 220,
      receiverId: 2, // Oliver Benjamin Smith
      content: 'Oliver, can you give me an update on the database migration?',
      createdAt: '2024-08-15T10:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'b2c3d4e5-6f7g-8h9i-0j1k-l2m3nopqrs',
      senderId: 220, // Oliver Benjamin Smith
      receiverId: 2,
      content:
        'The migration is progressing smoothly. I expect it to be completed by next week.',
      createdAt: '2024-08-15T11:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'c3d4e5f6-7g8h-9i0j-1k2l-m3nopqrs4t',
      senderId: 220,
      receiverId: 3, // Mia Isabella Jackson
      content: 'Mia, are there any blockers in the AI model development?',
      createdAt: '2024-08-15T11:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'uvwx1y2z-3a4b-5c6d-7e8f-9g0h1i2j3k4',
      senderId: 220,
      receiverId: 3, // Mia Isabella Jackson
      content: 'Do you need help?',
      createdAt: '2024-08-15T11:31:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'd4e5f6g7-8h9i-0j1k-2l3m-nopqrs4t5u',
      senderId: 220, // Mia Isabella Jackson
      receiverId: 3,
      content: 'No major blockers. Just a few minor adjustments needed.',
      createdAt: '2024-08-15T12:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'wx1y2z3a-4b5c-6d7e-8f9g-0h1i2j3k4l5',
      senderId: 220, // Mia Isabella Jackson
      receiverId: 3,
      content: "I'll let you know if I need anything.",
      createdAt: '2024-08-15T12:01:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'wx1y2z3a-4b5c-6d7e-8f9g-0h1i2j3k4l5',
      senderId: 220, // Mia Isabella Jackson
      receiverId: 3,
      content: audio2,
      createdAt: '2024-08-15T12:01:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'wx1y2z3a-4b5c-6d7e-8f9g-0h1i2j3k4l5',
      senderId: 220, // Mia Isabella Jackson
      receiverId: 3,
      content: audio2,
      createdAt: '2024-08-15T12:01:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'e5f6g7h8-9i0j-1k2l-3m4n-opqrs4t5u6v',
      senderId: 220,
      receiverId: 4, // Ava Emily Thomas
      content: 'Ava, can you confirm the status of the marketing materials?',
      createdAt: '2024-08-15T12:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'f6g7h8i9-0j1k-2l3m-4n5o-pqrs4t5u6v7w',
      senderId: 220, // Ava Emily Thomas
      receiverId: 4,
      content:
        'The materials are ready and will be distributed by the end of the day.',
      createdAt: '2024-08-15T13:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'g7h8i9j0-1k2l-3m4n-5o6p-qrstu7v8w9x',
      senderId: 220,
      receiverId: 5, // Avery Charlotte Garcia
      content: 'Avery, did you receive the latest design mockups?',
      createdAt: '2024-08-15T13:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'h8i9j0k1-2l3m-4n5o-6p7q-rstu8v9w0x1y',
      senderId: 220, // Avery Charlotte Garcia
      receiverId: 5,
      content: 'Yes, I have them. I’ll review and get back to you.',
      createdAt: '2024-08-15T14:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'i9j0k1l2-3m4n-5o6p-7q8r-stu9v0w1x2y',
      senderId: 220,
      receiverId: 6, // Ethan Noah Evans
      content: 'Ethan, can you send me the latest project status report?',
      createdAt: '2024-08-15T14:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'j0k1l2m3-4n5o-6p7q-8r9s-tuv0w1x2y3z',
      senderId: 220, // Ethan Noah Evans
      receiverId: 6,
      content: 'I’ll send it over by the end of the day.',
      createdAt: '2024-08-15T15:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'k1l2m3n4-5o6p-7q8r-9s0t-uvw1x2y3z4a',
      senderId: 220,
      receiverId: 7, // Liam Jacob Williams
      content: 'Liam, have you finalized the new branding guidelines?',
      createdAt: '2024-08-15T15:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'l2m3n4o5-6p7q-8r9s-0tuv-wx1y2z3a4b5',
      senderId: 220, // Liam Jacob Williams
      receiverId: 7,
      content:
        'Yes, the guidelines are finalized. I’ll share them with you shortly.',
      createdAt: '2024-08-15T16:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'm3n4o5p6-7q8r-9s0t-uvw1-x2y3z4a5b6c',
      senderId: 220,
      receiverId: 8, // Jacob William Wilson
      content: 'Jacob, when will the financial review be completed?',
      createdAt: '2024-08-15T16:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'n4o5p6q7-8r9s-0tuv-wx1y-2z3a4b5c6d7',
      senderId: 220, // Jacob William Wilson
      receiverId: 8,
      content: 'I’ll have it completed by tomorrow morning.',
      createdAt: '2024-08-15T17:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'o5p6q7r8-9s0t-uvw1-x2y3-z4a5b6c7d8e',
      senderId: 220,
      receiverId: 9, // Lucas Ethan Roberts
      content: 'Lucas, are there any issues with the current security setup?',
      createdAt: '2024-08-15T17:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'p6q7r8s9-0tuv-wx1y-2z3a-4b5c6d7e8f9',
      senderId: 220, // Lucas Ethan Roberts
      receiverId: 9,
      content: 'No issues so far. Everything is functioning as expected.',
      createdAt: '2024-08-15T18:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'q7r8s9t0-uvwx-y1z2-a3b4-c5d6e7f8g9h',
      senderId: 220,
      receiverId: 10, // Amelia Emily Brown
      content: 'Amelia, any updates on the audit preparation?',
      createdAt: '2024-08-15T18:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'r8s9t0uv-wx1y-2z3a-b4c5-d6e7f8g9h0i',
      senderId: 220, // Amelia Emily Brown
      receiverId: 10,
      content:
        'Everything is on track. I’ll finalize the documents by tomorrow.',
      createdAt: '2024-08-15T19:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 's9t0uvwx-y1z2-3a4b-5c6d-7e8f9g0h1i2',
      senderId: 220,
      receiverId: 2, // Oliver Benjamin Smith
      content: 'Oliver, have you completed the database optimization?',
      createdAt: '2024-08-15T19:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 't0uvwx1y-2z3a-4b5c-6d7e-8f9g0h1i2j3',
      senderId: 220, // Oliver Benjamin Smith
      receiverId: 2,
      content:
        'Yes, the optimization is complete. Everything is running smoothly.',
      createdAt: '2024-08-15T20:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'x1y2z3a4-5b6c-7d8e-9f0g-1h2i3j4k5l6',
      senderId: 220,
      receiverId: 4, // Ava Emily Thomas
      content:
        'Ava, are the promotional materials aligned with the latest guidelines?',
      createdAt: '2024-08-15T21:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'y2z3a4b5-6c7d-8e9f-0g1h-2i3j4k5l6m7',
      senderId: 220, // Ava Emily Thomas
      receiverId: 4,
      content: 'Yes, they are aligned. The design and content are up to date.',
      createdAt: '2024-08-15T22:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'z3a4b5c6-7d8e-9f0g-1h2i-3j4k5l6m7n8',
      senderId: 220,
      receiverId: 5, // Avery Charlotte Garcia
      content:
        'Avery, can you review the latest updates to the project timeline?',
      createdAt: '2024-08-15T22:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'a4b5c6d7-8e9f-0g1h-2i3j-4k5l6m7n8o9',
      senderId: 220, // Avery Charlotte Garcia
      receiverId: 5,
      content: 'I’ll review them and get back to you tomorrow morning.',
      createdAt: '2024-08-15T23:00:00',
      read: false,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'b5c6d7e8-9f0g-1h2i-3j4k-5l6m7n8o9p0',
      senderId: 220,
      receiverId: 6, // Ethan Noah Evans
      content:
        'Ethan, can you ensure that the latest updates are included in the report?',
      createdAt: '2024-08-15T23:30:00',
      read: true,
      deleted: false,
      type: 'sent',
    },
    {
      uuid: 'c6d7e8f9-0g1h-2i3j-4k5l-6m7n8o9p0q1',
      senderId: 220, // Ethan Noah Evans
      receiverId: 6,
      content:
        'Yes, I’ll make sure everything is included before sending it out.',
      createdAt: '2024-08-16T00:00:00',
      read: true,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'c6d7e8f9-0g1h-2i3j-4k5l-6m7n8o9p0q1',
      senderId: 220,
      receiverId: 1,
      content: audio1,
      createdAt: '2024-08-16T09:37:10',
      read: false,
      deleted: false,
      type: 'received',
    },
    {
      uuid: 'c6d7e8f9-0g1h-2i3j-4k5l-6m7n8o9p0q1',
      senderId: 220,
      receiverId: 1,
      content: 'When you can, signal here so we can go to that call.',
      createdAt: '2024-08-16T09:37:18',
      read: false,
      deleted: false,
      type: 'received',
    },
  ],
  emails: [
    {
      uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      sender: {
        name: 'Sarah Wins',
        image:
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'olivia_vera_jesus@hot.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Approved Oral Support Thesis',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-09-29 13:28:54',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: false,
      },
    },
    {
      uuid: '29b46d80-4eb1-43d6-bbb7-7f57b75d17b1',
      sender: {
        name: 'Emmilly Lins',
        image:
          'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'aline_lais@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Declaration For Qualification In Process',
      message: 'Lorem Ipsum is simply',
      date: '2023-09-29 15:27:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: false,
      },
    },
    {
      uuid: '7a1ef81b-06a4-4c6d-a5bc-e7697b7a1bb6',
      sender: {
        name: 'Jennyfer Whatson',
        image:
          'https://images.unsplash.com/photo-1630255733038-0eaa251036c9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'jennyfer_whatson@hotmail.fr',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Communication Secretarye',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></br><p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p></br><p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      date: '2023-09-26 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: true,
        postponed: false,
        important: false,
        read: false,
      },
    },
    {
      uuid: 'da7a8f38-8b47-47c0-8935-b967028b4b68',
      sender: {
        name: 'Cláudio Dias',
        image: '',
        email: 'claudio.dias@hidrara.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Southern Rails Project',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-09-13 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: true,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '2c6d2c1e-851b-4f65-8e6c-ec76f9b38efc',
      sender: {
        name: 'Luan Isaac Olivera',
        image:
          'https://images.unsplash.com/photo-1583692331507-fc0bd348695d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'luan_isaac_ferreira@itau.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Payment Voucher',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-04-03 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: false,
      },
    },
    {
      uuid: 'd07536e4-9e36-4e7b-87db-6e8b9a77c894',
      sender: {
        name: 'Aline Laís Galvão',
        image:
          'https://images.unsplash.com/photo-1613365765813-e29fea16ecaa?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'aline_lais_galvao@peg.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Declaration For Qualification In Process',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-04-12 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'b8b68f39-fb0e-43bc-9349-5481e3b5b87f',
      sender: {
        name: 'Olivia Vera Jesus',
        image:
          'https://images.unsplash.com/photo-1614436086835-d18683eb24f8?q=80&w=1914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        email: 'olivia_vera_jesus@crbrandao.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Approved Oral Support Thesis',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-04-09 18:39:11',
      type: 'send',
      attachments: [],
      status: {
        starred: true,
        postponed: false,
        important: false,
        folder: 'send',
        read: true,
      },
    },
    {
      uuid: '9f82492a-e67b-40a7-8c81-586c02decb8f',
      sender: {
        name: 'Regina Hadassa Duarte',
        image: '',
        email: 'regina_duarte@dyna.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Faculty Writing',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-03-28 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: true,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '7e91716b-7dbe-4b2a-92d5-fd4e6dcdff96',
      sender: {
        name: 'Tomás Cláudio Rodrigues',
        image: '',
        email: 'tomas_rodrigues@pobox.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Effective Public Policy Applications',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-03-19 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '4b64e5e0-f287-4b1b-9d3f-08a3cf449724',
      sender: {
        name: 'Manoel Matheus Nogueira',
        image: '',
        email: 'manoel_matheus_nogueira@mais.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Sustainable Socio-Economic Growth',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-03-08 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'd7a1a5c8-44f6-490d-b1b5-4e53efedfb27',
      sender: {
        name: 'Stefanny Bitencurt',
        image: '',
        email: 'stefanny_bitencurt@dyna.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Faculty Writing',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-05-28 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'b28e4e0c-08a0-4b3b-b5b6-2e14a10e4f7f',
      sender: {
        name: 'Juan Benedito Campos',
        image: '',
        email: 'juan.benedito.campos@gba.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Introduction Letter To The Magistrate',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-02-10 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'e5f1f8a7-cf76-4426-8934-4b89fc644a85',
      sender: {
        name: 'Lucca Nascimento',
        image: '',
        email: 'lucca_nascimento@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Targeted National Action Plans',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-02-09 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'fc967cf0-83e5-4ac0-9c6d-2a7a7411a77b',
      sender: {
        name: 'Luís Gustavo Castro',
        image: '',
        email: 'luis_gustavo_castro@itau.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Mineral Research Grant',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-02-01 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '7e5a697c-124f-4fa7-a6a1-b1e8e3c8edb6',
      sender: {
        name: 'Luís Gustavo Castro',
        image: '',
        email: 'luis_gustavo_castro@universidade.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Research Degreee',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-25 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'e3a7b8a6-d8a1-4c68-a5e2-3e84b5e1cf1c',
      sender: {
        name: 'João Guilherme Luiz',
        image: '',
        email: 'joao_guilherme_luiz@engie.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Calendar Of Public Events',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-12 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '15e4f24d-37f4-4e9a-8727-e091b2ef6f9f',
      sender: {
        name: 'Raimunda da Costa',
        image: '',
        email: 'raimunda_da_costa@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Affordable Housing Project',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-01 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '1a983d41-7f9d-493c-a5c4-89c2a00d5a1a',
      sender: {
        name: 'Erick Costa',
        image: '',
        email: 'erick_costa@cp.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Mineral Research Grant',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-11 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'd4f2d6a1-1c5d-434c-bfd8-1b9586b9d028',
      sender: {
        name: 'João Silva',
        image: '',
        email: 'joao_silva@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Cultural Arts Fund',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-09 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: true,
        read: true,
      },
    },
    {
      uuid: 'b08d54c7-82cb-4e6a-a2c2-4f796688f29a',
      sender: {
        name: 'Maria Julia Assunção',
        image: '',
        email: 'maria_julia_assuncao@juridico.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Effect of The Investigation',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-02 18:39:11',
      type: 'inbox',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: 'bc72ebae-22a0-4e7b-873f-032e263dbda4',
      sender: {
        name: 'Sarah Souza',
        image: '',
        email: 'sarah.souza@lcr.com.br',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Receipt and Payment Statement',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2023-01-01 18:39:11',
      type: 'send',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        folder: 'send',
        read: true,
      },
    },
    {
      uuid: '6e3c4b9d-19f6-4d0a-b8a3-4efb0c70550a',
      sender: {
        name: 'André Luis Baptista',
        image: '',
        email: 'andre_luis_baptista@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Contribution to the Araguainha National Park',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2022-12-30 18:39:11',
      type: 'trash',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
    {
      uuid: '0b368f41-2a02-4a6b-9b8b-4539dce927f3',
      sender: {
        name: 'Marcos Vinicius',
        image: '',
        email: 'marcos_vinicius@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Employment Opportunities',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2022-12-25 18:39:11',
      type: 'trash',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        deleted: true,
        read: true,
      },
    },
    {
      uuid: '89c5e6b7-8092-482e-b5d4-e476f6d86bb2',
      sender: {
        name: 'Raphael Morais',
        image: '',
        email: 'raphael_morais@cc.com',
      },
      recipient: {
        name: 'Carolina Ferreira',
        email: 'ferreira.carolina@hot.com',
      },
      subject: 'Reminder',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      date: '2022-12-20 18:39:11',
      type: 'trash',
      attachments: [],
      status: {
        starred: false,
        postponed: false,
        important: false,
        read: true,
      },
    },
  ],
  folders: [
    {
      hash: 'd3c3b69a-bb3b-4f7e-9f3d-52d3d7a9bce3',
      name: 'Archived Photos',
      fileCount: 678,
      size: '4GB',
      icon: '',
      files: [
        {
          name: 'Atlassian Git Cheatsheet',
          type: 'application/pdf',
          url: loadFile('files/atlassian-git-cheatsheet.pdf'),
          createdAt: '2023-04-02 00:00:00',
          updatedAt: '2023-04-02 00:00:00',
        },
        {
          name: 'Visao do sistema Plus Car',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          url: loadFile('files/Visao Do Sistema Plus Car.docx'),
          createdAt: '2023-03-09 00:00:00',
          updatedAt: '2023-03-09 00:00:00',
        },
      ],
      createdAt: '2024-09-24 10:00:00',
      updatedAt: '2024-09-24 10:00:00',
      subfolders: [
        {
          hash: 'd60caa5a-69a6-46c9-9c48-3d47c46ec8bc',
          name: '2023',
          fileCount: 200,
          size: '1GB',
          icon: '',
          files: [
            {
              name: 'Visao do sistema Plus Car',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: loadFile('files/Visao Do Sistema Plus Car.docx'),
              createdAt: '2023-03-09 00:00:00',
              updatedAt: '2023-03-09 00:00:00',
            },
          ],
          createdAt: '2024-09-24 10:05:00',
          updatedAt: '2024-09-24 10:05:00',
          subfolders: [
            {
              hash: '1ab1b4f0-8f4d-4c47-8ab5-cf98b3ee8c9a',
              name: 'January',
              fileCount: 100,
              size: '500MB',
              icon: '',
              files: [
                {
                  name: 'Pianchette Top',
                  type: 'image/jpeg',
                  url: loadFile('files/pianchette-top.jpeg'),
                  createdAt: '2022-06-08 00:00:00',
                  updatedAt: '2022-06-08 00:00:00',
                },
              ],
              createdAt: '2024-09-24 10:10:00',
              updatedAt: '2024-09-24 10:10:00',
              subfolders: [
                {
                  hash: 'fb3b2f76-1747-4c6d-910c-5b5079db49ea',
                  name: 'Vacations',
                  fileCount: 50,
                  size: '250MB',
                  icon: '',
                  files: [
                    {
                      name: 'Um Arquivo Simples',
                      type: 'text/plain',
                      url: loadFile('files/um-arquivo-simples.txt'),
                      createdAt: '2023-11-12 00:00:00',
                      updatedAt: '2023-11-12 00:00:00',
                    },
                  ],
                  createdAt: '2024-09-24 10:15:00',
                  updatedAt: '2024-09-24 10:15:00',
                },
              ],
            },
            {
              hash: 'd2bb8576-2a6e-4a8d-949f-733bb5c9c8c4',
              name: 'February',
              fileCount: 100,
              size: '500MB',
              icon: '',
              files: [
                {
                  name: 'Pianchette Top',
                  type: 'image/jpeg',
                  url: loadFile('files/pianchette-top.jpeg'),
                  createdAt: '2022-06-08 00:00:00',
                  updatedAt: '2022-06-08 00:00:00',
                },
              ],
              createdAt: '2024-09-24 10:20:00',
              updatedAt: '2024-09-24 10:20:00',
            },
          ],
        },
      ],
    },
    {
      hash: 'a1e915e3-73c1-4c14-bb8f-0f4c1c63613d',
      name: 'Media Library',
      fileCount: 945,
      size: '10.1GB',
      icon: '',
      files: [],
      createdAt: '2024-09-24 10:25:00',
      updatedAt: '2024-09-24 10:25:00',
      subfolders: [
        {
          hash: 'd01d3036-5e54-4e35-9623-3be0b1b78bc1',
          name: 'Videos',
          fileCount: 500,
          size: '5GB',
          icon: '',
          files: [],
          createdAt: '2024-09-24 10:30:00',
          updatedAt: '2024-09-24 10:30:00',
          subfolders: [
            {
              hash: 'ba38f9c7-cd89-4a14-b8eb-d3c0c81f0d56',
              name: 'Projects',
              fileCount: 200,
              size: '2GB',
              icon: '',
              files: [],
              createdAt: '2024-09-24 10:35:00',
              updatedAt: '2024-09-24 10:35:00',
            },
            {
              hash: '4deef6b3-4aa3-4ff6-831e-e06b49d2cb7f',
              name: 'Tutorials',
              fileCount: 300,
              size: '3GB',
              icon: '',
              files: [],
              createdAt: '2024-09-24 10:40:00',
              updatedAt: '2024-09-24 10:40:00',
            },
          ],
        },
      ],
    },
    {
      hash: 'c03a83be-f627-4857-b0ff-7c4c75cb4202',
      name: 'UIHUT Assets',
      fileCount: 467,
      size: '1GB',
      icon: '',
      files: [],
      createdAt: '2024-09-24 10:45:00',
      updatedAt: '2024-09-24 10:45:00',
      subfolders: [
        {
          hash: 'e78f36b1-55bb-4388-b70d-8acbc9ae1f40',
          name: 'Icons',
          fileCount: 300,
          size: '700MB',
          icon: '',
          files: [],
          createdAt: '2024-09-24 10:50:00',
          updatedAt: '2024-09-24 10:50:00',
          subfolders: [
            {
              hash: 'd9d7e5c6-f11e-47a0-a12d-38e2255a24e0',
              name: 'Flat',
              fileCount: 100,
              size: '200MB',
              icon: '',
              files: [],
              createdAt: '2024-09-24 10:55:00',
              updatedAt: '2024-09-24 10:55:00',
            },
            {
              hash: 'd72b8aa3-5a9f-4c65-b15f-8fc5730bb6bc',
              name: '3D',
              fileCount: 200,
              size: '500MB',
              icon: '',
              files: [],
              createdAt: '2024-09-24 11:00:00',
              updatedAt: '2024-09-24 11:00:00',
            },
          ],
        },
        {
          hash: '8e8c6390-76c5-4a57-8265-90f7cfbb458c',
          name: 'Illustrations',
          fileCount: 167,
          size: '300MB',
          icon: '',
          files: [],
          createdAt: '2024-09-24 11:05:00',
          updatedAt: '2024-09-24 11:05:00',
        },
      ],
    },
    {
      hash: '7e928e69-d65e-4e73-bf91-ecbc21b2f74a',
      name: 'App Development',
      fileCount: 1048,
      size: '18GB',
      icon: '',
      files: [],
      createdAt: '2024-09-24 11:10:00',
      updatedAt: '2024-09-24 11:10:00',
      subfolders: [
        {
          hash: '4b8cf4be-68d2-4e86-b17e-b0bc8ed404c0',
          name: 'Frontend',
          fileCount: 600,
          size: '10GB',
          icon: '',
          files: [
            {
              name: 'Bebida soda vidro',
              type: 'video/mp4',
              url: loadFile('files/bebida-soda-vidro.mp4'),
              createdAt: '2022-06-08 00:00:00',
              updatedAt: '2022-06-08 00:00:00',
            },
            {
              name: 'Esfera forma',
              type: 'video/mp4',
              url: loadFile('files/esfera-forma.mp4'),
              createdAt: '2022-06-08 00:00:00',
              updatedAt: '2022-06-08 00:00:00',
            },
            {
              name: 'Pianchette Top',
              type: 'image/jpeg',
              url: loadFile('files/pianchette-top.jpeg'),
              createdAt: '2022-06-08 00:00:00',
              updatedAt: '2022-06-08 00:00:00',
            },
          ],
          createdAt: '2024-09-24 11:15:00',
          updatedAt: '2024-09-24 11:15:00',
          subfolders: [
            {
              hash: '6579c02e-fbc0-4d52-8cb9-52da64accc87',
              name: 'React Components',
              fileCount: 300,
              size: '5GB',
              icon: '',
              files: [
                {
                  name: 'Um Olhar Profundo',
                  type: 'text/plain',
                  url: loadFile('files/um-olhar-profundo.txt'),
                  createdAt: '2023-11-12 00:00:00',
                  updatedAt: '2023-11-12 00:00:00',
                },
              ],
              createdAt: '2024-09-24 11:20:00',
              updatedAt: '2024-09-24 11:20:00',
            },
            {
              hash: '22e0474b-cd34-4e31-973c-23e49f90c1b2',
              name: 'HTML Templates',
              fileCount: 300,
              size: '5GB',
              icon: '',
              files: [],
              createdAt: '2024-09-24 11:25:00',
              updatedAt: '2024-09-24 11:25:00',
            },
          ],
        },
        {
          hash: '0f18cbfc-5654-4b2c-b66a-6633fdf74f4b',
          name: 'Backend',
          fileCount: 448,
          size: '8GB',
          icon: '',
          files: [],
          createdAt: '2024-09-24 11:30:00',
          updatedAt: '2024-09-24 11:30:00',
        },
      ],
    },
    {
      hash: '7b1baf53-3ec0-4b25-9b5e-c68c41734e67',
      name: 'Landing Page Concepts',
      fileCount: 46,
      size: '500MB',
      icon: '',
      files: [],
      createdAt: '2024-09-24 11:35:00',
      updatedAt: '2024-09-24 11:35:00',
    },
    {
      hash: '8f7e5c4b-46d8-4a7e-9a9f-bc7c3e12c35e',
      name: 'Design Assets',
      fileCount: 200,
      size: '2GB',
      icon: '',
      files: [],
      createdAt: '2024-09-24 11:40:00',
      updatedAt: '2024-09-24 11:40:00',
    },
  ],
  files: [
    {
      name: 'Bebida soda vidro',
      type: 'video/mp4',
      url: loadFile('files/bebida-soda-vidro.mp4'),
      createdAt: '2022-06-08 00:00:00',
      updatedAt: '2022-06-08 00:00:00',
    },
    {
      name: 'Esfera forma',
      type: 'video/mp4',
      url: loadFile('files/esfera-forma.mp4'),
      createdAt: '2022-06-08 00:00:00',
      updatedAt: '2022-06-08 00:00:00',
    },
    {
      name: 'Pianchette Top',
      type: 'image/jpeg',
      url: loadFile('files/pianchette-top.jpeg'),
      createdAt: '2022-06-08 00:00:00',
      updatedAt: '2022-06-08 00:00:00',
    },
    {
      name: 'Rocks 82',
      type: 'image/jpeg',
      url: loadFile('files/rocks-82.jpeg'),
      createdAt: '2022-06-08 00:00:00',
      updatedAt: '2022-06-08 00:00:00',
    },
    {
      name: 'Squirrel 82',
      type: 'image/jpeg',
      url: loadFile('files/squirrel-82.jpeg'),
      createdAt: '2022-06-08 00:00:00',
      updatedAt: '2022-06-08 00:00:00',
    },
    {
      name: 'Atlassian Git Cheatsheet',
      type: 'application/pdf',
      url: loadFile('files/atlassian-git-cheatsheet.pdf'),
      createdAt: '2023-04-02 00:00:00',
      updatedAt: '2023-04-02 00:00:00',
    },
    {
      name: 'Visao do sistema Plus Car',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      url: loadFile('files/Visao Do Sistema Plus Car.docx'),
      createdAt: '2023-03-09 00:00:00',
      updatedAt: '2023-03-09 00:00:00',
    },
    {
      name: 'Chill Abstract Intention 12099',
      type: 'audio/mpeg',
      url: loadFile('files/chill-abstract-intention-12099.mp3'),
      createdAt: '2023-01-18 00:00:00',
      updatedAt: '2023-01-18 00:00:00',
    },
    {
      name: 'Um Arquivo Simples',
      type: 'text/plain',
      url: loadFile('files/um-arquivo-simples.txt'),
      createdAt: '2023-11-12 00:00:00',
      updatedAt: '2023-11-12 00:00:00',
    },
    {
      name: 'Um Olhar Profundo',
      type: 'text/plain',
      url: loadFile('files/um-olhar-profundo.txt'),
      createdAt: '2023-11-12 00:00:00',
      updatedAt: '2023-11-12 00:00:00',
    },
  ],
  transactions: [
    {
      name: 'Figma Professional',
      transactionType: 'Credit Card',
      amount: 892.39,
      userId: 4,
      status: 'Completed',
      image:
        'https://th.bing.com/th?id=ODLS.2f080fa9-af5f-4053-8681-960b2d81f541&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2',
      createdAt: '2024-09-19 13:45:27',
    },
    {
      name: 'Jira Software',
      transactionType: 'Credit Card',
      amount: 499.99,
      userId: 2,
      status: 'Pending',
      image:
        'https://wac-cdn-bfldr.atlassian.com/K3MHR9G8/at/x9c9r3mmgx46sk3ktqt7rj/Jira_2x.png?auto=webp&format=png',
      createdAt: '2024-09-02 14:25:27',
    },
    {
      name: 'Chat GPT',
      transactionType: 'Credit Card',
      amount: 238.39,
      userId: 5,
      status: 'Completed',
      image:
        'data:image/webp;base64,UklGRlQFAABXRUJQVlA4IEgFAADwGQCdASpAAEAAPjEOjEYiEREKACADBLSAat+1n4M99HtP6zfuf7AToj6s/Zfx3/dT/c84O8I/i385/Hb9uf+Bx4uAf1z+q+oF6d/LP8Z+XWsg/pf9z/NHmBu+vUj/rv+m+1X6Nv1L/a/279yPVT+Uf2b/d/2z4Av4v/Lf8P/dv3D/yH/7+oD16fsP7JH6qLHtxrD6Us80lbaChqOpdV4sxmSL0U5Zyknvz8QYzBmslU/GXpV+Q0DiHENgEgOcZ7pHbEqZdhLcrhTkcVBYIEfuckviHL5CaIAA/v9gG///2PAQE/5u/6/fN4RD/M7Ajf6Zi1yfoBV7Vjdjjib29PxLx3Ub/xSNS2psIyVpXOFR23pn1KJ6RiDkcd9Y+XRHHdOwxIcixIryGX5rOKoAwJc0YGZTbo9eaqWEt9qc7Nwwb9HeXv7mSAXQ3MVEF01Hwk7P80vnitrPAR1qs9GtbdWNP1GpWCRFKg4EC6vpN9peygxvQ2TSeHn/cVW2Fm4QyFy/7AjDydI1w3vaB1vv9N/VNucOgVhGPBvAJo5ZjHbl7BHENeRLeOJXFIRZ7JxewH4zUmZsp3YTxQOuXZcYzTm6QPdmIEvavEeebeYEw3eT7nr9hhtXMikK4eIZ/psGLtaZrz8H9D3o74Q2cjm4oUcEO2m5UVTr+j2rfVe0DXLUPmhpz8FNje+dRCLJBQCSmOGWncfBhOnum0O+Mw308TnQFZC2Z1f5/ZrJ4SWezGULJZFBOF7yI/fHPI4QxfhrhnZ8byQ99b9I+fN65l2XTGHTe/bo39OcIL7kZ0fCLFql1o//Fs60xrnMK3W0e2Uzls9N8bETGCcmtIKZ3icCz9JyayA6cJ1Hv0Hiz4itnXZ2ICfiRxJYpYBvoFMwXueneiq3OTZS+Kxi4HH5441LDndM+weAfeA7Gdghg56JoKlmouissktBN4Fnx/rmldYfDBOInQvEBr0QC0s1h3QDdHaC9trRhWfbFMHwx0HuZZMPpfMIqCOBgNjFsj4EbE4kOKywy8uBS8lvpcLOP2XKeZwKNwm93QEhlrMNQRKhZqWcaoplIDPHcm6a6RyBRJWnKpl8akn/yRfJHrXAREA70ms/0hDi0JiqnJC0zHM6j8PVilITIyyAOrCqH2EDgp+p/BqZMnuyZlqm5O1e772HjLWevs0lYYqRLX/rvH5kgntbFcXdC9ngOf1rBfzb+Ew0jJkRkpvBEBPLZH8nYZ+iHl6OcjRoqP+BVLOoXd+R0tc9iBPjdMU40cz7K51GEOJ45NERBlX2coV/sOrcW9/SwYiZs7C/kiAlRfCuv6EFK/a9V+J/VQfCsdKlW6JD+v6xj+XL+/cHVPg2nZSNp/+yBUB3Wpwv/40w/k3C6PXKDqNI9cUAg29XTyRK9cPDJAE4Mq7CA3y/s90og9Kjkr7zKalvBP6DvCRoHSyX/lzFB5VIEjMxH6BDL48ZjTzSjRHT9nxtTEzTrGCXkbbio1P1avcFtz48Ma6YuDHX+GGr8lFC5vAdiUWOonQ2kSaxETK/8q0/8iJ+//zaYX5TvlmKiHufkNCPgZFG1b8s0iPZ46sLuQC6j6RSYfN5E1R8hLHnuCewAe9GqAPZTOytEMEnNQ5WNanuYML8uwxJ2rFd4P6BvIeSeaTGe3CHvPZh2vsX3kfY3CXnOlmsjdrUJYyW0xG2nSSbFTX0LiH7/jd9F2mJZc4iWDOXykyoK74odrEg2J6t9zq50fUlq63rQkN0TH0OYoB//rZVNoqaEpL6TNpt5B3O6BzWGwOmRtdoTx2UjuEAD7XWRAAAAA==',
      createdAt: '2024-08-22 18:45:27',
    },
    {
      name: 'Git Lab - Security and compliance',
      transactionType: 'Bank Transfer',
      amount: 1283.98,
      userId: 1,
      status: 'Completed',
      image:
        'data:image/webp;base64,UklGRpgFAABXRUJQVlA4WAoAAAAQAAAANwAANwAAQUxQSBkCAAARkCzJtmlbc1/btu17W8/u2bZt2+81bdu2bdu2/Y7WbJy9/AMRMQFA9/EFBX1BoOuiKwPlDbw215tvCKKji6w2iNiH7zYiXg+S43sbEe9yZSIi/iuTU/YTETGLZ5oT9pAzjDjN4Ah6Z7JXinEMnb8GsXVA05+JMhJ+m2ADthNm2FRGazTfxxSB1O2GOGMtxRLPMpj2NUNczlsKDmbweEDD/uIm22h3fGnVkfGAuONIt9ehHWD5lScq6Ruh4U5KpoMFO4pqgayWPLOJyLzWELSUCUeZXWF7GSkm+DPbZcOpEDn7uoK7h3+gf4C/n5+ff0CAj48buLV0sGGR0zyeH3sWrdy0ddu2nTt3bt+5Y+u2nTvXrzjxEzmXAoDXFx60OQhyEuT/7g/QALVsCLBfj72Q9UePv/HDUNMhR3TZ80mXN0SXf6irTRu7RZffD3W5M0aX0anf9HjnBzP1mAkQ90uHr8EAMFiHqQAAvnvUW+PqBJEXiGKXwsA8cfMflf6sCAK6b5fn6rzu7Q3MZWcVIefKAW/ECocKlmUJwO864IO81309QaRrrYdEDrld2wMEp635JePz4nQQH9D2qTDyqH24IQGgwjkxhJys5gWSYxbbRPyZm2iAdJdub/hedPIGFV0r3yIclyq5gaJZmy0sljXJoG5g57e0t11CQOlKl80uVfEAxePX2hCtG5NdQXmP7vdv9/cGLXOzQSYAVlA4IFgDAABwFACdASo4ADgAPjEKjEYiEREMACADBLYATpzG/wDjXoz8l/Ev2T6z/LPuj+5H996EdgHbf/fPzA/tfwA/x3sA8wD9Jf8R1S/MN+vf7VcIB/KP6Z1gHoMfrx6qH+Y/7H+8+Bf9lf2q+An9Yv+u+vKZmWbpYmXh/hcm5vBrN/aeBWOOzeb9fNOffypomv+XfrPWiMcQw/76WRH97Jpg7VYmrVP373kyi/iaeDcAAP7r96/VIZFuX+rQVV9XX8OUjMCmNaiUY4VivNkpxDX9XXZBQM+hOGidXKzp71TnUpEop7Wj5eXBKl/YpcgJ+NqF/pQjxZ2uXIMtzkfxb6TlVpy5p3ApclG6+CtwVMLfMHNdYn05tqN/2gNMmWowgp9nrZhHVsJSn86bH300+tk1MnInyVZKabsat9BvfkUQfm7i/Cb1kpAtLDqzdg5AaCgXAIxkY3a/9eIn2iW/eGY4e7SZtzgKrFIVT5bEfR4siCOGnwOgCcyc+SzgJVrIOowq531NNmN1v+hgVAlmes4/zWiSTg9KY4GhztP8LB3c1ujLKVzsZvMtrHBEKDmvpkqa1aSCAFmQgfv/OYSUmDEnAbQEM48PDil7ZA4GL/mg1ZsnzUqRu2tUPsYK4m87oIpGhhKbm82/lowMvACk5qzSXqbX3Ye4YOYpRPNewdZ5hVoKx/YgqN6PExL2kMnEwxQiyjIiPoauerBH2Z1RN76mu694vGVclgnnpRUF+x1U7jym9erUkO6mVnjK6UFwDb8E7eqNe1sOUfs6pXxXEI5uBB97BVIhoRJFjlCG9MB+bi5wWliWQpHyiHelhZLL0LJFBM+Xw0pDOtT+6N+jSvu397BMtYxV1OMPJgsYKr9nSKZLA3y5ZwBfZsRrhSk6HIv2keqalcYA5Ms2jAr6ZuSF5OL+0JmpMqLYbsd3iJQKPaqQzWrTwTB8l0UezXQ+CtooxoPz3/QGu9jAENdvne63HbY///tI53NeQ6R5LSdFrdJhDt7DFyGyWy3opNsoL42nMZinYur0lgFAvePRPVF42YMBTHhBvyfb3XVn/O1FSjuUpTc0TQ5MGf8UymTr8M59YCCLz/+6CwAxhO3Nbz7Zaqzi7CFJsmcwKWvXWgTs9GIyuxsSyFpo1gAA',
      createdAt: '2024-08-06 10:54:27',
    },
    {
      name: 'Google Analytics',
      transactionType: 'Bank Transfer',
      amount: 892.39,
      userId: 3,
      status: 'Completed',
      image:
        'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
      createdAt: '2024-08-05 13:45:27',
    },
    {
      name: 'Canvas Professional',
      transactionType: 'Credit Card',
      amount: 36.99,
      userId: 6,
      status: 'Pending',
      image:
        'data:image/webp;base64,UklGRngDAABXRUJQVlA4IGwDAABQEwCdASo4ADgAPjEKjEYiEREMACADBLYAWJKgqY77vlP4xftj/nfkio39I++X5K5kfsr0usx03wD+7/wDrJfQA8sn2Rf2m/bf2WTAlTIPG586b9X0QP2AYkYEeGWUSodB+N7So9a9rzW58zwc7Kd73+DI7NgmXWv+nDLSz+zM5KlQ9a4zvO5Z8XzhTEoRJ6oaoyoaX91lFoVlyXYrjsgzD5qAAP7mldzD/EOC12/4wj/22wjq0EfbVpECaDj/2qaPqQVQy1Y29uxjAG2dSQVZDchBAFVnOXeDPEOc/JPoX1rOvJk4Sh+d7ScnvC9A88JXFRm/91cSLyo69+9W6LPHBRVv/dNosL6BYiByWEZYeS+BtfPzsKB2LzYZTH//EmzTmfNnE23rkeu0UbykzbfBFz/EGOTJz8po37H5I48fUkHjSfkiNoRuLVkm6I17vhQnOJIgGXpVQiGveB/3cIRrA39vSU7gU5hwcV40j87slPlJf1LHPOm7fD1SKgHlG/8aiccJxT7++m/XAWRbKtZtfbnowkf0s/x/Uz+2vHcve50RWXfLZeCKrbN0c1ExdB++4xWwgqbW0Aa34V4KO7+KV3yJOJYsQq6hP/93sLXmdabgmgcZKo3PbRK0cvDWpbZBAk6V//0bwd66izn5ma85eWuOB1QQ+bNu4WCt4EizdUXjMaHZmth0REbEp9nO1hIiX7bZLZ6/fSLGgHSZnQH5LWEke2wMvTwWCK3p/HJ/bdH19GnkvXpo3SMv3j3vghFgfZre2ECyDeXzipjYaduwd7W9OjXQkgm4A8lS2X7ez9xIyr+NswuYMoXI/fR/o9IgJtjO4crkrPsJPSOVtLhowy7jP/5H/k4OiZIk/D08dlX6Wj3FdZ8M/u/9G0WnGBDfgMdofHAHB4OClnastRHZLUBzX8ofFOTR/EsDBRkMknIUcaE+9GPW/7rMa0tu6sravv+1C2Jzgwc1vKhFztfnHLOB/hF6sdlBVokF0q2sqP15cEES+LOyWDofxPy27NWtlafQ7GO602dEi0NJB+lAREgXVuIUmMWmq7EZ71V3e0I02307DoFmwgNDGIv2tL/xVr7i3e9E2t5RHE7TCWOFf8ud9pbY4EW5EwhPFuuYWiQaYa6SwmNPD5UtTtRqQUyq45DVjQDG50IAAAA=',
      createdAt: '2024-08-11 18:45:27',
    },
    {
      name: 'ConfigCat',
      transactionType: 'Bank Transfer',
      amount: 99.99,
      userId: 7,
      status: 'Completed',
      image: 'https://configcat.com/images/home/logo.svg',
      createdAt: '2024-08-01 13:45:27',
    },
  ],
  invoices: [
    {
      number: 'INV842019',
      status: 0,
      userId: 1,
      total: 185.0,
      amountDue: 0.0,
      createdAt: '2024-07-29 14:30:45',
    },
    {
      number: 'INV842020',
      status: 1,
      userId: 2,
      total: 250.0,
      amountDue: 0.0,
      createdAt: '2024-07-28 10:15:32',
    },
    {
      number: 'INV842021',
      status: 0,
      userId: 3,
      total: 123.0,
      amountDue: 123.0,
      createdAt: '2024-07-28 09:45:10',
    },
    {
      number: 'INV842022',
      status: 2,
      userId: 4,
      total: 765.0,
      amountDue: 150.0,
      createdAt: '2024-07-27 16:20:55',
    },
    {
      number: 'INV842023',
      status: 1,
      userId: 5,
      total: 540.0,
      amountDue: 0.0,
      createdAt: '2024-07-26 13:10:25',
    },
    {
      number: 'INV842024',
      status: 1,
      userId: 6,
      total: 320.0,
      amountDue: 0.0,
      createdAt: '2024-07-25 08:40:10',
    },
    {
      number: 'INV842025',
      status: 0,
      userId: 7,
      total: 200.0,
      amountDue: 200.0,
      createdAt: '2024-07-24 11:55:50',
    },
    {
      number: 'INV842026',
      status: 1,
      userId: 8,
      total: 780.0,
      amountDue: 0.0,
      createdAt: '2024-07-23 12:35:45',
    },
    {
      number: 'INV842027',
      status: 2,
      userId: 9,
      total: 460.0,
      amountDue: 100.0,
      createdAt: '2024-07-22 14:25:15',
    },
    {
      number: 'INV842028',
      status: 1,
      userId: 10,
      total: 610.0,
      amountDue: 0.0,
      createdAt: '2024-07-21 17:50:30',
    },
    {
      number: 'INV842029',
      status: 0,
      userId: 11,
      total: 130.0,
      amountDue: 130.0,
      createdAt: '2024-07-20 07:15:05',
    },
    {
      number: 'INV842030',
      status: 1,
      userId: 12,
      total: 490.0,
      amountDue: 0.0,
      createdAt: '2024-07-19 19:05:20',
    },
    {
      number: 'INV842031',
      status: 1,
      userId: 13,
      total: 220.0,
      amountDue: 0.0,
      createdAt: '2024-07-18 10:45:40',
    },
    {
      number: 'INV842032',
      status: 0,
      userId: 14,
      total: 330.0,
      amountDue: 330.0,
      createdAt: '2024-07-17 11:10:10',
    },
    {
      number: 'INV842033',
      status: 2,
      userId: 15,
      total: 890.0,
      amountDue: 300.0,
      createdAt: '2024-07-16 15:30:55',
    },
  ],
}

export default initialData
