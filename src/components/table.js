import React from 'react';

export default Table;
function Table({
    data,
}) {
    const labels = Object.keys(data[0]);
    return (
        <div className="flex flex-col box-sizing w-full">
            <Headers labels={labels} />
            <Rows rows={data} />
        </div>
    );
}


function Headers({
    labels
}) {
    return (
        <header className="flex p-4">
            {labels.map(label => <div key={label} className="flex-1 uppercase font-bold">{label}</div>)}
        </header>
    );
}


function Rows({
    rows
}) {
    return (
        <div className="flex flex-col">
            {rows.map((row, index) => <Row key={index} row={row} index={index} />)}
        </div>        
    );
}

function Row({
    row,
    index
}) {
    return (
        <div className="flex odd:bg-gray-200 p-4">
            <div className="flex-1">{row.state}</div>
            <div className="flex-1 pl-4">{row.cases}</div>
        </div>
    );
}