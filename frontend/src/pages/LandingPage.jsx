import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import '../styles/pages/landing.css';

/**
 * LandingPage - Página de entrada con login y registro
 * Primera página que ven los usuarios antes de acceder a la tienda
 */
function LandingPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!loginData.email || !loginData.password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            navigate('/store');
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }

        setLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (registerData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        const result = await register(registerData.name, registerData.email, registerData.password);

        if (result.success) {
            navigate('/store');
        } else {
            setError(result.error || 'Error al registrar usuario');
        }

        setLoading(false);
    };

    return (
        <div className="landing">
            <div className="landing__hero">
                <div className="landing__hero-content">
                    <div className="landing__brand">
                        <span className="landing__brand-icon">🎨</span>
                        <h1 className="landing__brand-title">3D Models Store</h1>
                    </div>
                    <p className="landing__tagline">
                        Descubre una colección increíble de modelos 3D premium para tus proyectos
                    </p>
                    <div className="landing__features">
                        <div className="landing__feature">
                            <span className="landing__feature-icon">✨</span>
                            <span>Modelos de alta calidad</span>
                        </div>
                        <div className="landing__feature">
                            <span className="landing__feature-icon">🚀</span>
                            <span>Descarga instantánea</span>
                        </div>
                        <div className="landing__feature">
                            <span className="landing__feature-icon">💎</span>
                            <span>Precios accesibles</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing__auth">
                <div className="landing__auth-card">
                    <div className="landing__auth-tabs">
                        <button
                            className={`landing__auth-tab ${isLogin ? 'landing__auth-tab--active' : ''}`}
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={`landing__auth-tab ${!isLogin ? 'landing__auth-tab--active' : ''}`}
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                        >
                            Registrarse
                        </button>
                    </div>

                    {error && (
                        <div className="landing__error">
                            ⚠️ {error}
                        </div>
                    )}

                    {isLogin ? (
                        <form className="landing__form" onSubmit={handleLoginSubmit}>
                            <div className="landing__field">
                                <label className="landing__label" htmlFor="login-email">Email</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    className="landing__input"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="landing__field">
                                <label className="landing__label" htmlFor="login-password">Contraseña</label>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    className="landing__input"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>

                            <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
                                {loading ? 'Iniciando...' : 'Acceder a la Tienda'}
                            </Button>

                            <div className="landing__demo">
                                <p className="landing__demo-title">👤 Usuarios de prueba:</p>
                                <ul className="landing__demo-list">
                                    <li>user1@demo.com / pass123</li>
                                    <li>user2@demo.com / pass123</li>
                                </ul>
                            </div>
                        </form>
                    ) : (
                        <form className="landing__form" onSubmit={handleRegisterSubmit}>
                            <div className="landing__field">
                                <label className="landing__label" htmlFor="register-name">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="register-name"
                                    name="name"
                                    className="landing__input"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    placeholder="Juan Pérez"
                                    autoComplete="name"
                                />
                            </div>

                            <div className="landing__field">
                                <label className="landing__label" htmlFor="register-email">Email</label>
                                <input
                                    type="email"
                                    id="register-email"
                                    name="email"
                                    className="landing__input"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="landing__field">
                                <label className="landing__label" htmlFor="register-password">Contraseña</label>
                                <input
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    className="landing__input"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="landing__field">
                                <label className="landing__label" htmlFor="register-confirm">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="register-confirm"
                                    name="confirmPassword"
                                    className="landing__input"
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta y Comenzar'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
