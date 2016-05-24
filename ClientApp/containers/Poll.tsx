import * as React from 'react';
import {Button} from 'react-bootstrap';
import {sortBy} from 'lodash';

import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';
import { actionCreators } from '../store/Polls';

interface RouteParams {
  id: string;
}

class Poll extends React.Component<P, {}> {
  
  static contextTypes: React.ValidationMap<any> = {
		router: React.PropTypes.object
	};
  
  context: {
    router: ReactRouter.RouterOnContext;
  };
  
  private componentWillMount() {
    this.props.requestPoll(parseInt(this.props.params.id)); 
  }

  private _onVote = (choiceId) => {
    this.props.vote(this.props.poll.id, choiceId);
  }
  
  private _renderPoll = () => {
    let { id, name, choices } = this.props.poll;
    
    let choicesEl: JSX.Element[] = sortBy(choices, 'id').map((choice) => {
      return (
        <Button key={choice.id} onClick={ this._onVote.bind(this, choice.id) } bsStyle="primary" bsSize="large" block>{ choice.name }</Button>
      );
    });

    return (
      <div>
        <h2 className="text-center">
          { name }
        </h2>
        <div className="well">
          { choicesEl }
        </div>
      </div>
    );
  }
  
  private _renderComplete = () => {
    return (
      <div>
        <h2 className="text-center">
          Your vote has been submitted. :)
        </h2>
      </div>
    );
  }

  render() {
    return (
      <div className="container survey-component">
        { this.props.poll ? this._renderPoll() : this._renderComplete() }
      </div>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    poll: state.polls.poll,
  };
}

// Selects which part of global state maps to this component, and defines a type for the resulting props
const provider = provide(
    mapStateToProps,
    actionCreators
).withExternalProps<{ params: RouteParams }>();
type P = typeof provider.allProps;
export default provider.connect(Poll);