// package
import React, { Component } from 'react';
import { Modal as SemanticModal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// component
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';

class Modal extends Component {
  state = {
    formType: ''
  };
  componentWillReceiveProps = nextProps => {
    this.setState({ formType: nextProps.formType });
  };
  switchFormTypeHandler = () => {
    const currentFormType = this.state.formType;
    if (currentFormType === 'login') {
      this.setState({ formType: 'register' });
    } else if (currentFormType === 'register') {
      this.setState({ formType: 'login' });
    }
  };
  closeModalHandler = () => {
    this.setState({ formType: '' }, this.props.hideModal);
  };
  render() {
    let form;
    if (this.state.formType === 'login') {
      form = (
        <LoginForm
          closeModalHandler={this.closeModalHandler}
          switchFormTypeHandler={this.switchFormTypeHandler}
        />
      );
    } else {
      form = (
        <RegisterForm
          closeModalHandler={this.closeModalHandler}
          switchFormTypeHandler={this.switchFormTypeHandler}
        />
      );
    }
    return (
      <SemanticModal
        centered
        dimmer="inverted"
        open={this.state.formType ? true : false}
        closeOnDimmerClick
        onClose={this.closeModalHandler}
        size="tiny"
      >
        {form}
      </SemanticModal>
    );
  }
}

Modal.propTypes = {
  formType: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default Modal;
