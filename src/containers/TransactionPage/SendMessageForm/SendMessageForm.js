import React, { Component } from 'react';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';

import { Form, FieldTextInput, SecondaryButtonInline } from '../../../components';

import css from './SendMessageForm.module.css';
import { CloudUpload, X } from 'lucide-react';
import PriceGenratePopUp from './PriceGenratePopUp';

const BLUR_TIMEOUT_MS = 100;

const IconSendMessage = () => {
  return (
    <svg
      className={css.sendIcon}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={css.strokeMatter} fill="none" fillRule="evenodd" strokeLinejoin="round">
        <path d="M12.91 1L0 7.003l5.052 2.212z" />
        <path d="M10.75 11.686L5.042 9.222l7.928-8.198z" />
        <path d="M5.417 8.583v4.695l2.273-2.852" />
      </g>
    </svg>
  );
};

/**
 * Send message form
 *
 * @component
 * @param {Object} props - The props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that extends the default class for the root element
 * @param {string} props.formId - The form id
 * @param {boolean} props.inProgress - Whether the form is in progress
 * @param {string} props.messagePlaceholder - The message placeholder
 * @param {Function} props.onSubmit - The on submit function
 * @param {Function} props.onFocus - The on focus function
 * @param {Function} props.onBlur - The on blur function
 * @param {propTypes.error} props.sendMessageError - The send message error
 * @param {intlShape} props.intl - The intl
 * @returns {JSX.Element} The SendMessageForm component
 */
class SendMessageFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      error: "",
      openPricePopUp: false
    }
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.blurTimeoutId = null;
    this.fileInputRef = React.createRef(null);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.triggerFileInput = this.triggerFileInput.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
    window.clearTimeout(this.blurTimeoutId);
  }

  handleBlur() {
    // We only trigger a blur if another focus event doesn't come
    // within a timeout. This enables keeping the focus synced when
    // focus is switched between the message area and the submit
    // button.
    this.blurTimeoutId = window.setTimeout(() => {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }, BLUR_TIMEOUT_MS);
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Add upload logic here
      this.setState({ file: file })
    }
  };

  triggerFileInput = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  removeFile() {
    this.setState({ file: null });
  }

  handleError(errorMsg) {
    if (errorMsg) {
      this.setState({ error: errorMsg });
      setTimeout(() => {
        this.setState({ error: '' });
      }, 3000)
    }
  }

  render() {

    return (
      <FinalForm
        {...this.props}
        onSubmit={(values, form) => this.props.onSubmit(values, form, { file: this.state.file, removeFile: () => this.removeFile() }, (msg) => this.handleError(msg))}
        render={formRenderProps => {
          const {
            rootClassName,
            className,
            messagePlaceholder,
            handleSubmit,
            inProgress = false,
            sendMessageError,
            invalid,
            form,
            formId,
          } = formRenderProps;

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = inProgress;
          const submitDisabled = invalid || submitInProgress;
          return (
            <>
              <Form className={classes} onSubmit={values => handleSubmit(values, form, this.state.file)} enctype="multipart/form-data">
                {this.state.file &&
                  <div className={css.SelectedFile}>
                    <p className={css.Filename}>{this.state.file?.name}</p>
                    <X className={css.closeIcon} onClick={() => this.removeFile()} />
                  </div>
                }
                <div>
                  <FieldTextInput
                    inputRootClass={css.textarea}
                    type="textarea"
                    id={formId ? `${formId}.message` : 'message'}
                    name="message"
                    placeholder={messagePlaceholder}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                  {this.state.error && <p className={css.errorStyle}>{this.state.error}</p>}
                  {sendMessageError ? (
                    <div className={css.errorContainer}>
                      <p className={css.error}>
                        <FormattedMessage id="SendMessageForm.sendFailed" />
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className={css.submitContainer}>
                  <SecondaryButtonInline className={css.submitButton} onClick={() => this.setState({ openPricePopUp: true })}>
                    Generate Price
                  </SecondaryButtonInline>
                  <div className={css.sendButtons}>
                    <SecondaryButtonInline
                      className={css.submitButton}
                      inProgress={submitInProgress}
                      disabled={submitDisabled}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                    >
                      <IconSendMessage />
                      <FormattedMessage id="SendMessageForm.sendMessage" />
                    </SecondaryButtonInline>
                    <div className={css.uploadContainer}>
                      <SecondaryButtonInline
                        type="button"
                        className={css.uplopadButton}
                        onClick={this.triggerFileInput}
                      >
                        <CloudUpload />
                      </SecondaryButtonInline>
                      <input
                        type="file"
                        accept="image/*,.pdf,video/*"
                        ref={this.fileInputRef}
                        onChange={this.handleFileChange}
                        className={css.hiddenInput}
                      />
                    </div>
                  </div>
                </div>
              </Form>
              <PriceGenratePopUp open={this.state.openPricePopUp} onClose={() => this.setState({ openPricePopUp: false })} />
            </>
          );
        }}
      />
    );
  }
}

const SendMessageForm = compose(injectIntl)(SendMessageFormComponent);

SendMessageForm.displayName = 'SendMessageForm';

export default SendMessageForm;
