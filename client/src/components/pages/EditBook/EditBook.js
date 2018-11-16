// package
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import imageCheck from 'image-check';
import moment from 'moment';

// component
import TextInputField from './../../layout/TextInputField/TextInputField';
import IdentifierInputField from './components/IdentifierInputField/IdentifierInputField';
import Tags from './components/Tags/Tags';
import Authors from './../../layout/Authors/Authors';
import AuthorSearch from './../../layout/AuthorSearch/AuthorSearch';

// validation
import isEmpty from './../../../validation/is-empty';

// css
import classes from './EditBook.module.css';

class EditBook extends Component {
  state = {
    form: {
      title: '',
      subtitle: '',
      authors: [],
      publishedDate: '',
      pageCount: '',
      googleId: '',
      isbn10: '',
      isbn13: '',
      tags: [],
      description: '',
      image: {
        status: false,
        imageUrl: '',
        loading: false
      }
    },
    oldForm: {
      title: '',
      subtitle: '',
      authors: '',
      publishedDate: '',
      pageCount: '',
      googleId: '',
      isbn10: '',
      isbn13: '',
      tags: [],
      description: '',
      image: ''
    },
    imageInput: '',
    isLoading: true,
    hasChanged: false,
    hasSaved: false,
    errors: {}
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId) {
      this.updateFromBook(this.props.match.params.bookId);
    } else {
      this.props.history.push('/404');
    }
  };
  updateFromBook = bookId => {
    axios
      .get(`/api/books/${bookId}/edit`)
      .then(res => {
        const form = this.state.form;
        form.title = res.data.title;
        form.subtitle = res.data.subtitle ? res.data.subtitle : '';
        form.authors = res.data.authors;
        form.publishedDate = moment.utc(res.data.publishedDate).format('YYYY-MM-DD');
        form.pageCount = res.data.pageCount;
        form.googleId = res.data.identifiers.googleId ? res.data.identifiers.googleId : '';
        form.isbn10 = res.data.identifiers.isbn10 ? res.data.identifiers.isbn10 : '';
        form.isbn13 = res.data.identifiers.isbn13 ? res.data.identifiers.isbn13 : '';
        form.tags = res.data.tags.length > 0 ? res.data.tags.map(tag => tag._id).sort() : [];
        form.description = res.data.description;
        form.image = { status: false, imageUrl: '', loading: false };
        const oldForm = { ...form };
        oldForm.image = res.data.image.original;
        oldForm.authors = [...form.authors];
        oldForm.tags = [...form.tags];
        this.setState({
          form,
          oldForm,
          imageInput: '',
          isLoading: false,
          hasChanged: false,
          errors: {}
        });
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
  addAuthorHandler = author => {
    const currentState = this.state;
    const alreadyAddedNames = currentState.form.authors.map(author => author.name);
    if (!alreadyAddedNames.includes(author)) {
      currentState.form.authors.push(author);
      this.setState(currentState, this.checkIfChanged);
    }
  };
  removeAuthorHandler = authorName => {
    const currentState = this.state;
    const authorNamesList = currentState.form.authors.map(author => author.name);
    const removeIndex = authorNamesList.indexOf(authorName);
    currentState.form.authors.splice(removeIndex, 1);
    this.setState(currentState, this.checkIfChanged);
  };
  checkIfChanged = () => {
    const form = this.state.form;
    const oldForm = this.state.oldForm;
    if (
      form.title !== oldForm.title ||
      form.subtitle !== oldForm.subtitle ||
      form.authors.join('') !== oldForm.authors.join('') ||
      form.publishedDate !== oldForm.publishedDate ||
      parseInt(form.pageCount) !== parseInt(oldForm.pageCount) ||
      form.googleId !== oldForm.googleId ||
      form.isbn10 !== oldForm.isbn10 ||
      form.isbn13 !== oldForm.isbn13 ||
      form.tags.join('') !== oldForm.tags.join('') ||
      form.description !== oldForm.description
    ) {
      this.setState({ hasChanged: true, hasSaved: false });
    } else if (!this.state.form.image.status) {
      this.setState({ hasChanged: false, errors: {} });
    }
  };
  toggleSelectTagHandler = tagId => {
    let currentState = this.state;
    if (currentState.form.tags.includes(tagId)) {
      const deleteIndex = currentState.form.tags.indexOf(tagId);
      currentState.form.tags.splice(deleteIndex, 1);
    } else {
      currentState.form.tags.push(tagId);
    }
    currentState.form.tags = currentState.form.tags.sort();
    this.setState(currentState, this.checkIfChanged);
  };
  validateImageUrlHandler = e => {
    const imageUrl = e.target.value;
    this.setState({ imageInput: imageUrl }, () => {
      if (!imageUrl) {
        this.checkIfChanged();
      } else if (imageUrl.length > 500) {
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
              currentState.hasChanged = true;
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
        googleId: this.state.form.googleId,
        isbn10: this.state.form.isbn10,
        isbn13: this.state.form.isbn13,
        tags: this.state.form.tags,
        description: this.state.form.description,
        image: ''
      };
      if (this.state.form.image.status) {
        payload.image = this.state.form.image.imageUrl;
      }
      axios.put(`/api/books/${this.props.match.params.bookId}`, payload).then(res => {
        if (res.data.errors && !isEmpty(res.data.errors)) {
          this.setState({ errors: res.data.errors, isLoading: false });
        } else {
          this.setState({ hasChanged: false, hasSaved: true }, () => {
            this.updateFromBook(this.props.match.params.bookId);
          });
        }
      });
    });
  };
  render() {
    document.title = `Edit ${this.state.form.title ? this.state.form.title : 'Book'} | WeirdLit`;

    return (
      <div className="ui text container">
        <div className="ui segment">
          <form
            noValidate
            className={['ui form', this.state.isLoading ? 'loading' : ''].join(' ')}
            onSubmit={this.formSubmitHandler}
          >
            <div style={{ paddingBottom: '20px' }}>
              <h2>
                Edit <em>{this.state.form.title}</em>
              </h2>
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
            <div className="ui field">
              <label>* Authors</label>
              <div className={['ui segment', this.state.errors.authors && 'error'].join(' ')}>
                <Authors
                  names={this.state.form.authors.map(author => author.name)}
                  removeAuthorHandler={this.removeAuthorHandler}
                />
                <AuthorSearch
                  addAuthorHandler={this.addAuthorHandler}
                  alreadyAddedAuthors={this.state.form.authors}
                />
                {this.state.errors.authors && (
                  <div className="ui pointing basic label">{this.state.errors.authors}</div>
                )}
              </div>
            </div>
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
                  name="googleId"
                  label="Google ID"
                  error={this.state.errors.googleId}
                  value={this.state.form.googleId}
                  onChange={this.changeInputHandler}
                />
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
            <div className="ui field">
              <label>Tags</label>
              <div className="ui segment">
                <Tags
                  selectedTags={this.state.form.tags}
                  toggleSelectTagHandler={this.toggleSelectTagHandler}
                />
              </div>
            </div>
            <div className={['ui field', this.state.errors.description ? 'error' : ''].join(' ')}>
              <label htmlFor="description">* Description</label>
              <textarea
                onChange={this.changeInputHandler}
                id="description"
                name="description"
                maxLength="3000"
                className={classes.description}
                style={{ minHeight: '240px' }}
                value={this.state.form.description}
              />
              {this.state.errors.description && (
                <div className="ui pointing basic label">{this.state.errors.description}</div>
              )}
            </div>
            <div className="ui center aligned segment">
              <div className="ui field">
                <label>{this.state.form.image.status ? 'Previous' : 'Current'} Image</label>
                <div className="ui small image">
                  <img alt="cover" src={this.state.oldForm.image} />
                </div>
              </div>
              {this.state.form.image.status && (
                <div className="ui field">
                  <label>Updated Image</label>
                  <div className="ui small image">
                    <img alt="cover" src={this.state.form.image.imageUrl} />
                  </div>
                </div>
              )}
              <div className={['field ui', this.state.errors.image ? 'error' : ''].join(' ')}>
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
            <input
              type="submit"
              disabled={!this.state.hasChanged}
              className={['ui primary button', this.state.hasChanged ? '' : 'disabled'].join(' ')}
              value={this.state.hasSaved ? 'Saved' : 'Save'}
            />
            <Link
              to={`/books/${this.props.match.params.bookId}`}
              style={{ marginLeft: '1rem' }}
              className="ui button"
            >
              {this.state.hasSaved ? 'Back to Book' : 'Cancel'}
            </Link>
            <Link
              to={`/books/${this.props.match.params.bookId}/delete`}
              style={{ marginLeft: '1rem' }}
              className="ui negative button"
            >
              Delete {this.state.form.title}
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditBook);
