import { useParams } from "react-router-dom";
export default function Requests() {
  const { email } = useParams();

  return (
    <div>
      <h1>Requests Page</h1>
      {email && <p>Creator Email: {email}</p>}
    </div>
  );
}
