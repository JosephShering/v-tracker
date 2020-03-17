import React, {useRef} from 'react';
import {graphql} from 'gatsby';
import useMapData from '../hooks/useMapData';

import Head from '../components/head';
import Table from '../components/table';
import Layout from '../components/layout';

import './us-report.css';


export default USReport;
function USReport({
    data
}) {
    const parent = useRef(null);
    const map = useRef(null);
    const reports = data.allReport.edges.map(({node}) => node);
    
    useMapData({
        reports,
        parent,
        map
    });

    return (
        <Layout>
            <div ref={parent} className="flex flex-col items-center box-border">
                <Head />
                <div className="map w-full my-6" ref={map}></div>

                <Table data={reports.map(report => {
                    return {
                        state: report.Name,
                        cases: report.Reported.Max
                    };
                })}/>
            </div>
        </Layout>
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