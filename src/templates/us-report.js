import React from 'react';
import {graphql} from 'gatsby';
import useMapData from '../hooks/useMapData';

import './us-report.css';

export default USReport;
function USReport({
    data
}) {
    const mouseOver = (d) => {
        console.log(d.attr('name'));
    }

    useMapData({
        reports: data.allReport.edges.map(({node}) => node),
        mouseOver, 
        mouseOut: () => {}
    });

    return (
        <div>
            <div className="map"></div>
            <ul>
                {data.allReport.edges.map(({node}) => <li key={node.Name}>{node.Name} - {node.Reported.Max}</li>)}
            </ul>
        </div>
    );
}

export const query = graphql`
    query GetTodaysReport($report: Date!) {
        allReport(filter: {Date: {eq: $report}}) {
            edges {
                node {
                    Name
                    Date
                    Community_Transmission
                    Cases_Reported
                    Range
                    URL
                    Reported {
                        Min
                        Max
                    }
                }
            }
        }
    }
`;