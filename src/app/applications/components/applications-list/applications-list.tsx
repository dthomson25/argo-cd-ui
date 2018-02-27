import { AppState, MockupList, Page } from 'argo-ui';
import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import * as models from '../../../shared/models';
import * as actions from '../../actions';
import { State } from '../../state';

require('./applications-list.scss');

export interface ApplicationProps {
    onLoad: () => any;
    applications: models.Application[];
}

class Component extends React.Component<ApplicationProps> {

    public componentDidMount() {
        this.props.onLoad();
    }

    public render() {
        return (
            <Page title='Applications' toolbar={{breadcrumbs: [{ title: 'Applications', path: '/applications' }]}}>
                <div className='argo-container applications-list'>
                    {this.props.applications ? (
                        <div className='argo-table-list argo-table-list--clickable'>
                            <div className='argo-table-list__row'>
                                {this.props.applications.map((app) => (
                                    <div key={app.metadata.name} className='row'>
                                        <div className='columns small-3'>
                                            <div className='row'>
                                                <div className='columns small-12'>
                                                    <i className='argo-icon-application icon'/> <span className='applications-list__title'>{app.metadata.name}</span>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='columns small-6'>STATUS:</div>
                                                <div className='columns small-6'>
                                                    <i className={classNames('fa', {
                                                        'fa-check-circle': app.status.comparisonResult.status === models.ComparisonStatuses.Equal,
                                                        'fa-times': app.status.comparisonResult.status === models.ComparisonStatuses.Different,
                                                        'fa-exclamation-circle': app.status.comparisonResult.status === models.ComparisonStatuses.Error,
                                                        'fa-circle-o-notch status-icon--running status-icon--spin':
                                                            app.status.comparisonResult.status === models.ComparisonStatuses.Unknown,
                                                    })}/> {app.status.comparisonResult.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='columns small-9 applications-list__info'>
                                            <div className='row'>
                                                <div className='columns small-3'>NAMESPACE:</div>
                                                <div className='columns small-9'>{app.metadata.namespace}</div>
                                            </div>
                                            <div className='row'>
                                                <div className='columns small-3'>REPO URL:</div>
                                                <div className='columns small-9'>{app.spec.source.repoURL}</div>
                                            </div>
                                            <div className='row'>
                                                <div className='columns small-3'>PATH:</div>
                                                <div className='columns small-9'>{app.spec.source.path}</div>
                                            </div>
                                            <div className='row'>
                                                <div className='columns small-3'>ENVIRONMENT:</div>
                                                <div className='columns small-9'>{app.spec.source.environment}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <MockupList height={50} marginTop={30}/>}
                </div>
            </Page>
        );
    }
}

export const ApplicationsList = connect((state: AppState<State>) => {
    return {
        applications: state.page.applications,
    };
}, (dispatch) => ({
    onLoad: () => dispatch(actions.loadAppsList()),
}))(Component);