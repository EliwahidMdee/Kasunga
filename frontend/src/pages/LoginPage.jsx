import LoginForm from '../components/auth/LoginForm';

const LoginPage = ({ onSuccess, onSwitchToRegister }) => {
  return <LoginForm onSuccess={onSuccess} onSwitchToRegister={onSwitchToRegister} />;
};

export default LoginPage;
