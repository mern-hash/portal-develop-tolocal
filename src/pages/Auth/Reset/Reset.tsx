//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useState } from "react";
import "../auth.scss";
import { Link, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
//ANCHOR - Carbon
import { Form, Heading, Stack, PasswordInput } from "carbon-components-react";
//ANCHOR - Api
import { useMutation } from "@tanstack/react-query";
import { authReset } from "@/api";
import { AxiosError } from "axios";
//ANCHOR - Components
import { Button, ToastNotification } from "@/components/ui";
//ANCHOR - Util
import { validatePasswordPattern } from "@/shared/validations";
import { invalidInput, errorMessages } from "@/shared/errorText";
import { Helmet } from "react-helmet-async";
//!SECTION

const Reset: FunctionComponent = (): ReactElement => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { token } = useParams();

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{
    password: string;
    confirm_password: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  //ANCHOR - Reset useMutation
  const { mutate, isError } = useMutation(
    (data: { password: string; token: string }) => authReset(data),
    {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err: AxiosError) => {
        setErrorMsg(err.response?.data!["message"]);
      },
    }
  );

  const onSubmit: SubmitHandler<{
    password: string;
    confirm_password: string;
  }> = (data) => {
    mutate({ password: data.password, token: token! });
  };

  //ANCHOR - content
  const renderContent = () => {
    if (!submitted) {
      return (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={7} className="auth__stack">
            <PasswordInput
              id="password"
              labelText="Password"
              placeholder="New password"
              {...register("password", {
                required: "Required field",
                pattern: {
                  value: validatePasswordPattern,
                  message: errorMessages.password,
                },
              })}
              {...invalidInput(errors, "password")}
              data-testid="reset-password"
            />

            <PasswordInput
              id="confirm_password"
              labelText="Confirm password"
              placeholder="Confirm new password"
              {...register("confirm_password", {
                required: "Required field",
                pattern: {
                  value: validatePasswordPattern,
                  message: errorMessages.password,
                },
                validate: (val: string) => {
                  if (watch("password") !== val) {
                    return errorMessages.password_match;
                  }
                },
              })}
              {...invalidInput(errors, "confirm_password")}
              data-testid="reset-confirm_password"
            />
            <Button
              label="Change password"
              type="submit"
              icon="arrow"
              kind="primary"
              full
            />
          </Stack>
        </Form>
      );
    }

    return (
      <>
        <p className="auth__text auth__stack">
          Success! Your password has been changed. You can now log in using your
          new password.
        </p>
        <Link
          className="cds--link auth__return-link"
          to="/auth/login/institution"
        >
          Return to log in
        </Link>
      </>
    );
  };

  //ANCHOR - return()
  return (
    <>
      <Helmet>
        <title>Set password</title>
      </Helmet>
      <Heading className="auth__heading">
        {submitted ? "Password changed" : "Choose a new password"}
      </Heading>
      {isError && (
        <ToastNotification
          type="toast"
          title="Error!"
          subtitle={errorMsg}
          customClass="auth__error"
          kind="error"
          full
          timeout={6000}
        />
      )}
      {renderContent()}
    </>
  );
};

export default Reset;
