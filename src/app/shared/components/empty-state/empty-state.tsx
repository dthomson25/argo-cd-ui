import * as React from 'react';

require('./empty-state.scss');

export const EmptyState = ({icon, children}: { icon: string; children: React.ReactNode }) => (
    <div className='empty-state'>
        <div className='empty-state__icon'>
            <i className={`argo-icon argo-icon-${icon}`}/>
        </div>
        {children}
    </div>
);
