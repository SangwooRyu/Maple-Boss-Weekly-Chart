import './App.css';
import GraphsPage from './page/GraphsPage';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { Layout, Menu, DatePicker } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [tab, setTab] = useState('weekly');

  function onChangeTab(selected) {
    setLoading(true);
    setTab(selected.key);
    setLoading(false);
  }

  function onChangeDate(date, dateString) {
    setLoading(true);
    setDate(date);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    const today = moment();
    setDate(today);
    setLoading(false);
  }, []);

  return (
    loading? <div /> :
    <Layout className="layout">
      <Header className = "header">
        <h2 className="titleText"> 메이플스토리 보스 결정 주간 차트 </h2>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['weekly']} onClick={onChangeTab}>
          <Menu.Item key='weekly'>주간 차트</Menu.Item>
          <Menu.Item key='flow'>가격 변동</Menu.Item>
        </Menu>
      </Header>
      {
        tab === 'weekly'?
        <>
        <Content className="datePicker">
        <div className="dataPickerTitle"> 날짜 선택 </div>
        <DatePicker defaultValue={date} onChange={onChangeDate}/>
        </Content>
        <Content style={{ padding: '0px 50px' }}>
          <div className="site-layout-content">
            <GraphsPage date={date}/>
          </div>
        </Content>
        </> :
        <Content style={{ padding: '24px 50px' }}>
          <div className="site-layout-content">
            추가 예정
          </div> 
        </Content>
      }

      <Footer style={{ textAlign: 'center' }}> Sangwoo Ryu 2021</Footer>
    </Layout>
  );
}

export default App;


/*
    <div className="App">
      <header className="App-header">
        <p className="title">
          Maplestory Boss Crystal Weekly Chart
        </p>
      </header>
      <GraphsPage />
    </div>
*/