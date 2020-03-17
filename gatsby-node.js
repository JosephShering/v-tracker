const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const axios = require('axios');
const dateformat = require('dateformat');
const neatcsv = require('neat-csv');
const d3 = require('d3');

const writeFile = promisify(fs.writeFile);

const currentDate = dateformat(new Date(), 'yyyy-mm-dd');

exports.onPreInit = async () => {
    const response = await axios({
        responseType: `text`,
        url: 'https://www.cdc.gov/coronavirus/2019-ncov/map-data-cases.csv'
    });

    let stateCases = await neatcsv(response.data);
    stateCases = stateCases.map(stateCase => {
        const [min] = stateCase['Cases Reported'].match(/^\d+/) || [0];
        const [max] = stateCase['Cases Reported'].match(/\d+$/) || [0];
        return {
            ...stateCase,
            Date: currentDate,
            Reported: {
                Min: Number(min),
                Max: Number(max)
            }
        }
    });

    await writeFile(`./src/data/reports/r-${currentDate}.json`, JSON.stringify(stateCases), {
        encoding: 'utf8'
    });
}

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}) => {
    const data = {
        id: createNodeId(currentDate),
        date: currentDate
    };

    actions.createNode({
        ...data,
        internal: {
            type: `ReportedDay`,
            contentDigest: createContentDigest(data),
            mediaType: `text/json`,
            content: JSON.stringify(data),
        }
    });
}

exports.createPages = async ({graphql, actions}) => {
    const {data} = await graphql(`
        query {
            allReport {
                group(field: Date) {
                    fieldValue
                }
            }
        }
    `);

    data.allReport.group.forEach(report => {
        let p = `/reports/${report.fieldValue}`;

        if(report.fieldValue === currentDate) {
            p = '/'
        }

        actions.createPage({
            path: p,
            component: path.resolve('./src/templates/us-report.js'),
            context: {
                report: report.fieldValue,
            }
        });
    });
}