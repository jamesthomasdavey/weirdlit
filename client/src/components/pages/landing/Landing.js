// package
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

// component
import Logo from './Components/Logo';
import BackgroundAnimation from './Components/BackgroundAnimation';
import Search from './../../layout/Search/Search';
import Modal from './../../layout/Modal/Modal';

// css
import classes from './Landing.module.css';

class Landing extends Component {
  state = { modal: '' };
  render() {
    document.title = 'WeirdLit | The Database for Strange Writings';
    let authButtons;
    if (!this.props.auth.isAuthenticated) {
      authButtons = (
        <div className="ui internally celled grid">
          <div className="row">
            <div className="eight wide column">
              {/* <Link to="/login"> */}
              <button
                onClick={() => this.setState({ modal: 'login' })}
                className="ui right floated grey button"
              >
                Sign In
              </button>
              {/* </Link> */}
            </div>
            <div className="eight wide column">
              {/* <Link to="/register"> */}
              <button
                onClick={() => this.setState({ modal: 'register' })}
                className="ui left floated grey button"
              >
                Register
              </button>
              {/* </Link> */}
            </div>
          </div>
        </div>
      );
    }
    return (
      <Fragment>
        <Modal formType={this.state.modal} hideModal={() => this.setState({ modal: '' })} />
        <div className={classes.container}>
          <div className={['ui text container', classes.content__container].join(' ')}>
            <div className={classes.content}>
              <div className={classes.content__inner}>
                <Logo />
                <div className={classes.content__search}>
                  <Search autoFocus history={this.props.history} />
                </div>
                {authButtons}
              </div>
            </div>
          </div>
          <BackgroundAnimation />
        </div>
      </Fragment>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Landing));
