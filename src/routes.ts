interface ApiUrl {
  [key: string]: string;
}

export default {
  homePage: '/',
  getToken: 'https://hakon1.amocrm.ru/oauth2/access_token',
  getDeals: 'https://hakon1.amocrm.ru/api/v4/leads',
  getUser: 'https://hakon1.amocrm.ru/api/v4/users/',
} as ApiUrl;
