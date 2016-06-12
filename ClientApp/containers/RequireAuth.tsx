import * as React from 'react';
import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';

interface P {
  isAuthenticated: boolean;
}

export default function(ComposedComponent) {
  class Auth extends React.Component<P, {}> {
        
    static contextTypes: React.ValidationMap<any> = {
      router: React.PropTypes.object
    };
    
    context: {
      router: ReactRouter.RouterOnContext;
    };

    componentWillMount() {
      if (!this.props.isAuthenticated) {
        console.log(this.context.router);
        console.log('were pushing it!');
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      if (this.props.isAuthenticated) {
        return <ComposedComponent {...this.props} />
      }
      return <div className="container">Loading...</div>;
    }
  }

  function mapStateToProps(state: ApplicationState) {
    return { isAuthenticated: state.auth.isAuthenticated };
  }
  
  // Selects which part of global state maps to this component, and defines a type for the resulting props
  const provider = provide(
      mapStateToProps,
      null
  );
  type P = typeof provider.allProps;
  return provider.connect(Auth);
}