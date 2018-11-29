// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal as SemanticModal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { registerUser } from './../../../../../actions/authActions';

// validation
import isEmpty from './../../../../../validation/is-empty';

// component
import TextInputField from './../../../TextInputField/TextInputField';
import FavoriteBookSearch from './../../../FavoriteBookSearch/FavoriteBookSearch';
import FavoriteBook from './../../../FavoriteBook/FavoriteBook';

// css
import classes from './RegisterForm.module.css';

class RegisterForm extends Component {
  state = {
    form: { name: '', email: '', password: '', password2: '', favoriteBook: {} },
    loading: false,
    errors: {}
  };

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.closeModalHandler();
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.auth.isAuthenticated) {
      this.props.closeModalHandler();
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, loading: false });
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
      this.props.registerUser(newUser);
    });
  };

  render() {
    return (
      <Fragment>
        <SemanticModal.Header>Register</SemanticModal.Header>
        <SemanticModal.Content>
          <form
            noValidate
            onSubmit={this.submitFormHandler}
            className={['ui form', this.state.loading ? 'loading' : ''].join(' ')}
          >
            <TextInputField
              name="name"
              placeholder="Name"
              maxLength="40"
              autoFocus
              value={this.state.name}
              onChange={this.changeInputHandler}
              error={this.state.errors.name}
            />
            <TextInputField
              name="email"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.changeInputHandler}
              error={this.state.errors.email}
            />
            <TextInputField
              name="password"
              type="password"
              maxLength="30"
              placeholder="Password"
              value={this.state.password}
              onChange={this.changeInputHandler}
              error={this.state.errors.password}
            />
            <TextInputField
              name="password2"
              type="password"
              maxLength="30"
              placeholder="Confirm Password"
              value={this.state.password2}
              onChange={this.changeInputHandler}
              error={this.state.errors.password2}
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
            <input
              style={{ display: 'block', margin: '0 auto' }}
              type="submit"
              className="ui grey button"
              value="Register"
            />
          </form>
          <div className="ui message" style={{ textAlign: 'center' }}>
            <p>Already have an account?</p>
            <p>
              <span className={classes.switchLink} onClick={this.props.switchFormTypeHandler}>
                Sign in here!
              </span>
            </p>
          </div>
        </SemanticModal.Content>
      </Fragment>
    );
  }
}

RegisterForm.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  closeModalHandler: PropTypes.func.isRequired,
  switchFormTypeHandler: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(RegisterForm);
