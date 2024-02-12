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
  const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImU4NjJiY2Y2YTRlN2UwZGM2M2MwYzI3MmU1OGZmNDQxYzZjZTRiZjBlNDgzNTc4YmQ4YWI4YTcwNTZmYzc3YjRlMjk3YmUzZDJkODVhZjg1In0.eyJhdWQiOiI2NjNiMDk0MS0yMTFmLTRkZDEtOGMwNy1iNDI0ZWQ5YmY3M2MiLCJqdGkiOiJlODYyYmNmNmE0ZTdlMGRjNjNjMGMyNzJlNThmZjQ0MWM2Y2U0YmYwZTQ4MzU3OGJkOGFiOGE3MDU2ZmM3N2I0ZTI5N2JlM2QyZDg1YWY4NSIsImlhdCI6MTcwNzc0NDc3NSwibmJmIjoxNzA3NzQ0Nzc1LCJleHAiOjE3MjUxNDg4MDAsInN1YiI6IjEwNjQ1NjEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTU0MTg2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiOGMzZGMzMjEtMzgwYi00Yzc2LWFkMDQtMDEyNzI3N2Q5ZWRhIn0.YGQp63BlhuZu6n1OvJaib0achq6ruAIbKHbxAUOGLnoOJKXHY1ET9wAOIXHKrluv2XTjezD56_xb7pI1huGUawEAySCzfdC4QII_1BsKmaEaisjdzBiwEP570eg65dcMcTh0h1ym0S3H0euoLIxSE8_C5ct7nB5Iq_O1a0c_kV4Kusn3dChGVRK5JLQ07NGxst50wp47GBUF_-RGZPPAuz90LrU7F-KpCEfR9J0gJaivtbjcv7b6rCkwgrzZpqjSD3JxfwBHP5SdCqBm5iKz0BY-d29y1nbIZ3uFFHNUOjk_u8uTySpBOWrf34ERjhYxP305K-pMI8vL_qmsBOKUdg';
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
