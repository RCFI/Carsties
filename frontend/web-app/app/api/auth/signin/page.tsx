import EmptyFilter from "@/app/components/EmptyFilter";

const SignIn = ({
  searchParams,
}: {
  searchParams: { callbackUrl: string };
}) => (
  <EmptyFilter
    showLogin
    title="You need to be logged in to do that"
    subtitle="Please click below to sign in"
    callbackUrl={searchParams.callbackUrl}
  />
);

export default SignIn;
