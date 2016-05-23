import * as React from 'react';
import { connect } from 'react-redux';

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
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { isAuthenticated: state.auth.isAuthenticated };
  }

  return connect(mapStateToProps)(Auth);
}