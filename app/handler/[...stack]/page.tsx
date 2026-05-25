import { StackHandler } from "@stackframe/stack";
import { redirect } from "next/navigation";
import { stackServerApp } from "../../../stack/server";

type StackRouteProps = {
  params: Promise<{
    stack?: string[];
  }> | {
    stack?: string[];
  };
  searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function StackAuthHandler(props: StackRouteProps) {
  const params = await props.params;

  if (params.stack?.[0] === "sign-in" || params.stack?.[0] === "sign-up") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full">
      <StackHandler app={stackServerApp} routeProps={props} />
    </div>
  );
}
