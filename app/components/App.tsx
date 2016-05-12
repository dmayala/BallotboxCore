import * as React from 'react';
import Header from '../containers/Header';
import Footer from './Footer';

interface P extends ReactRouter.RouteComponentProps<{}, {}> {
}

export default class App extends React.Component<P, {}> {
    render(): React.ReactElement<any> {
        return (
            <div>
              <Header />
              {this.props.children}
              <Footer />
            </div>
        );
    }
}
