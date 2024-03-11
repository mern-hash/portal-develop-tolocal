import { FunctionComponent, ReactElement } from "react";
import { Tile } from "carbon-components-react";
import { CenteredBlock } from "@/components/features";
import { Link } from "react-router-dom";

const NotFound: FunctionComponent = (): ReactElement => {
  return (
    <CenteredBlock>
      <Tile>
        Error 404, page not found.
        <br />
        <Link to="/">Get to safety</Link>
      </Tile>
    </CenteredBlock>
  );
};

export default NotFound;
