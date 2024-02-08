/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import Helmet from '@/components/Helmet';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import {
  Button, Input, Space, Table,
} from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { dealsAdd } from '@/slices/dealsSlice';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useAppDispatch } from '@/utilities/hooks';
import type { Deal } from '@/types/Deal';
import Highlighter from 'react-highlight-words';
import routes from '@/routes';

type InputRef = GetRef<any>;

type DataIndex = keyof Deal;

export const getStaticProps: GetStaticProps = async () => {
  const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjViMDY3MTU2ZjYzYzRhZjFjYzhjMmIxODFjNDk5MjAxNTFhMzM0OTk2YWQ4ODhhMmZjYjQ0YWExMzYyOTcxZDI3YjMyMDE4YjEyY2ZiZGY4In0.eyJhdWQiOiI2NjNiMDk0MS0yMTFmLTRkZDEtOGMwNy1iNDI0ZWQ5YmY3M2MiLCJqdGkiOiI1YjA2NzE1NmY2M2M0YWYxY2M4YzJiMTgxYzQ5OTIwMTUxYTMzNDk5NmFkODg4YTJmY2I0NGFhMTM2Mjk3MWQyN2IzMjAxOGIxMmNmYmRmOCIsImlhdCI6MTcwNzQwNTI2MCwibmJmIjoxNzA3NDA1MjYwLCJleHAiOjE3MDc0OTE2NjAsInN1YiI6IjEwNjQ1NjEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTU0MTg2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZDE2OTE3ODgtMDhiMi00MTkzLThmYTAtZjNlNWVjNDM3NjgzIn0.mIjcc_8GN68Mbm3CQPyLSqyf8YpVSKda9fEfQu2jyXOPGjT-H4iB27y9l-F_9d5R9nKuSs7uooSO9sAaECzLirk53xjcKDUrKH-ojJEqZItw8M_a_J5lWLj0BXbZPGhX5XsrzjjleYekfRCnYkNLycOi65T3hM7_eDPgHXlegU-yGFA97y4KQheSOte6zWJC3NTHVxAg3pWj0BJvIDG36fAdNZNi6C3fc9I_1B7LaB1bCwvm6lsIM6Qfs8ruHE8xYqbCw_KPejEcEMMSIv7Evfxx772IykaRYW-ZqEaToNtjv-WD963qkgotMTUGRgrOnSuPSbQ-_-bblwUIP7x-cQ';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await axios.get(routes.getDeals, {
    headers,
  });
  const deals = response.data._embedded.leads
    .map(async (deal: Deal, index: number) => {
      const username = new Promise((resolve) => { // оборачиваем запрос в timeout, иначе API принимает за спам
        setTimeout(async () => resolve((await (axios.get(`${routes.getUser}${deal.responsible_user_id}`, { headers }))).data.name), 100 * index);
      });
      return {
        ...deal,
        key: index + 1,
        username: await username,
      };
    });

  return { props: { deals: await Promise.all(deals) }, revalidate: 1 };
};

const convertDate = (time: number) => {
  const date = new Date(time * 1000);
  return date.toLocaleDateString();
};

const Home = ({ deals }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const dispatch = useAppDispatch();

  const [refreshToken, setRefreshToken] = useState('def50200af873fa555ff3b90fbe20482a1e4734f68324911cd50372ff64ab34a104c91c1189437ac9c93459c0452055a409624e9b338083a7ae1f4bde19ebcd698f8a56fbdc3eaed5ac058f6f2203836adacc0cf00ac28835afd8b26f4e8617f3bc360eba4f4980139367adf501dbbe397f8ad9a56591cf9b05e0abd031ce403080c71b88a49107b515014ace6795fecbbfeec82ddc46d4c70315e9669107eb44b43b342b8c7591ee33b20bea7428269b0bfecd3ee76ed04d4ac0dd518c8bce39354ca2adc4c9526d616bdd64386042241261975738d1a5d1e585b601a5bc9edfe52e2281d262093dfa6c015569c0ef2b4bf74fd3c0d319e31f5ef8030ce46c4e166a36b630391b7a76fe26d5756dc0986e598a927ce30fc4ecec0ec0a2fea14c2662be1472efb05c91218bc01eaad31714432cc756e6ae70c9ae0d7946c2e9cde49504bab8a0b84e0155cfc011de5cd1b623a4b00b2c3b1828590880f833e45f2e942f825847a2db8fe824d900e720a79bec0b2c52c21d4cac2c09685af8b02510a765196cbc5c5c0c00be0c6bb59a2ef2a5440297aee4484fa7138734d57ced97cf6a5a50b5c0fd4e1e54325d8783383802d24cf6b1dca3e877c32fe3ec7c13e756c9920ba7b11b5aa0a3b0ee2e07571253eec9f98bcd5c9c8d83791a065b4d3fc06ec0f753768b0a329bfc945');

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const defaultPageSize = 5;

  const [currentDeals, setCurrentDeals] = useState<Deal[] | []>([]);
  const [showAll, setShowAll] = useState([false]);
  const [showedDeals, setShowedDeals] = useState<Deal[]>();

  const setShowAllDefault = () => {
    setShowAll([false]);
    setShowedDeals(undefined);
  };

  useEffect(() => {
    if (showAll[0]) {
      setShowedDeals([...currentDeals, ...deals.filter((deal: Deal) => !currentDeals.map((cd) => cd.name).includes(deal.name))].slice(0, currentDeals.length + 5));
    }
  }, [showAll]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Deal> => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters, close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });

  const columns: TableColumnsType<Deal> = [
    {
      title: 'Название',
      dataIndex: 'name',
      filterSearch: true,
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Бюджет',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Ответственный',
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: 'Создана',
      dataIndex: 'created_at',
      render: convertDate,
      width: '20%',
    },
    {
      title: 'Обновлена',
      dataIndex: 'updated_at',
      render: convertDate,
      width: '20%',
    },
  ];

  useEffect(() => {
    dispatch(dealsAdd(deals));
  }, []);

  return (
    <>
      <Helmet title="amoМаркет" description="Выполненное тестовое задание" />
      <Table
        columns={columns}
        dataSource={showAll[0] ? showedDeals : deals}
        title={(data: any) => {
          setTimeout(() => setCurrentDeals(data), 10);
          return undefined;
        }}
        pagination={!showAll[0] ? {
          position: ['bottomCenter'],
          pageSizeOptions: [2, 5, 10],
          defaultPageSize,
          showSizeChanger: true,
        } : false}
      />
      <div className="d-flex justify-content-center mt-3">
        <Button
          onClick={() => (showedDeals?.length === deals.length ? setShowAllDefault() : setShowAll([true]))}
        >
          {showedDeals?.length === deals.length ? 'Вернуть как было' : 'Вывести всё'}
        </Button>
      </div>
    </>
  );
};

export default Home;
