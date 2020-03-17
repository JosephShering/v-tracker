import React, { forwardRef } from 'react';

export default forwardRef(Layout);
function Layout({
    children
}, ref) {
    return (
        <div className="flex items-center my-6" ref={ref}>
            <div className="flex-1">
                <h2 className="text-lg font-bold text-center">Corona Virus Tracker</h2>
                {children}
            </div>
        </div>
    );
}