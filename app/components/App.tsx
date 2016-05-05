import * as React from 'react';
import Header from './Header';
import Footer from './Footer';

interface P {
  children?: React.ReactElement<any>[];
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
