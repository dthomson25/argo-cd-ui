import * as React from 'react';

import * as models from '../../../shared/models';
import { ResourceTreeNode } from '../utils';

export const RolloutNodeInfo = (props: { node: ResourceTreeNode, live: models.State}) => {
    return (
        <div className='white-box'>
        <div className='white-box__details'>
            {props.live.spec.strategy.blueGreen.previewService !== '' && (
                <div className='row white-box__details-row' key='previewService'>
                    <div className='columns small-3'>
                        Preview Service Selector
                    </div>
                    <div className='columns small-9'>{props.live.status.previewSelector !== '' ?
                        props.live.metadata.name + '-' + props.live.status.previewSelector : ''
                    }</div>
                </div>
            )}
            <div className='row white-box__details-row' key='activeService'>
                <div className='columns small-3'>
                    Active Service Selector
                </div>
                <div className='columns small-9'>{props.live.metadata.name}-{props.live.status.activeSelector}</div>
            </div>
            <div className='row white-box__details-row' key='verifyingPreview'>
                <div className='columns small-3'>
                    Verifying Preview Service
                </div>
                <div className='columns small-9'>{props.live.status.verifyingPreview === true ? 'true' : 'false'}</div>
            </div>
        </div>
    </div>
    );
};
