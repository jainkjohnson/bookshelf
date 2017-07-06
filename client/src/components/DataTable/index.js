import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const { arrayOf, object, any, bool, string } = PropTypes;

export const DataRow = ({ children, header, ...other }) => {
  const Column = header ? 'th' : 'td';

  return (
    <tr {...other}>
      {
        React.Children.map(children, (child, index) => {
          const colSpan = child && child.props && child.props.colSpan || 1;

          return React.createElement(Column, { key: index, colSpan }, child);
        })
      }
    </tr>
  );
};

DataRow.propTypes = {
  children: any,
  header: bool,
};

export default class DataTable extends PureComponent {
  static propTypes = {
    rows: arrayOf(object),
    columns: arrayOf(object),
    children: any,
    noHead: bool,
    className: string,
  };

  renderHeaders = () => (
    this.props.columns
      ? this.props.columns.map((colData, index) =>
        <th key={index}>{colData.label}</th>)
      : <th />
  );

  renderCells = (rowData) => (
    this.props.columns.map((colData, index) =>
      <td key={index} data-label={colData.label}>{rowData[colData.key]}</td>)
  );

  renderRows = () => (
    this.props.rows
      ? this.props.rows.map((item, index) =>
        <tr key={index}>{this.renderCells(item)}</tr>)
      : this.props.children
  );

  render() {
    const { className } = this.props;

    return (
      <table className={className}>
        { this.props.noHead ? null : <thead><tr>{this.renderHeaders()}</tr></thead> }
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}
