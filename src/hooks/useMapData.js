import {useEffect} from 'react';
import  * as d3 from 'd3';
import * as scheme from 'd3-scale-chromatic';
import * as topojson from 'topojson';

export default function useMapData(data) {
    useEffect(() => {
        init(data);
    }, []);
}

async function init({reports, mouseOver, mouseOut}) {
    const margin = {
        top: -50,
        left: 0
    };
    const width = window.innerWidth - margin.left;
    const height = 640 - margin.top;
    const svg = d3.select('.map')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2 ])

    const path = d3.geoPath()
    .projection(projection);

    

    const topoData = await getTopoData();
    const tsv = await getTSVData();

    const scale = createScale(reports);

    const states = topojson.feature(topoData, topoData.objects.states).features;

    const formattedStateData = getFormattedStateData(reports);

    svg.selectAll('.state')
    .data(states)
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
    .on('mouseover', function(d) {
        mouseOver(d3.select(this));
    })
    .on('mouseout', function(d) {
        mouseOut(d3.select(this));
    });

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

function getMaxReported(reports) {
    let max = 0;

    for(const report of reports) {
        max = Math.max(max, report.Reported.Max);
    }

    return max;
}

function getMinReported(reports) {
    let min = 1000;

    for(const report of reports) {
        min = Math.min(min, report.Reported.Max);
    }

    return min;
}

function createScale(reports) {
    const scale = d3.scaleThreshold()
    .range(getColorRange());

    const max = getMaxReported(reports);
    const min = getMinReported(reports);

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