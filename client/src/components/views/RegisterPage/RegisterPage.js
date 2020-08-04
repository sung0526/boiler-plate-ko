import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleEmailChange = (e) => {
        setEmail(e.currentTarget.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.currentTarget.value)
    }
    const handleNameChange = (e) => {
        setName(e.currentTarget.value)
    }
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(password != confirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body = {
            email: email,
            password: password,
            name: name
        }

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success){
                props.history.push('/login');
            } else{
                alert('Failed to sign up');
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
                <label>이름</label>
                <input type="Name" value={name} onChange={handleNameChange} />
                
                <label>이메일</label>
                <input type="email" value={email} onChange={handleEmailChange} />

                <label>비밀번호</label>
                <input type="password" value={password} onChange={handlePasswordChange} />

                <label>비밀번호 확인</label>
                <input type="ConfirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />

                <br/>

                <button type="submit">
                    회원가입
                </button>
                
            </form>
        </div>
    )
}

export default RegisterPage