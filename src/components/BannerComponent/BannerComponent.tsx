import React from "react";
import styles from "./BannerComponent.module.css";
import { BannerComponentProps } from "../../intefaces/BannerComponentProps";

export const BannerComponent: React.FC<BannerComponentProps> = (props: any) => {
  return (
    <div className={styles.banner}>
      <div className={styles.header}>
        {`Line ${Number(props.selectedElement?.id) + 1}`}
      </div>
      <div className={styles.info}>
        <div className={styles.distance}>
          <div className={styles.label1}>Length(cms)</div>
          <div role="value1" className={styles.value1}>
            {props.selectedElement?.distance}
          </div>
        </div>
        <div className={styles.angle}>
          <div className={styles.label2}>Angle(degrees)</div>
          <div role="value2" className={styles.value2}>
            {props.selectedElement?.angle}
          </div>
        </div>
      </div>
    </div>
  );
};
