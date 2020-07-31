import React, { useState } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleEmailChange = (e) => {
        setEmail(e.currentTarget.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let body = {
            email: email,
            password: password
        }

        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess){
                props.history.push('/');
            } else{
                alert('Error');
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>

            <form 
                style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                
                <label>Email</label>
                <input type="email" value={email} onChange={handleEmailChange} />

                <label>Password</label>
                <input type="password" value={password} onChange={handlePasswordChange} />

                <br/>

                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage