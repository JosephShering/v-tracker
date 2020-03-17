import {useLayoutEffect} from 'react';
import  * as d3 from 'd3';
import * as topojson from 'topojson';

export default function useMapData(data) {
    useLayoutEffect(() => {
        if(!data.map || !data.parent) {
            return
        }
        init(data);
    }, [data]);
}

async function init({
    reports,
    parent,
    map
}) {
    const width = parent.current.clientWidth;
    const height = map.current.clientHeight;

    const topoData = await getTopoData();
    const tsv = await getTSVData();
    const states = topojson.feature(topoData, topoData.objects.states);
    const scale = createScale(reports);
    const formattedStateData = getFormattedStateData(reports);

    const svg = d3.select(map.current)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('height', height)
    .attr('width', width)
    .append('g');

    const projection = d3.geoAlbersUsa()
    .fitSize([width, height], states)
    .translate([ width / 2, height / 2 ]);

    const path = d3.geoPath()
    .projection(projection)

    svg.selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('name', function(d) {
        return tsv[d.id].name;
    })
    .attr('d', path)
    .style('fill', function(d) {
        const name = d3.select(this).attr('name');
        if(formattedStateData[name]) {
            return scale(formattedStateData[name].Reported.Max);
        }

        return '#ccc';
    })

    return svg;
}

async function getTopoData() {
    try {
        return await d3.json('/us.json');
    } catch(ex) {
        return {};
    }
}

async function getTSVData() {
    let tsvData = {};
    try {
        tsvData = await d3.tsv('https://raw.githubusercontent.com/GovLab/opencorporatesd3/master/us-state-names.tsv');
    } catch(ex) {
        return {};
    }

    return tsvData.reduce((states, state) => {
        states[state.id] = {
            name: state.name,
            code: state.code
        }
        return states;
    }, {});
}

function getFormattedStateData(reports) {
    return reports.reduce((states, state) => {
        states[state.Name] = state;
        return states;
    }, {});
}

// function getMaxReported(reports) {
//     let max = 0;

//     for(const report of reports) {
//         max = Math.max(max, report.Reported.Max);
//     }

//     return max;
// }

// function getMinReported(reports) {
//     let min = 1000;

//     for(const report of reports) {
//         min = Math.min(min, report.Reported.Max);
//     }

//     return min;
// }

function createScale(reports) {
    const scale = d3.scaleThreshold()
    .range(getColorRange());

    scale.domain(getDomains());
    return scale;
}

function getColorRange() {
    return [
        '#FFF5F5',
        '#FED7D7',
        '#FEB2B2',
        '#FC8181',
        '#F56565',
        '#E53E3E',
        '#C53030',
        '#9B2C2C',
        '#742A2A'
    ]
}

function getDomains() {
    return [
        20,
        50,
        75,
        100,
        200,
        300,
        500,
        700,
        900
    ]
}