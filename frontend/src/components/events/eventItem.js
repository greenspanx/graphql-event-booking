import React from 'react';

import './eventItem.css';

const EventItem = props => (
  <li key={props.eventId} className="event__list-item">
    <div>
      <h1>{props.title}</h1>
      <div className="event__list-item-price">
        <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
      </div>
    </div>
    <div>
      {props.userId === props.creatorId ?
        <p>You are the owner of this event</p>
        :<button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
      }
    </div>
  </li>
);

export default EventItem;
