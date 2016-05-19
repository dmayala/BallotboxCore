import * as React from 'react';
import { connect } from 'react-redux';
import {Input, Button, Glyphicon, Accordion, Panel, Modal} from 'react-bootstrap';
import { PieChart } from 'rd3';
import {sortBy} from 'lodash';

import { removePoll, fetchPolls } from '../actions';

interface Poll {
  id: number;
  name: string;
  choices: Choice[]
}

interface Choice {
  id: number;
  name: string;
  votes: Vote[]
}

interface Vote {
  id: number;
}

interface P extends ReactRouter.RouteComponentProps<{}, {}> {
  fetchPolls(username: string): void;
  removePoll(pollId: number): void;
  polls: Poll[];
  user: string;
}

interface S {
  searchTerm: string;
  showModal: boolean;
  removePollId: number;
}

class MyPolls extends React.Component<P, S> {

  state: S = this._getState();
  
  refs: {
    [string: string]: any;
    resultSearch: any;
  }
  
  componentWillMount() {
    if (this.props.user) this.props.fetchPolls(this.props.user);
  }
  
  private _getState(): S {
    return {
      searchTerm: '',
      showModal: false,
      removePollId: null
    };
  }

  private _onChange = (): void => {
    this.setState(this._getState());
  }

  private _handleSearch = (): void => {
    let state: S = Object.assign({}, this.state);
    state.searchTerm = this.refs.resultSearch.getValue().toLowerCase();
    this.setState(state);
  }

  private _openModal = (pollId: number): void => {
    this.setState(Object.assign(this.state, { showModal: true, removePollId: pollId }));
  }

  private _removePoll = (): void => {
    this.setState(Object.assign(this.state, { showModal: false }));
    this.props.removePoll(this.state.removePollId);
  }

  render(): React.ReactElement<any> {
    let polls: JSX.Element[] = this.props.polls.filter((poll) => {
      return poll.name.toLowerCase().indexOf(this.state.searchTerm) !== -1;
    }).map(poll => {
      let choices = sortBy(poll.choices, 'id').map((choice, index) => {
        return { label: choice.name, value: choice.votes.length };        
      });
      
      let title: JSX.Element = (
        <div className="clearfix">
          {poll.name} 
          <Button onClick={(e) => { e.stopPropagation(); e.preventDefault(); this._openModal(poll.id) }} className="pull-right" bsStyle="danger" bsSize="xsmall">
            <Glyphicon glyph="trash" />
          </Button>
        </div>
      );
            
      return (
        <Panel href="#" key={poll.id} eventKey={poll.id} header={title}>
          <PieChart
                   data={choices} 
                   width={700}
                   height={500}
                   radius={200}
                   innerRadius={100}
                   sectorBorderColor="white"
                   valueTextFormatter={(v) => `${v} vote(s)`}  
                   hoverAnimation={false}            
                   />
        </Panel>
      ); 
    });

    let close = (): void => this.setState(Object.assign(this.state, { showModal: false }));

    return (
      <div id="myPolls">
            <h2>My Polls - { this.props.user }</h2>       
          <Input ref="resultSearch" onChange={this._handleSearch}name="search" type="text" placeholder="Search for polls" /> 
          <Accordion>
            { polls }
          </Accordion>
          <Modal show={this.state.showModal} onHide={close}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Poll</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this poll?
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="danger" onClick={this._removePoll}>Delete</Button>
              <Button onClick={close}>Cancel</Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    polls: state.polls.all,
    user: state.auth.username
  };
}

export default connect(mapStateToProps, { fetchPolls, removePoll })(MyPolls);
