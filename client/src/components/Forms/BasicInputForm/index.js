import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'src/utils/misc';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import styles from './styles.scss';

const { func, array, object } = PropTypes;

function mapFieldPropsToState(fieldNames, fieldValues) {
  return fieldNames.reduce(
    (acc, field) => ({ ...acc, [field]: fieldValues[field] || '' }),
    {},
  );
}

export default class BasicInputForm extends PureComponent {
  static propTypes = {
    onSubmit: func,
    fieldNames: array,
    fieldValues: object,
  };

  static defaultProps = {
    onSubmit: noop,
    fieldValues: {},
  };

  constructor(props) {
    super(props);
    const { fieldNames, fieldValues } = this.props;

    this.state = mapFieldPropsToState(fieldNames, fieldValues);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { fieldValues: curFieldValues, fieldNames } = this.props;
    const { fieldValues: nextFieldValues } = nextProps;

    // [TODO] Optimise this check
    if (curFieldValues !== nextFieldValues) {
      this.setState(mapFieldPropsToState(fieldNames, nextFieldValues));
    }
  }

  onInputChange = (ev) => {
    const {
      value,
      dataset: { id: field },
    } = ev.currentTarget;

    this.setState({ [field]: value });
  }

  onSubmitClick = () => {
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <div className={styles.basicInputForm}>
        {
          this.props.fieldNames.map((field) => (
            <Input
              placeholder={field}
              data-id={field}
              key={field}
              value={this.state[field]}
              onChange={this.onInputChange}
            />
          ))
        }
        <Button
          onClick={this.onSubmitClick}
          preventMultipleClicks
        >
          Submit
        </Button>
      </div>
    );
  }
}
