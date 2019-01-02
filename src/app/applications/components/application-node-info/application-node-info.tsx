import { Tab, Tabs } from 'argo-ui';
import * as jsYaml from 'js-yaml';
import * as React from 'react';

import { AppContext } from '../../../shared/context';
import * as models from '../../../shared/models';
import { ApplicationResourceDiff } from '../application-resource-diff/application-resource-diff';
import { RolloutNodeInfo } from '../rollout-node-info/rollout-node-info';
import { ComparisonStatusIcon, getPodStateReason, HealthStatusIcon, ResourceTreeNode } from '../utils';

require('./application-node-info.scss');

interface ApplicationNodeInfoProps {
    node: ResourceTreeNode;
    live: models.State;
    controlled: {
        summary: models.ResourceStatus;
        state: models.ResourceDiff;
    };
}

export const ApplicationNodeInfo = (props: ApplicationNodeInfoProps) => {
    const attributes = [
        {title: 'KIND', value: props.node.kind},
        {title: 'NAME', value: props.node.name},
        {title: 'NAMESPACE', value: props.node.namespace},
    ];
    if (props.live) {
        if (props.node.kind === 'Pod') {
            const {reason, message} = getPodStateReason(props.live);
            attributes.push({title: 'STATE', value: reason });
            if (message) {
                attributes.push({title: 'STATE DETAILS', value: message });
            }
        } else if (props.node.kind === 'Service') {
            attributes.push({title: 'TYPE', value: props.live.spec.type});
            let hostNames = '';
            const status = props.live.status;
            if (status && status.loadBalancer && status.loadBalancer.ingress) {
                hostNames = (status.loadBalancer.ingress || []).map((item: any) => item.hostname).join(', ');
            }
            attributes.push({title: 'HOSTNAMES', value: hostNames});
        }
    }

    if (props.controlled) {
        if (!props.controlled.summary.hook) {
            attributes.push({title: 'STATUS', value: (
                <span><ComparisonStatusIcon status={props.controlled.summary.status}/> {props.controlled.summary.status}</span>
            )} as any);
        }
        attributes.push({title: 'HEALTH', value: (
            <span><HealthStatusIcon state={props.controlled.summary.health}/> {props.controlled.summary.health.status}</span>
        )} as any);
        if (props.controlled.summary.health.message) {
            attributes.push({title: 'HEALTH DETAILS', value: props.controlled.summary.health.message});
        }
    }

    const tabs: Tab[] = [{
        key: 'manifest',
        title: 'Manifest',
        content: <div className='application-node-info__manifest application-node-info__manifest--raw'>{jsYaml.safeDump(props.live, {indent: 2 })}</div>,
    }];
    if (props.controlled && !props.controlled.summary.hook) {
        tabs.unshift({
            key: 'diff',
            title: 'Diff',
            content: <ApplicationResourceDiff state={props.controlled.state}/>,
        });
    }

    return (
        <div>
            <div className='white-box'>
                <div className='white-box__details'>
                    {attributes.map((attr) => (
                        <div className='row white-box__details-row' key={attr.title}>
                            <div className='columns small-3'>
                                {attr.title}
                            </div>
                            <div className='columns small-9'>{attr.value}</div>
                        </div>
                    ))}
                </div>
            </div>
            {props.node.kind === 'Rollout' && (
                <RolloutNodeInfo node={props.node} live={props.live}/>
            )}

            <div className='application-node-info__manifest'>
                <Tabs selectedTabKey={tabs[0].key} tabs={tabs} />
            </div>
        </div>
    );
};
