import * as React from 'react';
import {Button} from 'react-bootstrap';
import {sortBy} from 'lodash';

class Poll extends React.Component<any, any> {

  state = this.getState();

  private _onChange = () => {
    this.setState(this.getState());
  }

  private _onVote = (choiceId) => {
    this.props.vote(this.state.id, choiceId);
  }
  
  private _renderPoll = () => {
    let { id, question, choices } = this.state;
    
    choices = sortBy(choices, 'id').map((choice) => {
      return (
        <Button key={choice.id} onClick={ this._onVote.bind(this, choice.id) } bsStyle="primary" bsSize="large" block>{ choice.text }</Button>
      );
    });

    return (
      <div>
        <h2 className="text-center">
          { question }
        </h2>
        <div className="well">
          { choices }
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
        { this.state.question ? this._renderPoll() : this._renderEmpty() }
      </div>
    );
  }
}

export default Poll;