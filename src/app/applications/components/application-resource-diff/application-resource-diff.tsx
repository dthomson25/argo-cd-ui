import { Checkbox, models } from 'argo-ui';
import { Delta, DiffPatcher, formatters } from 'jsondiffpatch';
import * as React from 'react';

require('./application-resource-diff.scss');

export interface ApplicationComponentDiffProps {
    liveState: models.TypeMeta & { metadata: models.ObjectMeta };
    targetState: models.TypeMeta & { metadata: models.ObjectMeta };
    diff: Delta;
}

export class ApplicationResourceDiff extends React.Component<ApplicationComponentDiffProps, { hideDefaultedFields: boolean }> {
    constructor(props: ApplicationComponentDiffProps) {
        super(props);
        this.state = { hideDefaultedFields: true };
    }

    public render() {
        let diff = JSON.parse(this.props.diff.diffs);
        const liveState = this.props.liveState;
        const diffPatcher = new DiffPatcher();
        if (!this.state.hideDefaultedFields ) {
            if (liveState !== null && liveState.hasOwnProperty('metadata') && liveState.metadata.hasOwnProperty('annotations')) {
                const lastApplied = JSON.parse(liveState.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] || '');
                const defaultFieldsDiff = diffPatcher.diff(lastApplied, liveState);
                diff = this.addDefaultedFields(diff, defaultFieldsDiff);
            }
        }
        const html = formatters.html.format(diff, this.props.targetState);
        return (
            <div className='application-component-diff'>
                <div className='application-component-diff__checkbox'>
                    <Checkbox id='hideDefaultedFields' checked={this.state.hideDefaultedFields}
                            onChange={() => this.setState({ hideDefaultedFields: !this.state.hideDefaultedFields })}/> <label htmlFor='hideDefaultedFields'>
                        Hide default fields
                    </label>
                </div>
                <div className='application-component-diff__manifest' dangerouslySetInnerHTML={{__html: html}}/>
            </div>
        );
    }

    private addDefaultedFields(realDiff: any, defaultFieldsDiff: any): any {
        if (realDiff instanceof Object) {
            const result = realDiff;
            for (const k of Object.keys(defaultFieldsDiff)) {
                if (realDiff.hasOwnProperty(k)) {
                    const v1 = realDiff[k];
                    const v2 = defaultFieldsDiff[k];
                    result[k] = this.addDefaultedFields(v1, v2);
                } else {
                    result[k] = defaultFieldsDiff[k];
                }
            }
            return result;
        }
        return realDiff;
    }
}
