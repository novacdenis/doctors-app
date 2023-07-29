import React from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { apiLogin } from "../api";
import { useAuth } from "../provider";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getApiErrorMessages } from "@/utils";

const schema = z.object({
  phone: z.string(),
  password: z.string().min(6),
});

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { initializeSession } = useAuth();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  const onSubmitTestIsSubmitting = async (values: z.infer<typeof schema>) => {
    try {
      const response = await apiLogin(values);
      const continueFrom = new URLSearchParams(window.location.search).get("continueFrom");

      initializeSession(response.data.token, response.data.user);

      if (continueFrom) navigate(continueFrom);
      else navigate("/");
    } catch (error) {
      setApiErrors(getApiErrorMessages(error));
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}>
          <CardHeader className="justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center py-3">
                <img
                  className="mx-auto"
                  src="/assets/logo.svg"
                  width="36"
                  height="36"
                  alt="Doctorchat logo"
                />
              </div>
              <CardTitle className="text-xl">{t("common:welcome_back")}</CardTitle>
              <CardDescription>{t("auth:enter_credentials_to_continue")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {apiErrors && (
                <Alert variant="destructive">
                  <AlertTitle>{t("common:error")}</AlertTitle>
                  <AlertDescription>{t(apiErrors)}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:email_address")}</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:password")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {t("auth:authentication")}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};