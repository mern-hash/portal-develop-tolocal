//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent, ReactElement, useState } from "react";
import "../auth.scss";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
//ANCHOR - Components
import { Button } from "@/components/ui";
import { Form, Heading, TextInput, Stack } from "carbon-components-react";
//ANCHOR - Api
import { authRecover } from "@/api";
import { useMutation } from "@tanstack/react-query";
//ANCHOR - Util
import { validateEmailPattern } from "@/shared/validations";
import { invalidInput } from "@/shared/errorText";
//!SECTION

const Recover: FunctionComponent = (): ReactElement => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<{
    email: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  //ANCHOR - Recover useMutation
  const { mutate } = useMutation(
    (data: { email: string }) => authRecover(data),
    {
      // There's no error, "If account exists..." so basically it's always true
      onSuccess: () => {
        setSubmitted(true);
      },
    }
  );

  //SECTION - renderContent
  const renderContent = () => {
    //ANCHOR - !submitted
    if (!submitted) {
      return (
        <Form onSubmit={handleSubmit((data) => mutate(data))}>
          <Stack gap={7} className="auth__stack">
            <TextInput
              id="email"
              labelText="Email"
              placeholder="Enter email"
              type="email"
              {...register("email", {
                required: "Required field",
                pattern: {
                  value: validateEmailPattern,
                  message: "Invalid email pattern",
                },
              })}
              {...invalidInput(errors, "email")}
              data-testid="recover-email"
            />
            <Button
              label="Send recovery link"
              type="submit"
              icon="arrow"
              kind="primary"
              full
            />
          </Stack>
        </Form>
      );
    }

    //ANCHOR - submitted
    return (
      <Stack gap={7} className="auth__stack">
        <p className="auth__text">
          If account exists for the email <strong>{getValues().email}</strong>
          , instructions for resetting your password will be sent to it.
          <br />
          <br />
          You'll receive this email within 5 minutes. Be sure to check your spam
          folder, too.
        </p>
      </Stack>
    );
  };
  //!SECTION

  //ANCHOR - return()
  return (
    <>
      <Helmet>
        <title>Recover account</title>
      </Helmet>
      <Heading className="auth__heading">
        {submitted ? "Recovery link sent!" : "Forgot password?"}
      </Heading>
      {renderContent()}
      <Link
        className="cds--link auth__return-link"
        to="/auth/login/institution"
      >
        Return to log in
      </Link>
    </>
  );
};

export default Recover;
