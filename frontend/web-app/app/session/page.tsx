import { getSession, getUserToken } from "../actions/authActions";
import Heading from "../components/Heading";
import AuthTest from "./AuthTest";

const Session = async () => {
  const session = await getSession();
  const userToken = await getUserToken();

  return (
    <div>
      <Heading title="Session dashboard" />
      <div className="bg-blue-200 border-2 border-blue-500">
        <h3 className="text-lg">Session data</h3>

        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      <div className="mt-4">
        <AuthTest />
      </div>
      <div className="bg-green-200 border-2 border-blue-500">
        <h3 className="text-lg">Token data</h3>

        <pre className="overflow-auto">
          {JSON.stringify(userToken, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Session;
