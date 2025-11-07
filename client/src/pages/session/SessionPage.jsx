import { Outlet, useParams } from 'react-router-dom';

function SessionPage() {
  const { id } = useParams();
 
  return (
    <div>

      <Outlet />
    </div>
  );
}

export default SessionPage;
