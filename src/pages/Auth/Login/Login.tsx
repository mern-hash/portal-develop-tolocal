//SECTION - Imports
//ANCHOR - Core
import { FunctionComponent } from "react";
import "../auth.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
//ANCHOR - Api
import { login } from "@/api";
import { useMutation } from "@tanstack/react-query";
//ANCHOR - Components
import { Button, ToastNotification } from "@/components/ui";
import {
  Form,
  Heading,
  PasswordInput,
  Stack,
  TextInput,
} from "carbon-components-react";
//ANCHOR - Util
import { setToken } from "@/core/storage";
import { invalidInput, errorMessages } from "@/shared/errorText";
import { validateEmailPattern } from "@/shared/validations";
//ANCHOR - Types and constants
import { ILogin, IToken } from "@/shared/types";
import { ACCOUNT_PATH_TYPES } from "@/core/constants";
//!SECTION

/**
 * @description Login form with email and password
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/pages/Auth/Login/Login.ts
 */
const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const { account_type } = useParams();

  //ANCHOR - RHF Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ILogin>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      client_id: "web",
      grant_type: "password",
    },
  });

  //ANCHOR - Login useMutation
  const { isError, mutate } = useMutation(
    (data: ILogin) => login(data, account_type!),
    {
      onSuccess: (data: IToken) => {
        /** Set token to localstorage */
        setToken(JSON.stringify(data));
      },
      onSettled: (data: IToken | undefined) => {
        /** onSettled tends to call itself before setting token is complete,
         * that showed "updating unmounted component" warning when redirecting,
         * wrapping navigate in setTimeout ensures that it gets called after onSuccess
         */
        if (data) setTimeout(() => navigate("/"), 0);
      },
    }
  );
  //ANCHOR - return()

  return (
    <section className="auth">
      <Helmet>
        <title>Log in to Certie</title>
      </Helmet>
      <Heading className="auth__heading">Log in to certie</Heading>

      <Form onSubmit={handleSubmit(() => mutate(getValues()))}>
        {isError && (
          <ToastNotification
            type="toast"
            title="Sorry, "
            subtitle="Wrong Email or Password. Please try again."
            customClass="auth__error"
            kind="error"
            full
            timeout={6000}
          />
        )}

        <Stack gap={7} className="auth__stack">
          {/** Email input, but for auth2 reqs it's required to be
           * called username when data is being sent */}
          <TextInput
            id="email"
            labelText="Email"
            placeholder="Enter email"
            type="email"
            {...register("username", {
              required: errorMessages.required,
              pattern: {
                value: validateEmailPattern,
                message: errorMessages.email,
              },
            })}
            {...invalidInput(errors, "username")}
            data-testid="login-email"
          />

          <Stack gap={2}>
            <PasswordInput
              id="password"
              labelText="Password"
              placeholder="Password"
              {...register("password", {
                // Only "required" validation here as we don't want to give
                // unnecessary pattern info to potential non-owners of account
                required: errorMessages.required,
              })}
              {...invalidInput(errors, "password")}
              data-testid="login-password"
            />
            {account_type === ACCOUNT_PATH_TYPES.INSTITUTION ? (
              <Link className="auth__link" to="/auth/recover">
                Forgot your password?
              </Link>
            ) : undefined}
          </Stack>
          <Button
            kind="primary"
            label="Log in"
            type="submit"
            icon="arrow"
            full
          />
        </Stack>
      </Form>
    </section>
  );
};

export default Login;
