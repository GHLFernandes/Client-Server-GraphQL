import React, { useState } from 'react';

export default function SignIn(){
    const [ email, setEmail ] = useState('');
    const [ pass, setPass ] = useState('')


    const handleSubmit = (event) => {
        event.preventDefault();  //metodo q eventos nativos tem p prevenir q se execute o comportamento default do browser (neste caso n deixar o form fzr submit sozinho)
        fetch('http://127.0.0.1:8000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                pass
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log('logged in', data);
        });
    }

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handlePassChange = (e) => setPass(e.target.value);

    return(
        <form onSubmit={handleSubmit} >
            <fieldset>
                <label htmlFor="email">E-mail</label>
                <input id="email" 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    inputMode="email" 
                />
            </fieldset>

            <fieldset>
                <label htmlFor="pass">Senha</label>
                <input id="pass" 
                    type="password"
                    value={pass}
                    onChange={handlePassChange} 
                />
            </fieldset>
            <button type="submit">Entrar</button>
        </form>
    );
}
