import * as React from 'react';
import { connect } from 'react-redux';
import {Input, Button, Glyphicon, Alert} from 'react-bootstrap';

import { addPoll } from '../actions';

interface P extends ReactRouter.RouteComponentProps<{}, {}> {
  addPoll(state: S): Promise<any>
}

interface S {
  name: string;
  choices: string[];
  success: boolean;
}

class AddPoll extends React.Component<P, S> {

  state = this._getClearState(); 
  
  refs: {
    [string: string]: any;
    addPoll:any;
  }
  
  private _getClearState(): S {
    return {
      name: '',
      choices: [ null, null, null ],
      success: null
    }
  }

  private _onChange = (): void => {
    this.refs.addPoll.reset();
    let state = this._getClearState();
    state.success = true;
    this.setState(state);
  }

  private _onInputChange = (e: React.SyntheticEvent, index: number): void => {
    let target: HTMLButtonElement = e.target as HTMLButtonElement;
    let state = Object.assign({}, this.state);
    if (target.name === 'choices') {
      state[target.name][index] = target.value
    } else {
      state[target.name] = target.value; 
    }
    this.setState(state);
  }

  private _onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let { name, choices } = this.state;

    if (name && choices && choices.length > 1) {
      let filled = choices.filter((choice) => { return choice != null; }); 
      if (filled.length === choices.length) {
        return this.props.addPoll(this.state).then(() => {
          this._onChange();
        });
      }
    }

    let state = Object.assign({}, this.state);
    state.success = false;
    this.setState(state);
  }

  private _addChoice = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    let state = Object.assign({}, this.state);
    state.choices.push(null);
    this.setState(state);
  }

  private _removeChoice = (index: number): void => {
    let state = Object.assign({}, this.state);
    state.choices.splice(index, 1);
    this.setState(state);
  }

  render(): React.ReactElement<any> {
    let choices = this.state.choices.map((choice, index) => {
      return (
        <Input key={index} value={ choice || '' } name="choices" type="text" placeholder="Enter a choice"
        onChange={e => this._onInputChange(e, index)} buttonAfter={(
          <Button bsStyle="danger" onClick={this._removeChoice.bind(this, index)}>
            <Glyphicon glyph="minus" />
          </Button>
        )}/> 
      ); 
    });

    return (
      <div>

        { this.state.success ? (
          <Alert bsStyle="success">
            <strong>Success!</strong> A new poll has been added.
          </Alert>
          ) : null}

        { this.state.success === false ? (
          <Alert bsStyle="danger">
            <strong>Error!</strong> Question and Choice fields cannot be blank.
          </Alert>
          ) : null}

        <form ref="addPoll">
          <h2>Add a New Poll</h2> 
          <Input name="name" type="text" placeholder="Enter a question" value={this.state.name}
          onChange={this._onInputChange} /> 
          <hr />
          <h2>Choices</h2>
          <Button bsStyle="default" onClick={this._addChoice} style={{ margin: '10px 0' }}>
            <Glyphicon glyph="plus" />
            &nbsp;Add a Choice
          </Button>
          <div style={{ color: 'red', display: this.state.choices.length < 2 ? 'inline' : 'none' }}> 2 or more choices required</div>
          { choices }
        </form>
        <hr />
        <Button onClick={this._onSubmit} bsStyle="primary" disabled={this.state.choices.length < 2}>
          <Glyphicon glyph="save" />
          &nbsp;Save New Poll
        </Button>
      </div>
    );
  }
}

export default connect(null, { addPoll })(AddPoll);
