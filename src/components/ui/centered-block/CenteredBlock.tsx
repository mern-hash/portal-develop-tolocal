import { FunctionComponent, ReactNode } from "react";
import { Grid, Theme, Column } from "carbon-components-react";
import styles from "./centered-block.module.scss";

/**
 * @description Creates a component for auth-related forms (and 404 error page) to center them on the screen.
 * Uses Carbon's grid and column to create and position container on the screen, for content to be
 * rendered in, and different theme to global so that container is different color.
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/components/features/CenteredBlock/CenteredBlock.tsx#L1
 *
 * @example ```tsx
 * <CenteredBlock>
 *  <div>will be centered</div>
 * </CenteredBlock>
 * ```
 */
const CenteredBlock: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <Grid className={styles.grid}>
      <Column
        lg={{ span: 6, offset: 5 }}
        md={{ span: 6, offset: 1 }}
        sm={{ span: 4 }}
      >
        <Theme theme="g10">{children}</Theme>
      </Column>
    </Grid>
  );
};

export default CenteredBlock;
