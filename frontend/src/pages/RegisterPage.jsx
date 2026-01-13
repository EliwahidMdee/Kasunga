import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = ({ onSuccess, onSwitchToLogin }) => {
  return <RegisterForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />;
};

export default RegisterPage;
