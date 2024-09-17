require('dotenv').config();
import axios from 'axios';

interface ZaloMessage {
  phone: string;
  name: string;
  message: string;
  list_image?: string[];
}

export async function sendZaloMessage({
  messages,
}: {
  messages: ZaloMessage[];
}) {
  // const url = `${process.env.EZSALE_URL_SEND_MSG}`;
  const url = `https://api.ezsale.vn/partner/customer/send-message-zalo`;

  const headers = {
    Accept: '*/*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    api: 'DPrIysl6c4MIchcdYZSoPw',
    // api: process.env.ZALO_EZSALE_API_KEY,
  };

  try {
    if (messages.length > 0) {
      for (const msg of messages) {
        const data = {
          messages: [msg],
          list_zalo_account: ['+84865336440'],
        };
        await axios.post(url, data, { headers });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//Version 1
// export async function sendZaloMessage({
//   messages,
// }: {
//   messages: ZaloMessage[];
// }) {
//   // const url = `${process.env.EZSALE_URL_SEND_MSG}`;
//   const url = `https://api.ezsale.vn/partner/customer/send-message-zalo`;

//   const headers = {
//     Accept: '*/*',
//     'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
//     'Cache-Control': 'no-cache',
//     'Content-Type': 'application/json',
//     api: 'DPrIysl6c4MIchcdYZSoPw',
//     // api: process.env.ZALO_EZSALE_API_KEY,
//   };
//   const data = {
//     messages: messages.map((msg) => ({
//       phone: msg.phone,
//       name: msg.name,
//       message: msg.message,
//       list_image: msg.list_image || [],
//     })),
//     list_zalo_account: ['+84865336440'],
//     // list_zalo_account: [process.env.ZALO_ACCOUNT],
//   };
//   try {
//     const response = await axios.post(url, data, { headers });
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

export async function testZaloMessage({
  messages,
}: {
  messages: ZaloMessage[];
}) {
  const url = `${process.env.EZSALE_URL_SEND_MSG}`;
  const headers = {
    Accept: '*/*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    api: process.env.ZALO_EZSALE_API_KEY,
  };
  const data = {
    messages: [
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '1',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '2',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '3',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '4',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '5',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '6',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '7',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '8',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '9',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '10',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '11',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '12',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '13',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '14',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '15',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '16',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '17',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '18',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '19',
        list_image: [],
      },
      {
        phone: '0366710050',
        name: 'Long Nguyen',
        message: '20',
        list_image: [],
      },
    ],
    list_zalo_account: [process.env.ZALO_ACCOUNT],
  };
  try {
    if (data.messages.length > 0) {
      const messagesArr = data.messages;
      for (const msg of messagesArr) {
        const data = {
          messages: [msg],
          list_zalo_account: ['+84865336440'],
        };
        await axios.post(url, data, { headers });
      }
    }
    // const response = await axios.post(url, data, { headers });
  } catch (error) {
    console.error('Error:', error);
  }
}
