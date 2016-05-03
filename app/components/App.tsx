import * as React from 'react';

interface AppProps extends React.Props<any> {
    children?: React.ReactElement<any>[];
}

export default class App extends React.Component<AppProps, void> {
    render(): React.ReactElement<any> {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
