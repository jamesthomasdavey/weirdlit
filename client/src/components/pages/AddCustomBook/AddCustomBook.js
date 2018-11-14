// package
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import imageCheck from 'image-check';
// import moment from 'moment';

// component
import TextInputField from './../../layout/TextInputField/TextInputField';
import TextAreaInputField from './../../layout/TextAreaInputField/TextAreaInputField';
import IdentifierInputField from './components/IdentifierInputField/IdentifierInputField';
import SuccessCard from './components/SuccessCard/SuccessCard';

// validation
import isEmpty from './../../../validation/is-empty';

// css
// import classes from './AddCustomBook.module.css';

class AddCustomBook extends Component {
  state = {
    form: {
      title: '',
      subtitle: '',
      authors: '',
      publishedDate: '',
      pageCount: '',
      isbn10: '',
      isbn13: '',
      tags: '',
      description: '',
      image: {
        status: false,
        imageUrl: '',
        loading: false
      }
    },
    imageInput: '',
    isLoading: false,
    hasSubmitted: false,
    errors: {}
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId) {
      this.updateFromBook(this.props.match.params.bookId);
    }
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    this.setState(currentState, this.checkIfChanged);
  };
  validateImageUrlHandler = e => {
    const imageUrl = e.target.value;
    this.setState({ imageInput: imageUrl }, () => {
      if (imageUrl.length > 500) {
        const currentState = this.state;
        currentState.form.image = {
          status: false,
          imageUrl: '',
          loading: false
        };
        currentState.errors.image = 'Please use a shorter image URL';
        this.setState(currentState);
      } else {
        const currentState = this.state;
        currentState.form.image.loading = true;
        this.setState(currentState, () => {
          imageCheck(imageUrl)
            .then(() => {
              const currentState = this.state;
              currentState.form.image = {
                status: true,
                imageUrl,
                loading: false
              };
              currentState.errors.image = null;
              this.setState(currentState);
            })
            .catch(() => {
              const currentState = this.state;
              currentState.form.image = {
                status: false,
                imageUrl: '',
                loading: false
              };
              currentState.errors.image = 'Invalid image URL';
              this.setState(currentState);
            });
        });
      }
    });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true }, () => {
      const payload = {
        title: this.state.form.title,
        subtitle: this.state.form.subtitle,
        authors: this.state.form.authors,
        publishedDate: this.state.form.publishedDate,
        pageCount: this.state.form.pageCount,
        isbn10: this.state.form.isbn10,
        isbn13: this.state.form.isbn13,
        tags: this.state.form.tags,
        description: this.state.form.description,
        image: this.state.form.image.imageUrl
      };
      axios
        .post('/api/books/custom', payload)
        .then(res => {
          if (res.data.errors && !isEmpty(res.data.errors)) {
            this.setState({ errors: res.data.errors, isLoading: false });
          } else {
            this.setState({ errors: {}, isLoading: false, hasSubmitted: true });
          }
        })
        .catch(err => {});
    });
  };
  render() {
    if (!this.state.hasSubmitted) {
      document.title = `Add ${this.state.form.title ? this.state.form.title : 'a Book'} | WeirdLit`;
    } else {
      document.title = 'Success | WeirdLit';
    }

    return (
      <div className="ui text container">
        <div className="ui segment">
          {!this.state.hasSubmitted ? (
            <form
              noValidate
              className={['ui form', this.state.isLoading ? 'loading' : ''].join(' ')}
              onSubmit={this.formSubmitHandler}
            >
              <div style={{ paddingBottom: '20px' }}>
                <h2>Add {this.state.form.title ? <em>{this.state.form.title}</em> : 'a Book'}</h2>
              </div>
              <TextInputField
                name="title"
                label="* Title"
                autoFocus
                maxLength="50"
                value={this.state.form.title}
                onChange={this.changeInputHandler}
                error={this.state.errors.title}
              />
              <TextInputField
                name="subtitle"
                label="Subtitle"
                maxLength="75"
                value={this.state.form.subtitle}
                onChange={this.changeInputHandler}
                error={this.state.errors.subtitle}
              />
              <TextInputField
                name="authors"
                label="* Authors"
                value={this.state.form.authors}
                onChange={this.changeInputHandler}
                error={this.state.errors.authors}
                info="Please list all authors, separated by commas."
              />
              <TextInputField
                name="publishedDate"
                type="date"
                label="* Date Published"
                value={this.state.form.publishedDate}
                onChange={this.changeInputHandler}
                error={this.state.errors.publishedDate}
              />
              <div className={['field', this.state.errors.pageCount && 'error'].join(' ')}>
                <label htmlFor="pageCount">* Page Count</label>
                <input
                  id="pageCount"
                  name="pageCount"
                  type="number"
                  value={this.state.form.pageCount}
                  onChange={this.changeInputHandler}
                />
                {this.state.errors.pageCount && (
                  <div className="ui pointing basic label">{this.state.errors.pageCount}</div>
                )}
              </div>
              <div className="ui segments">
                <div className="ui segment">
                  <label htmlFor="googleId">
                    <h5>Identifiers</h5>
                  </label>
                </div>
                <div className="ui secondary segment">
                  <IdentifierInputField
                    name="isbn10"
                    label="ISBN 10"
                    maxLength="10"
                    error={this.state.errors.isbn10}
                    value={this.state.form.isbn10}
                    onChange={this.changeInputHandler}
                  />
                  <IdentifierInputField
                    name="isbn13"
                    label="ISBN 13"
                    maxLength="13"
                    error={this.state.errors.isbn13}
                    value={this.state.form.isbn13}
                    onChange={this.changeInputHandler}
                  />
                </div>
              </div>
              <TextInputField
                name="tags"
                label="Tags"
                maxLength="200"
                value={this.state.form.tags}
                onChange={this.changeInputHandler}
                error={this.state.errors.tags}
              />
              <TextAreaInputField
                name="description"
                placeholder={`Write a description for ${
                  this.state.form.title ? this.state.form.title + '.' : 'this book.'
                }`}
                label="* Description"
                rows="1"
                value={this.state.form.description}
                onChange={this.changeInputHandler}
                error={this.state.errors.description}
                minHeight="240px"
                maxLength="3000"
                info={
                  this.state.form.description &&
                  `Characters remaining: ${3000 - this.state.form.description.length}`
                }
              />

              <div className="field ui">
                <label htmlFor="imageUrl">* Cover Image</label>
                <div className="ui center aligned segment">
                  {this.state.form.image.status && (
                    <div className="ui small image">
                      <img alt="cover" src={this.state.form.image.imageUrl} />
                    </div>
                  )}
                  <div
                    className={['field ui', this.state.errors.image ? 'error' : ''].join(' ')}
                    style={{ marginTop: '12px' }}
                  >
                    <input
                      id="imageUrl"
                      name="imageUrl"
                      type="text"
                      placeholder="Paste an image URL here."
                      value={this.state.imageInput}
                      onChange={this.validateImageUrlHandler}
                    />
                    {this.state.errors.image && (
                      <div className="ui pointing basic label">{this.state.errors.image}</div>
                    )}
                  </div>
                </div>
              </div>
              <input type="submit" className="ui primary button" value="Submit" />
              <Link to={'/books/add'} style={{ marginLeft: '1rem' }} className="ui button">
                Cancel
              </Link>
            </form>
          ) : (
            <SuccessCard />
          )}
        </div>
      </div>
    );
  }
}

export default AddCustomBook;
