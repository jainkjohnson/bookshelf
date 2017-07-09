import React from 'react';
import { any, func } from 'prop-types';
import Button from 'src/components/Button';
import styles from './styles.scss';

const Modal = (props) => {
  const { header, footer, body, onClose } = props;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {header}
          {
            typeof onClose === 'function' &&
            <Button className={styles.close} onClick={onClose} >
              &times;
            </Button>
          }
        </div>
        <div className={styles.modalBody}>
          {body}
        </div>
        <div className={styles.modalFooter}>
          {footer}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  // elements
  header: any,
  body: any,
  footer: any,
  // actions
  onClose: func,
};

export default Modal;
