import React from 'react';

import styles from './SubNavbar.module.css';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const SubNavbar = (props: Props) => (
  <nav className={`navbar navbar-expand-sm ${styles.navbar}`} role="navigation">
    <div className="container d-flex justify-content-between flex-nowrap">{props.children}</div>
  </nav>
);

export default SubNavbar;
