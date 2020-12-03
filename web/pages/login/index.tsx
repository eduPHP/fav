import React, { FormEvent, useCallback } from 'react'

const Login: React.FC = () => {
  const handleLogin = useCallback((e: FormEvent) => {
    e.preventDefault()
    console.log(e.currentTarget)
  }, [])

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
