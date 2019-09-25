import React from 'react';

import './eventItem.css';

const EventItem = props => (
  <li key={props.eventId} className="event__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price}</h2>

    </div>
    <div>
      {props.userId === props.creatorId ?
        <p>You are the owner of this event</p>
        :<button className="btn">View Details</button>
      }
    </div>
  </li>
);

export default EventItem;
