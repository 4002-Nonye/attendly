import axios from 'axios';
import { useState } from 'react';

function LinkAcountSample() {
  const params = new URLSearchParams(window.location.search);
  const [password, setPassword] = useState('');
  const token = params.get('token');
  

  const handleLinkAccount = async () => {
    try {
      const data = await axios.post(
        'http://localhost:3000/api/auth/link-account',
        {
          token,
          password,
        },
        { withCredentials: true }
      );
      if (data.statusText === 'OK') window.location.href = '/';
    //   console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>Do you want to link your account?</div>

      <p>Enter password to confirm it is you</p>
      <input type='text' onChange={(e) => setPassword(e.target.value)} />

      <button onClick={() => handleLinkAccount()}>Yes</button>
      <button>No</button>
    </>
  );
}

export default LinkAcountSample;
