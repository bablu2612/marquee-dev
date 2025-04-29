/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, FieldTextInput, ValidationError } from '../../components';

import css from './FieldCheckboxGroup.module.css';
import { composeValidators, required } from '../../util/validators';

const FieldCheckboxRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    optionLabelClassName,
    twoColumns,
    id,
    fields,
    options,
    meta,
    selectedItems,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;
  return (
    <fieldset className={`${classes} ${id?.includes('pub_extras_availale') ? 'customfield_classs' : ''}`}>
      {label ? <legend>{label}</legend> : null}
      {id?.includes('pub_extras_availale') &&
      <div className='sub-heading'>
        <span>
          When customers enquire about the availability of your marquee, we will also ask them which extras they would like included in their package.
          Please tick below the extras you are able to offer for rental, and indicate the starting rental price for each.
          You can update the rental price for each extra in your final quote once the customer has enquired about availability.
        </span>
      </div>
      }
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          const textClassName = optionLabelClassName;
          const textClassNameMaybe = textClassName ? { textClassName } : {};
         

          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
                {...textClassNameMaybe}
              />
              {id?.includes('pub_extras_availale') && selectedItems?.includes(option?.key) &&
              <FieldTextInput
              id={`${fieldId}price`}
              name={`${fields.name}_${option?.key}_price`}
              // className={css.title}
              type="text"
              // label={option.label}
              placeholder={"Enter estimate price"}
              validate={composeValidators(required("Required"))}
              // autoFocus={autoFocus}
              className={css.checkboxinput}
            />
              }
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
    </fieldset>
  );
};

// Note: name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in

/**
 * @typedef {Object} CheckboxGroupOption
 * @property {string} key
 * @property {string} label
 */

/**
 * Final Form Field containing checkbox group.
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 * @component
 * @param {Object} props
 * @param {string} props.name this is required for FieldArray (Final Form component)
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {string?} props.optionLabelClassName given to each option
 * @param {string} props.id givent to input
 * @param {ReactNode} props.label the label for the checkbox group
 * @param {Array<CheckboxGroupOption>} props.options E.g. [{ key, label }]
 * @param {boolean} props.twoColumns
 * @returns {JSX.Element} Final Form Field containing multiple checkbox inputs
 */
const FieldCheckboxGroup = props => <FieldArray component={FieldCheckboxRenderer} {...props} />;

export default FieldCheckboxGroup;
