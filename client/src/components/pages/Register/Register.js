// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from './../../../actions/authActions';

// validation
import isEmpty from './../../../validation/is-empty';

// component
import TextInputField from '../../layout/TextInputField/TextInputField';
import FavoriteBookSearch from '../../layout/FavoriteBookSearch/FavoriteBookSearch';
import FavoriteBook from '../../layout/FavoriteBook/FavoriteBook';

// css
import './Register.css';

class Register extends Component {
  state = {
    form: { name: '', email: '', password: '', password2: '', favoriteBook: {} },
    loading: false,
    errors: {}
  };

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, loading: false });
    }
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  };

  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    this.setState(currentState, this.checkIfChanged);
  };

  addFavoriteBookHandler = bookObj => {
    const currentState = this.state;
    currentState.form.favoriteBook = bookObj;
    this.setState(currentState);
  };
  removeFavoriteBookHandler = () => {
    const currentState = this.state;
    currentState.form.favoriteBook = {};
    this.setState(currentState);
  };

  submitFormHandler = e => {
    e.preventDefault();
    this.setState({ loading: true }, () => {
      const newUser = {
        name: this.state.form.name,
        email: this.state.form.email,
        password: this.state.form.password,
        password2: this.state.form.password2,
        favoriteBook: this.state.form.favoriteBook
      };
      this.props.registerUser(newUser, this.props.history);
    });
  };

  render() {
    document.title = 'Register | WeirdLit';
    const { errors } = this.state;

    return (
      <Fragment>
        <div className="ui container">
          <div className="ui one column stackable center aligned page grid">
            <div className="column nine wide">
              <form
                noValidate
                onSubmit={this.submitFormHandler}
                className={[
                  'register__form ui fluid form',
                  this.state.loading ? 'loading' : ''
                ].join(' ')}
              >
                <TextInputField
                  name="name"
                  placeholder="Name"
                  maxLength="40"
                  autoFocus
                  value={this.state.name}
                  onChange={this.changeInputHandler}
                  error={errors.name}
                />
                <TextInputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.changeInputHandler}
                  error={errors.email}
                />
                <TextInputField
                  name="password"
                  type="password"
                  maxLength="30"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.changeInputHandler}
                  error={errors.password}
                />
                <TextInputField
                  name="password2"
                  type="password"
                  maxLength="30"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  onChange={this.changeInputHandler}
                  error={errors.password2}
                />
                <div className={['ui field', this.state.errors.favoriteBook && 'error'].join(' ')}>
                  <label>What is your favorite book? (Optional)</label>
                  {!isEmpty(this.state.form.favoriteBook) && (
                    <FavoriteBook
                      removeFavoriteBookHandler={this.removeFavoriteBookHandler}
                      title={this.state.form.favoriteBook.title}
                      isVisible={!isEmpty(this.state.form.favoriteBook)}
                    />
                  )}
                  <FavoriteBookSearch
                    addFavoriteBookHandler={this.addFavoriteBookHandler}
                    isVisible={isEmpty(this.state.form.favoriteBook)}
                  />
                  {this.state.errors.favoriteBook && (
                    <div className="ui pointing basic label">{this.state.errors.favoriteBook}</div>
                  )}
                </div>
                <input type="submit" className="ui button grey" value="Register" />
              </form>
              <div className="ui message">
                <p>Already have an account?</p>
                <p>
                  <Link to="/login">Sign in here!</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
