import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';
import { propTypes } from '../../../util/types';
import {
  isErrorNoPermissionForInitiateTransactions,
  isErrorNoPermissionForUserPendingApproval,
  isTooManyRequestsError,
} from '../../../util/errors';

import {
  Form,
  PrimaryButton,
  FieldTextInput,
  IconInquiry,
  Heading,
  NamedLink,
  FieldCheckbox,
} from '../../../components';

import css from './InquiryForm.module.css';
import { NO_ACCESS_PAGE_INITIATE_TRANSACTIONS } from '../../../util/urlHelpers';
import { useConfiguration } from '../../../context/configurationContext';

const ErrorMessage = props => {
  const { error } = props;
  const userPendingApproval = isErrorNoPermissionForUserPendingApproval(error);
  const userHasNoTransactionRights = isErrorNoPermissionForInitiateTransactions(error);

  // No transaction process attached to listing
  return error ? (
    <p className={css.error}>
      {error.message === 'No transaction process attached to listing' ? (
        <FormattedMessage id="InquiryForm.sendInquiryErrorNoProcess" />
      ) : isTooManyRequestsError(error) ? (
        <FormattedMessage id="InquiryForm.tooManyRequestsError" />
      ) : userPendingApproval ? (
        <FormattedMessage id="InquiryForm.userPendingApprovalError" />
      ) : userHasNoTransactionRights ? (
        <FormattedMessage
          id="InquiryForm.noTransactionRightsError"
          values={{
            NoAccessLink: msg => (
              <NamedLink
                name="NoAccessPage"
                params={{ missingAccessRight: NO_ACCESS_PAGE_INITIATE_TRANSACTIONS }}
              >
                {msg}
              </NamedLink>
            ),
          }}
        />
      ) : (
        <FormattedMessage id="InquiryForm.sendInquiryError" />
      )}
    </p>
  ) : null;
};

/**
 * The InquiryForm component.
 * NOTE: this InquiryForm is only for booking & purchase processes
 * The default-inquiry process is handled differently
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {string} [props.submitButtonWrapperClassName] - Custom class to be passed for the submit button wrapper
 * @param {boolean} [props.inProgress] - Whether the inquiry is in progress
 * @param {string} props.listingTitle - The listing title
 * @param {string} props.authorDisplayName - The author display name
 * @param {propTypes.error} props.sendInquiryError - The send inquiry error
 * @returns {JSX.Element} inquiry form component
 */
const InquiryForm = props => (
  <FinalForm
    {...props}
    initialValues={{extra_add_on: []}}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        submitButtonWrapperClassName,
        formId,
        handleSubmit,
        inProgress = false,
        listingTitle,
        authorDisplayName,
        sendInquiryError,
        listing,
        values
      } = fieldRenderProps;
      const config=useConfiguration()
      const avaliableAddOn= config?.listing?.listingFields?.find(addon=> addon.key === "extras_availale")
      const aaliableOption=avaliableAddOn?.enumOptions?.filter(data=> listing?.attributes?.publicData?.extras_availale?.includes(data.option))
      const intl = useIntl();

      console.log('values>>',values?.extra_add_on?.length)
      const messageLabel = intl.formatMessage(
        {
          id: 'InquiryForm.messageLabel',
        },
        { authorDisplayName }
      );
      const messagePlaceholder = intl.formatMessage(
        {
          id: 'InquiryForm.messagePlaceholder',
        },
        { authorDisplayName }
      );
      const messageRequiredMessage = intl.formatMessage({
        id: 'InquiryForm.messageRequired',
      });
      const messageRequired = validators.requiredAndNonEmptyString(messageRequiredMessage);

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit} enforcePagePreloadFor="OrderDetailsPage">
          {/* <IconInquiry className={css.icon} /> */}
          {/* <Heading as="h2" rootClassName={css.heading}>
            <FormattedMessage id="InquiryForm.heading" values={{ listingTitle }} />
          </Heading> */}



          <div className={'modal-overlay'}>
      <div className="modal-box inqueryFormCustome">
        <h2 className="modal-title">Additional Quote Options</h2>
        <p className="modal-subtext">
          Would you also like a quote to include the cost of:
        </p>
        <div className="checkbox-group">
          {aaliableOption.map((option) => (
              <FieldCheckbox
                id={option.option}
                name={"extra_add_on"}
                label={option.label}
                value={option.option}
              />
             
          ))}
        </div>
        
      </div>
    </div>


          {/* <FieldTextInput
            className={css.field}
            type="textarea"
            name="message"
            id={formId ? `${formId}.message` : 'message'}
            label={messageLabel}

            placeholder={messagePlaceholder}
            validate={messageRequired}
          /> */}
          <div className={submitButtonWrapperClassName}>
            <ErrorMessage error={sendInquiryError} />
            <div className='mainbuttonWrapper inqueryFromBtns'>
            <PrimaryButton type="submit" inProgress={values?.extra_add_on?.length > 0 ? submitInProgress : false} disabled={values?.extra_add_on?.length > 0}>
              {/* <FormattedMessage id="InquiryForm.submitButtonText" /> */}
              Skip
            </PrimaryButton>

            <PrimaryButton type="submit" inProgress={values?.extra_add_on?.length === 0 ? submitInProgress : false} disabled={values?.extra_add_on?.length === 0}>
              {/* <FormattedMessage id="InquiryForm.submitButtonText" /> */}
              Update Quote
            </PrimaryButton>
            </div>

          </div>
        </Form>
      );
    }}
  />
);

export default InquiryForm;
