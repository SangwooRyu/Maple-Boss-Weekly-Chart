import './App.css';
import GraphsPage from './page/GraphsPage';
import FlowGraphsPage from './page/FlowGraphsPage';
import moment from 'moment';
import labels from "./page/ko-map.json";

import { useEffect, useState, useRef } from 'react';
import { message, Layout, Menu, DatePicker, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const bossNameArray = Object.keys(labels);
var bossOptionArray = bossNameArray.reduce(function (pre, value){
  pre.push(<Option value={value}>{labels[value]}</Option>);
  return pre;
}, []);

var rangeOptionArray = [
  <Option value="all">전체 기간</Option>,
  <Option value="prev1mon">지난 1달</Option>,
  <Option value="prev3mon">지난 3달</Option>,
  <Option value="prev6mon">지난 6달</Option>,
  <Option value="prev1year">지난 1년</Option>,
  <Option value="prev3year">지난 3년</Option>
];

function App() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [tab, setTab] = useState('weekly');
  //const [boss, setBoss] = useState('선택하세요');
  //const [flowRange, setFlowRange] = useState('선택하세요');
  const [passingOption, setPassingOption] = useState([]);
  // all, prev1mon, prev3mon, prev6mon, prev1year, prev3year
  const [displayFlow, setDisplayFlow] = useState(false);
  const boss = useRef('선택하세요');
  const flowRange = useRef('선택하세요');

  function onChangeTab(selected) {
    setLoading(true);
    setTab(selected.key);
    //setBoss('');
    //setFlowRange('prev1mon');
    setDisplayFlow(false);
    setLoading(false);
  }

  function onChangeDate(date, dateString) {
    setLoading(true);
    setDate(date);
    setLoading(false);
  }

  function onChangeBoss(value){
    //console.log(value);
    //setBoss(value);
    boss.current = value;
  }

  function onChangeRange(value){
    //console.log(value);
    //setFlowRange(value);
    flowRange.current = value;
  }

  function onSettingOption(){
    if(boss.current === '선택하세요'){
      message.error('보스를 선택하세요');
      return;
    }
    else if (flowRange.current === '선택하세요'){
      message.error('기간을 선택하세요');
      return;
    }
    else {
      //setLoading(true);
      setDisplayFlow(true);
      setPassingOption([boss.current, flowRange.current]);
      //console.log(`Selected Boss is ${boss}, Selected Range is ${flowRange}`);
      //setLoading(false);
    }

  }

  useEffect(() => {
    setLoading(true);
    const today = moment();
    setDate(today);
    setLoading(false);
  }, []);

  return (
    loading? <div /> :
    <Layout>
      <Header className = "header">
        <div className="titleText"> 메이플스토리 보스 결정 주간 차트 </div>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['weekly']} onClick={onChangeTab} disabledOverflow={true} className="tabs">
          <Menu.Item key='weekly' className="menuItem">주간 차트</Menu.Item>
          <Menu.Item key='flow' className="menuItem">가격 변동</Menu.Item>
        </Menu>
      </Header>
      {
        tab === 'weekly'?
        <div>
          <Content className="datePickerContainer">
            <div className="dataPickerTitle"> 날짜 선택 </div>
            <DatePicker defaultValue={date} onChange={onChangeDate} className="datePicker"/>
          </Content>
          <Content style={{ padding: '0px 50px' }}>
            <div className="site-layout-content">
              <GraphsPage date={date}/>
            </div>
          </Content>
        </div> :
        <>
          <Content className="flowOptionPicker">
            <div className="flowBossPickerTitle"> 보스 선택 </div>
            <Select defaultValue={boss.current} onSelect={onChangeBoss} className="flowBossDropdown">
              {bossOptionArray}
            </Select>
            <div className="flowRangePickerTitle"> 기간 선택 </div>
            <Select defaultValue={flowRange.current} onSelect={onChangeRange} className="flowRangeDropdown">
              {rangeOptionArray}
            </Select>
            <Button type="primary" shape="round" icon={<SearchOutlined />} onClick={onSettingOption} size='default' className="optionButton">
              보기
            </Button>
          </Content>
          <Content style={{ padding: '0px 50px' }}>
            <div className="site-layout-content">
              {
                displayFlow?
                <FlowGraphsPage boss={passingOption[0]} range={passingOption[1]}/> : null
              }
            </div> 
          </Content>
        </>

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