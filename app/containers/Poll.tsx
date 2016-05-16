import * as React from 'react';
import {Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import {sortBy} from 'lodash';

import { fetchPoll, vote } from '../actions';

interface Poll {
  id: number;
  name: string;
  choices: Choice[]
}

interface Choice {
  id: number;
  name: string;
}

interface P extends ReactRouter.RouteComponentProps<{ id: number }, {}> {
  vote(pollId: number, choiceId: number): void;
  fetchPoll(pollId: number): void;
  poll: Poll
}

class Poll extends React.Component<P, {}> {
  
  static contextTypes: React.ValidationMap<any> = {
		router: React.PropTypes.object
	};
  
  context: {
    router: ReactRouter.RouterOnContext;
  };
  
  private componentWillMount() {
    this.props.fetchPoll(this.props.params.id); 
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
  
  private _renderEmpty = () => {
    return (
      <div>
        <h2 className="text-center">
          There are no more polls. :(
        </h2>
        <p className="text-center">Check again later!</p>
      </div>
    );
  }

  render() {
    return (
      <div className="container survey-component">
        { this.props.poll ? this._renderPoll() : this._renderEmpty() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    poll: state.polls.poll,
  };
}

export default connect(mapStateToProps, { fetchPoll, vote })(Poll);
