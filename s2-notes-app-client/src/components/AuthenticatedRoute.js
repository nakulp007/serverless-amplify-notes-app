/*
There are a few pages that should not be accessible if a user is not logged in. 
For example, a page with the note should not load if a user is not logged in. 
Currently, we get an error when we do this. This is because the page loads 
and since there is no user in the session, the call to our API fails.

We also have a couple of pages that need to behave in sort of the same way. 
We want the user to be redirected to the homepage if they type in the 
login (/login) or signup (/signup) URL. Currently, the login and sign up 
page end up loading even though the user is already logged in.

There are many ways to solve the above problems. The simplest would be to 
just check the conditions in our containers and redirect. But since we have 
a few containers that need the same logic we can create a special route 
(like the AppliedRoute from the Add the session to the state chapter) for it.

We are going to create two different route components to fix the problem we have.

A route called the AuthenticatedRoute, that checks if the user is authenticated 
before routing.

And a component called the UnauthenticatedRoute, that ensures the user is not 
authenticated.
*/


/*
This component is similar to the AppliedRoute component that we created in the 
Add the session to the state chapter. The main difference being that we look at 
the props that are passed in to check if a user is authenticated. If the user 
is authenticated, then we simply render the passed in component. And if the user 
is not authenticated, then we use the Redirect React Router v4 component to 
redirect the user to the login page. We also pass in the current path to the 
login page (redirect in the querystring). We will use this later to redirect us 
back after the user logs in.

We’ll do something similar to ensure that the user is not authenticated.
*/

import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      cProps.isAuthenticated
        ? <C {...props} {...cProps} />
        : <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location
              .search}`}
          />}
  />;