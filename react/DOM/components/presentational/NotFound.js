import React from 'react';
import { Link } from 'react-router';

/**
 * Draw 404 page
 * @returns ReactElement
 */
const NotFound = () => (
    <div className="ui basic center aligned segment">
        Application doesn't have information under such route.
        <br />
        <Link to="/">Start page</Link>
    </div>
);

export default NotFound;
