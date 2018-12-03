// package
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// validation
import isEmpty from './../../../validation/is-empty';

// component
import TextInputField from '../../layout/TextInputField/TextInputField';
import TextAreaInputField from '../../layout/TextAreaInputField/TextAreaInputField';

class EditAuthor extends Component {
  state = {
    form: {
      name: '',
      bio: '',
      website: ''
    },
    oldForm: {
      name: '',
      bio: '',
      website: ''
    },
    isLoading: true,
    hasSaved: false,
    hasChanged: false,
    errors: {}
  };
  componentDidMount = () => {
    if (this.props.match.params.authorId) {
      this.updateFromAuthor(this.props.match.params.authorId);
    }
  };
  updateFromAuthor = authorId => {
    axios
      .get(`/api/authors/${authorId}`)
      .then(res => {
        const form = {};
        form.name = res.data.name;
        form.bio = res.data.bio || '';
        form.website = res.data.website || '';
        const oldForm = { ...form };
        this.setState({ form, oldForm, isLoading: false });
      })
      .catch(() => {
        this.props.history.push('/404');
      });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    this.setState(currentState, this.checkIfChanged);
  };
  checkIfChanged = () => {
    const form = this.state.form;
    const oldForm = this.state.oldForm;
    if (
      form.name !== oldForm.name ||
      form.bio !== oldForm.bio ||
      form.website !== oldForm.website
    ) {
      this.setState({ hasChanged: true, hasSaved: false });
    } else {
      this.setState({ hasChanged: false, errors: {} });
    }
  };
  formSubmitHandler = e => {
    e.preventDefault();
    const authorData = this.state.form;
    this.setState({ isLoading: true }, () => {
      axios.put(`/api/authors/${this.props.match.params.authorId}`, authorData).then(res => {
        if (res.data.errors && !isEmpty(res.data.errors)) {
          this.setState({ errors: res.data.errors, isLoading: false });
        } else {
          this.setState({ hasSaved: true, hasChanged: false, errors: {} }, () => {
            this.updateFromAuthor(this.props.match.params.authorId);
          });
        }
      });
    });
  };
  render() {
    if (!this.state.isLoading) {
      document.title = `${this.state.form.name} | WeirdLit`;
    }
    let bioPlaceholder;
    if (!this.state.form.name) {
      bioPlaceholder = 'Write a short bio about the author.';
    } else {
      bioPlaceholder = `Write a short bio about ${this.state.form.name}.`;
    }
    return (
      <div className="ui text container">
        <div className="ui segment">
          <form
            noValidate
            className={['ui form', this.state.isLoading ? 'loading' : ''].join(' ')}
            onSubmit={this.formSubmitHandler}
          >
            <div style={{ paddingBottom: '20px' }}>
              {!this.state.isLoading && <h2>{this.state.form.name}</h2>}
            </div>
            <TextInputField
              name="name"
              label="Name"
              maxLength="40"
              autoFocus
              value={this.state.form.name}
              onChange={this.changeInputHandler}
              error={this.state.errors.name}
            />
            <TextAreaInputField
              name="bio"
              placeholder={bioPlaceholder}
              label="Bio"
              rows="1"
              value={this.state.form.bio}
              onChange={this.changeInputHandler}
              error={this.state.errors.bio}
              minHeight="136px"
              maxLength="1000"
              info={
                this.state.form.bio && `Characters remaining: ${1000 - this.state.form.bio.length}`
              }
            />
            <TextInputField
              name="website"
              label="Website"
              value={this.state.form.website}
              onChange={this.changeInputHandler}
              error={this.state.errors.website}
            />
            <input
              type="submit"
              disabled={!this.state.hasChanged}
              className={['ui tiny primary button', this.state.hasChanged ? '' : 'disabled'].join(' ')}
              style={{ margin: '4px' }}
              value={this.state.hasSaved ? 'Saved' : 'Save'}
            />
            <Link
              to={`/authors/${this.props.match.params.authorId}`}
              style={{ margin: '4px' }}
              className="ui tiny button"
            >
              {this.state.hasSaved ? 'Back' : 'Cancel'}
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default EditAuthor;
