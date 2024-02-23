// Core
import { FunctionComponent, ReactElement } from "react";
import "../auth.scss";
import { useNavigate } from "react-router-dom";
// Components
import { Stack } from "carbon-components-react";
import { Button } from "@/components/ui";

const AuthNav: FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  const authNavButtons = [
    {
      label: "Master admin log in",
      clickFn: () => navigate("login/admin"),
    },
    {
      label: "Institute admin log in",
      clickFn: () => navigate("login/institution"),
    },
  ];

  return (
    <Stack gap={7} className="auth__stack">
      {authNavButtons.map(
        (button: { label: string; clickFn: () => void }, i: number) => (
          <Button
            key={i}
            label={button.label}
            type="button"
            icon="arrow"
            kind="primary"
            clickFn={button.clickFn}
            full
          />
        )
      )}
    </Stack>
  );
};

export default AuthNav;
