import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import FlowGraph from './FlowGraph';
import labels from "./ko-map.json";

function FlowGraphsPage(props){
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    async function fetchCsv(filename) {
        const response = await fetch('/Maple-Boss-Weekly-Chart/data/' + filename);
        // console.log(response);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = await decoder.decode(result.value);
        return csv;
    }

    function getPrevThursdayFilename(target_date){
        var prevThursday = new Date(target_date);
        prevThursday.setDate(prevThursday.getDate() - (prevThursday.getDay() + 3) % 7);
        let year = prevThursday.getFullYear().toString();
        let month = prevThursday.getMonth() < 9? '0' + (prevThursday.getMonth() + 1).toString() : (prevThursday.getMonth() + 1).toString();
        let date = prevThursday.getDate() < 10? '0' + prevThursday.getDate().toString() : prevThursday.getDate().toString();
        
        let targetFileName = year + month + date;
        if (parseInt(targetFileName) < 20210812)
            targetFileName = '20210812';

        return targetFileName;
    }

    useEffect(() => {
        async function loadData(){
            setLoading(true);
            let targetFiles = [];
    
            var startDay = new Date();
            var today = new Date(startDay);
            var lastFile = getPrevThursdayFilename(today);
    
            if (props.range === 'prev1mon') {        
                startDay.setMonth(startDay.getMonth() - 1);
            }
            else if (props.range === 'prev3mon') {        
                startDay.setMonth(startDay.getMonth() - 3);
            }
            else if (props.range === 'prev6mon') {        
                startDay.setMonth(startDay.getMonth() - 6);
            }
            else if (props.range === 'prev1year') {        
                startDay.setMonth(startDay.getMonth() - 12);
            }
            else if (props.range === 'prev3year') {        
                startDay.setMonth(startDay.getMonth() - 36);
            }
            else if (props.range === 'all'){
                startDay.setDate(12);
                startDay.setMonth(7);
                startDay.setYear(2021);
            }
            else {
                return;
            }
    
            while(true){
                const targetFile = getPrevThursdayFilename(startDay)
                targetFiles.push(targetFile);
                startDay.setDate(startDay.getDate() + 7);
                
                if (targetFile === lastFile)
                    break;
            }

            var refined_data = targetFiles.reduce(async function(pre, value) {
                const weekData = await Papa.parse(await fetchCsv(value + '.csv'));
                const obj = Object.fromEntries(weekData.data);
                const price = obj[props.boss];
                let result = await pre.then();
                result.push([value, parseInt(price)]);
                return Promise.resolve(result);
            }, Promise.resolve([]));
    
            const obj = Object.fromEntries(await refined_data.then());
            setData(obj);
            //console.log(obj);
            setLoading(false);
        }

        loadData();
    }, [props.boss, props.range]);

    return(
        loading?
        <div /> : 
        <FlowGraph input={data} />
    );
}

export default FlowGraphsPage;