import React, { useState } from 'react';

export const Login = ({onSubmit}) => {   
const [username, setUsername] = useState('');
const [error, setError] = useState(''); 

const handleUsernameChange = (event) => {
    setUsername(event.target.value);
};  

const handleLogin = () => {
    if (username.trim() === '') {
      setError('Please enter a username.');
      return;
    }

    setError('');   
    // Here you would typically handle the login logic, e.g., API call
    console.log('Logging in with username:', username);


    // Reset the username after login
    setUsername('');
}       

return (
    // use form way <form> to handle submit
    <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(username); }}>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter your username"
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Login</button>
        </form>
    </div>
    
);
};
