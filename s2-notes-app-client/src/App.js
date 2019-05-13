import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

import { Auth } from "aws-amplify";

class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      //The Auth.currentSession() method throws an error No current user 
      //if nobody is currently logged in. We don’t want to show this error 
      //to users when they load up our app and are not signed in.
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);
    
    //redirect user to login page
    this.props.history.push("/login");
  }

  /*
  //Navbar.Collapse component ensures 
  //that on mobile devices the two links will be collapsed.

  //wrap <NavItem href="/signup">Signup</NavItem>
  //around LinkContainer so when we click
  //navbar items they dont refresh the entire page and use React Router instead
  
  The Fragment component can be thought of as a placeholder component. 
  We need this because in the case the user is not logged in, 
  we want to render two links. To do this we would need to wrap it 
  inside a single component, like a div. But by using the Fragment 
  component it tells React that the two links are inside this component 
  but we don’t want to render any extra HTML.


  Since loading the user session is an asynchronous process, 
  we want to ensure that our app does not change states when it 
  first loads. To do this we’ll hold off rendering our app till 
  isAuthenticating is false.
  We’ll conditionally render our app based on the isAuthenticating flag.
  */
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

/*
App component does not have access to the router props directly 
since it is not rendered inside a Route component. 
To be able to use the router props in our App component 
we will need to use the withRouter Higher-Order Component (or HOC).

We need router props so we can route user to login page after clicking logout.
*/
export default withRouter(App);